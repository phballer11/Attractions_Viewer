'use client';

import { useEffect, useState } from 'react';
import { parseCSV } from './services/csvService';
import { RestaurantData } from './types/RestaurantData';
import LazyImage from './components/LazyImage';
import Star from './components/Star';
import ProgressBar from './components/ProgressBar/ProgressBar';
import Select, { ActionMeta, MultiValue, SingleValue } from 'react-select';
import { COUNTRY_OPTIONS, COUNTRY_SELECT_STYLES, TAGS_SELECT_STYLES } from './types/contants';
import { checkIfCountrySupported } from './utils/utilService';
import { collection, addDoc } from 'firebase/firestore';
import { db } from './firebase.config';

// TODO:
// Add countries

type CountPerRating = {
    value: string;
    numberOfReviews: number;
    grade: number;
};

export default function Home() {
    const [selectedCountry, setSelectedCountry] = useState(COUNTRY_OPTIONS[0]);

    const [data, setData] = useState<RestaurantData[]>([]);
    const [ogData, setOgData] = useState<RestaurantData[]>([]);
    const [currentPageData, setCurrentData] = useState<RestaurantData[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);

    const itemsPerPage = 20;
    // Calculate the total number of pages
    const totalPages = Math.ceil(data.length / itemsPerPage);

    // Get current items for the page
    // const currentData = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const goToNextPage = () => {
        if (currentPage < totalPages) {
            const newPage = currentPage + 1;
            setCurrentPage(newPage);
            setCurrentData(data.slice((newPage - 1) * itemsPerPage, newPage * itemsPerPage));
            window.scrollTo({
                top: 0,
                behavior: 'smooth',
            });
        }
    };

    const goToPreviousPage = () => {
        if (currentPage > 1) {
            const newPage = currentPage - 1;
            setCurrentPage(newPage);
            setCurrentData(data.slice((newPage - 1) * itemsPerPage, newPage * itemsPerPage));
            window.scrollTo({
                top: 0,
                behavior: 'smooth',
            });
        }
    };

    const jumpToPage = (page: number) => {
        if (data.length === 0) {
            setCurrentData([]);
        }
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            setCurrentData(data.slice((page - 1) * itemsPerPage, page * itemsPerPage));
            window.scrollTo({
                top: 0,
                behavior: 'smooth',
            });
        }
    };
    useEffect(() => {
        jumpToPage(1);
    }, [data]);

    const [allFilters, setAllFilters] = useState<{ value: string; label: string }[]>([]);
    const [selectedFilters, setSelectedFilters] = useState<{ value: string; label: string }[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [editModeId, setIsEditMode] = useState<string>('');

    const [tags, setTags] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState('');

    const staticRatingTags = ['0-1 star', '1-2 stars', '2-3 stars', '3-4 stars', '4 stars+'];

    const handleCountryChange = (selectedOption: SingleValue<{ value: string; label: string }>) => {
        if (!selectedOption) {
            return;
        }
        setSelectedCountry({
            value: selectedOption.value,
            label: selectedOption.label,
        });

        fetchData(selectedOption.value);
    };

    const handleSelectChange = (
        selectedOptions: MultiValue<{ value: string; label: string }>,
        actionMeta: ActionMeta<{ value: string; label: string }>
    ) => {
        setSelectedFilters(selectedOptions.map((option: any) => option));
        search(
            searchTerm,
            selectedOptions.map((filter: any) => filter.value)
        );
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newSearchTerm = e.target.value.toLowerCase();
        setSearchTerm(newSearchTerm);

        search(
            newSearchTerm,
            selectedFilters.map((filter) => filter.value)
        );
    };

    const search = (searchTerm: string, selectedFilters: string[]) => {
        let searchedData = ogData.filter((restaurant) => {
            if (restaurant.Name.toLowerCase().includes(searchTerm)) {
                return true;
            }

            if (restaurant.Address.toLowerCase().includes(searchTerm)) {
                return true;
            }

            if (restaurant.Tags.some((tag) => tag.toLowerCase().includes(searchTerm))) {
                return true;
            }

            return false;
        });

        // extract out static rating tags
        const staticRatingTags = selectedFilters.filter(
            (filter) =>
                filter === '0-1 star' ||
                filter === '1-2 stars' ||
                filter === '2-3 stars' ||
                filter === '3-4 stars' ||
                filter === '4 stars+'
        );

        if (staticRatingTags.length > 0) {
            const ratingFilter = staticRatingTags.map((tag) => {
                if (tag === '0-1 star') {
                    return (restaurant: RestaurantData) =>
                        parseFloat(restaurant.Rating.toString().replace('stars', '').trim()) < 1;
                } else if (tag === '1-2 stars') {
                    return (restaurant: RestaurantData) =>
                        parseFloat(restaurant.Rating.toString().replace('stars', '').trim()) >= 1 &&
                        parseFloat(restaurant.Rating.toString().replace('stars', '').trim()) < 2;
                } else if (tag === '2-3 stars') {
                    return (restaurant: RestaurantData) =>
                        parseFloat(restaurant.Rating.toString().replace('stars', '').trim()) >= 2 &&
                        parseFloat(restaurant.Rating.toString().replace('stars', '').trim()) < 3;
                } else if (tag === '3-4 stars') {
                    return (restaurant: RestaurantData) =>
                        parseFloat(restaurant.Rating.toString().replace('stars', '').trim()) >= 3 &&
                        parseFloat(restaurant.Rating.toString().replace('stars', '').trim()) < 4;
                } else if (tag === '4 stars+') {
                    return (restaurant: RestaurantData) =>
                        parseFloat(restaurant.Rating.toString().replace('stars', '').trim()) >= 4;
                }
                return () => false;
            });
            searchedData = searchedData.filter((restaurant) => {
                return ratingFilter.every((filter) => filter(restaurant));
            });
        }

        const filtersWithoutRating = selectedFilters.filter(
            (filter) =>
                filter !== '0-1 star' &&
                filter !== '1-2 stars' &&
                filter !== '2-3 stars' &&
                filter !== '3-4 stars' &&
                filter !== '4 stars+'
        );

        const filteredData = searchedData.filter((restaurant) => {
            return filtersWithoutRating.every((filter) => restaurant.Tags.includes(filter));
        });

        setData(filteredData);
    };

    const fetchData = async (country: string) => {
        try {
            const result = await parseCSV(country);
            const allTags = result.map((restaurant) => restaurant.Tags).flat();
            allTags.push(...staticRatingTags);

            const uniqueTags = Array.from(new Set(allTags));
            const tags = uniqueTags.map((tag) => ({ value: tag, label: tag }));

            setAllFilters(tags);
            setData(result);
            setOgData(result);
        } catch (error) {
            console.error('Error fetching CSV data:', error);
        }
    };

    useEffect(() => {
        fetchData('japan');
        if (sessionStorage.getItem('user') === 'admin') {
            setIsAdmin(true);
        }
    }, []);

    const formatOpeningHours = (openingHours: string[]) => {
        if (openingHours.length === 0) {
            return [];
        }
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

        const sortByDayOrder = (a: string, b: string) => {
            const dayA = a.split(',')[0].trim();
            const dayB = b.split(',')[0].trim();

            return daysOfWeek.indexOf(dayA) - daysOfWeek.indexOf(dayB);
        };

        return openingHours.sort(sortByDayOrder);
    };

    const formatCountPerRating = (countPerRating: string[]): CountPerRating[] => {
        /*
        5 stars, 294 reviews"
        "4 stars, 125 reviews"
        "3 stars, 44 reviews"
        "2 stars, 21 reviews"
        "1 stars, 60 reviews"
        */
        try {
            const totalReviews = countPerRating.reduce((total, rating) => {
                const reviews = parseInt(rating.split(/,(.+)/)[1].trim().replace(',', '').split(' ')[0]);
                return total + reviews;
            }, 0);

            return countPerRating.map((rating) => {
                const splitValue = rating.split(/,(.+)/);
                const grade = splitValue[0].split(' ')[0];
                const numberOfReviews = parseInt(splitValue[1].trim().replace(',', '').split(' ')[0]);
                const value = ((numberOfReviews / totalReviews) * 100).toFixed(0);

                return {
                    value,
                    numberOfReviews,
                    grade: parseInt(grade, 10),
                };
            });
        } catch (error) {
            return [];
        }
    };

    const getChainRestaurants = (restaurant: RestaurantData): RestaurantData[] => {
        if (!restaurant.ChainRestaurantId) {
            return [];
        }

        return data.filter((d) => d.ChainRestaurantId === restaurant.ChainRestaurantId && d.Id !== restaurant.Id);
    };

    // Handle input change
    const handleInputChange = (event: any) => {
        setInputValue(event.target.value);
    };

    // Handle adding a tag
    const handleAddTag = (event: any) => {
        event.preventDefault();
        if (inputValue.trim() !== '') {
            setTags((prevTags) => [...prevTags, inputValue.trim()]);
            setInputValue('');
        }
    };

    // Handle removing a tag
    const handleRemoveTag = (tag: string) => {
        setTags((prevTags) => prevTags.filter((t) => t !== tag));
    };

    const handleKeyDown = (event: any) => {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent the default Enter key behavior
            handleAddTag(event);
        }
    };

    const handleEditModeClick = (id: string) => {
        if (editModeId === id) {
            setIsEditMode('');
            setTags([]);
        } else {
            setIsEditMode(id);
            setTags(data.find((restaurant) => restaurant.Id === id)?.Tags || []);
        }
    };

    const onTagChangeSubmit = async (id: string) => {
        const ogTags = data.find((restaurant) => restaurant.Id === id)?.Tags || [];
        const uniqueTags = Array.from(new Set(tags.map((tag) => tag.toLocaleLowerCase())));
        if (arraysAreEqual(ogTags, uniqueTags) || !checkIfCountrySupported(selectedCountry.value)) {
            setIsEditMode('');
            setTags([]);
            return;
        }
        const itemsRef = collection(db, 'updateTagsJobs');
        await addDoc(itemsRef, {
            id: id,
            tags: uniqueTags,
            country: selectedCountry.value,
        });

        setIsEditMode('');
        setTags([]);
        alert('Submitted tag updates, please allow up to 10 mins for data to sync up.');
    };

    const arraysAreEqual = (arr1: string[], arr2: string[]): boolean => {
        if (arr1.length !== arr2.length) {
            return false;
        }

        const sortedArr1 = [...arr1].sort();
        const sortedArr2 = [...arr2].sort();

        return sortedArr1.every((value, index) => value === sortedArr2[index]);
    };

    return (
        <main>
            <div className="container">
                <div style={{ width: '50%' }}>
                    <Select
                        options={COUNTRY_OPTIONS}
                        styles={COUNTRY_SELECT_STYLES}
                        value={selectedCountry}
                        onChange={handleCountryChange}
                        id="country-select"
                        placeholder="Select country"
                    />
                </div>
                {data ? (
                    <div>
                        <div className="search-container">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={handleChange}
                                placeholder="Search..."
                                className="search-input"
                            />
                        </div>
                        <Select
                            isMulti
                            options={allFilters}
                            styles={TAGS_SELECT_STYLES}
                            id="tags-select"
                            onChange={handleSelectChange}
                            placeholder="Filter by tags..."
                        />
                        <div style={{ margin: '0 16px', fontSize: '24px' }}>{data.length} results</div>
                        <div style={{ margin: '16px', fontSize: '16px' }}>
                            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                                <button
                                    style={{ width: '70px' }}
                                    onClick={goToPreviousPage}
                                    disabled={currentPage === 1}
                                >
                                    Previous
                                </button>

                                {Array.from({ length: totalPages }, (_, index) => (
                                    <button
                                        key={index + 1}
                                        onClick={() => jumpToPage(index + 1)}
                                        className={index + 1 === currentPage ? 'active page' : 'page'}
                                    >
                                        {index + 1}
                                    </button>
                                ))}

                                <button
                                    style={{ width: '70px' }}
                                    onClick={goToNextPage}
                                    disabled={currentPage === totalPages}
                                >
                                    Next
                                </button>
                            </div>

                            <p>
                                Page {currentPage} of {totalPages}
                            </p>
                        </div>
                        {currentPageData.map((result, index) => (
                            <div className="card" key={index} id={result.Id}>
                                <div className="flex_row" style={{ justifyContent: 'space-between' }}>
                                    <h1>{result.Name}</h1>
                                    <span>Data collected on {result.CreatedAt.substring(0, 10)}</span>
                                </div>

                                <h2>
                                    <a style={{ textDecoration: 'none' }} href={result.GoogleLink} target="_blank">
                                        {result.Address}
                                    </a>
                                </h2>
                                {result.Website && (
                                    <p style={{ marginTop: '8px' }}>
                                        <b> Website:</b>{' '}
                                        <a href={result.Website} target="_blank">
                                            {result.Website}
                                        </a>
                                    </p>
                                )}
                                {result.Phone && (
                                    <p style={{ marginTop: '8px' }}>
                                        <b>Phone:</b> {result.Phone}
                                    </p>
                                )}

                                {editModeId !== result.Id && (
                                    <div style={{ marginTop: '8px' }}>
                                        {result.Tags.map((tag, index) => (
                                            <div className="tag" key={index}>
                                                {tag}
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {(editModeId === result.Id) === true && (
                                    <div>
                                        <div className="tagsContainer">
                                            {tags.map((tag, index) => (
                                                <div key={index} className="tagItem">
                                                    {tag}
                                                    <button
                                                        className="removeButton"
                                                        onClick={() => handleRemoveTag(tag)}
                                                    >
                                                        &times; {/* "x" icon */}
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex_row" style={{ marginBottom: '24px' }}>
                                            <input
                                                type="text"
                                                style={{
                                                    fontSize: '18px',
                                                    padding: '10px',
                                                    width: '300px',
                                                    height: '40px',
                                                    borderRadius: '5px',
                                                    border: '1px solid #ccc',
                                                }}
                                                value={inputValue}
                                                onKeyDown={handleKeyDown}
                                                onChange={handleInputChange}
                                                placeholder="Enter a tag"
                                            />
                                            <button className="button btn-submit" onClick={handleAddTag}>
                                                Add Tag
                                            </button>
                                        </div>
                                        <button
                                            className="button btn-submit"
                                            onClick={() => onTagChangeSubmit(result.Id)}
                                        >
                                            Save
                                        </button>
                                    </div>
                                )}
                                {isAdmin && (
                                    <button
                                        style={{ margin: '16px 0' }}
                                        className="button"
                                        onClick={() => handleEditModeClick(result.Id)}
                                    >
                                        {editModeId === result.Id ? 'Cancel' : 'Edit tags'}
                                    </button>
                                )}
                                <div className="rating_hours_row ">
                                    <div className="rating_section information-tile">
                                        <div className="rating">
                                            <div>{result.Rating.toString().replace('stars', '').trim()}</div>
                                            <Star />
                                            <span className="review-count">{result.RatingCount}</span>
                                        </div>
                                        {formatCountPerRating(result.CountPerRating) &&
                                            formatCountPerRating(result.CountPerRating).map((rating, index) => (
                                                <div key={index}>
                                                    <div className="flex_row" style={{ marginTop: '6px' }}>
                                                        <span style={{ width: '10px' }}>{rating.grade}</span>
                                                        <ProgressBar progress={rating.value} />
                                                        <span style={{ width: '30px' }}>
                                                            ({rating.numberOfReviews})
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                    {result.OpeningHours.length > 0 && (
                                        <div className="hours_section information-tile">
                                            <h2>Opening Hours:</h2>
                                            <div>
                                                {formatOpeningHours(result.OpeningHours).map((hour, index) => (
                                                    <p key={index}>{hour}</p>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="information-tile" style={{ marginBottom: '24px' }}>
                                    <h2>AI summary</h2>
                                    <p>{result.AiReviewSummary}</p>
                                </div>
                                <div className="photo-gallery">
                                    <div className="photos">
                                        {result.Images.map((img, index) => (
                                            <LazyImage
                                                key={index}
                                                src={img}
                                                alt=""
                                                placeholder="Loading..."
                                                retryLimit={5}
                                            />
                                        ))}
                                    </div>
                                </div>
                                {result.ChainRestaurantId && getChainRestaurants(result).length > 0 && (
                                    <div className="information-tile">
                                        <h2>Chain restaurants:</h2>
                                        {getChainRestaurants(result).map((chainRestaurant, index) => (
                                            <div key={index}>
                                                <p style={{ fontWeight: 700, fontSize: '24px' }}>
                                                    <a href={'#' + chainRestaurant.Id}>{chainRestaurant.Name}</a>
                                                </p>

                                                <p style={{ marginTop: '0' }}>
                                                    <a
                                                        style={{ textDecoration: 'none', color: 'white' }}
                                                        href={chainRestaurant.GoogleLink}
                                                    >
                                                        {chainRestaurant.Address}
                                                    </a>
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                        <div style={{ margin: '16px', fontSize: '16px' }}>
                            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                                <button
                                    style={{ width: '70px' }}
                                    onClick={goToPreviousPage}
                                    disabled={currentPage === 1}
                                >
                                    Previous
                                </button>

                                {Array.from({ length: totalPages }, (_, index) => (
                                    <button
                                        key={index + 1}
                                        onClick={() => jumpToPage(index + 1)}
                                        className={index + 1 === currentPage ? 'active page' : 'page'}
                                    >
                                        {index + 1}
                                    </button>
                                ))}

                                <button
                                    style={{ width: '70px' }}
                                    onClick={goToNextPage}
                                    disabled={currentPage === totalPages}
                                >
                                    Next
                                </button>
                            </div>

                            <p>
                                Page {currentPage} of {totalPages}
                            </p>
                        </div>
                    </div>
                ) : (
                    <p>No results yet.</p>
                )}
            </div>
        </main>
    );
}
