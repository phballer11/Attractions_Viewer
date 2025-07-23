'use client';

import { useEffect, useState } from 'react';
import { parseCSV } from './services/csvService';
import { RestaurantData } from './types/RestaurantData';
import LazyImage from './components/LazyImage';
import Star from './components/Star';
import ThemeToggle from './components/ThemeToggle';
import Select, { ActionMeta, MultiValue, SingleValue } from 'react-select';
import { COUNTRY_OPTIONS, COUNTRY_SELECT_STYLES, TAGS_SELECT_STYLES } from './types/contants';
import { checkIfCountrySupported } from './utils/utilService';
import { collection, addDoc } from 'firebase/firestore';
import { db } from './firebase.config';

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
    const totalPages = Math.ceil(data.length / itemsPerPage);

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

    const handleInputChange = (event: any) => {
        setInputValue(event.target.value);
    };

    const handleAddTag = (event: any) => {
        event.preventDefault();
        if (inputValue.trim() !== '') {
            setTags((prevTags) => [...prevTags, inputValue.trim()]);
            setInputValue('');
        }
    };

    const handleRemoveTag = (tag: string) => {
        setTags((prevTags) => prevTags.filter((t) => t !== tag));
    };

    const handleKeyDown = (event: any) => {
        if (event.key === 'Enter') {
            event.preventDefault();
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
        <>
            <header className="app-header">
                <div className="container">
                    <div className="app-header-content">
                        <h1 className="app-title">Attraction Viewer</h1>
                        <div className="app-controls">
                            <ThemeToggle />
                        </div>
                    </div>
                </div>
            </header>
            
            <main>
                <div className="container">
                    <div className="search-container">
                        <div className="search-header">
                            <div className="country-select-wrapper">
                                <Select
                                    options={COUNTRY_OPTIONS}
                                    styles={COUNTRY_SELECT_STYLES}
                                    value={selectedCountry}
                                    onChange={handleCountryChange}
                                    id="country-select"
                                    placeholder="Select country"
                                    aria-label="Select country"
                                />
                            </div>
                            <div className="search-input-wrapper">
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={handleChange}
                                    placeholder="Search restaurants by name, address, or tag..."
                                    className="input search-input"
                                    aria-label="Search restaurants"
                                />
                            </div>
                        </div>
                        
                        <Select
                            isMulti
                            options={allFilters}
                            styles={TAGS_SELECT_STYLES}
                            id="tags-select"
                            onChange={handleSelectChange}
                            placeholder="Filter by tags and ratings..."
                            aria-label="Filter by tags"
                        />
                    </div>

                    {data ? (
                        <>
                            <div className="results-info">
                                <div className="results-count">
                                    {data.length} {data.length === 1 ? 'restaurant' : 'restaurants'} found
                                </div>
                                <div className="results-pagination-info">
                                    Page {currentPage} of {totalPages}
                                </div>
                            </div>
                            
                            <nav className="pagination" aria-label="Restaurant pagination">
                                <button
                                    className="pagination-button"
                                    onClick={goToPreviousPage}
                                    disabled={currentPage === 1}
                                    aria-label="Go to previous page"
                                >
                                    Previous
                                </button>

                                {Array.from({ length: Math.min(totalPages, 7) }, (_, index) => {
                                    let pageNum;
                                    if (totalPages <= 7) {
                                        pageNum = index + 1;
                                    } else if (currentPage <= 4) {
                                        pageNum = index + 1;
                                    } else if (currentPage >= totalPages - 3) {
                                        pageNum = totalPages - 6 + index;
                                    } else {
                                        pageNum = currentPage - 3 + index;
                                    }
                                    
                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => jumpToPage(pageNum)}
                                            className={`pagination-button ${pageNum === currentPage ? 'active' : ''}`}
                                            aria-label={`Go to page ${pageNum}`}
                                            aria-current={pageNum === currentPage ? 'page' : undefined}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}

                                <button
                                    className="pagination-button"
                                    onClick={goToNextPage}
                                    disabled={currentPage === totalPages}
                                    aria-label="Go to next page"
                                >
                                    Next
                                </button>
                            </nav>

                            <div className="restaurant-grid">
                                {currentPageData.map((result, index) => (
                                    <article className="restaurant-card" key={index} id={result.Id}>
                                        <div className="restaurant-header">
                                            <h2 className="restaurant-title">{result.Name}</h2>
                                            <time className="restaurant-date" dateTime={result.CreatedAt.substring(0, 10)}>
                                                {new Date(result.CreatedAt).toLocaleDateString()}
                                            </time>
                                        </div>

                                        <div className="restaurant-address">
                                            <a href={result.GoogleLink} target="_blank" rel="noopener noreferrer">
                                                {result.Address}
                                            </a>
                                        </div>

                                        <div className="restaurant-details">
                                            {result.Website && (
                                                <div className="restaurant-info-item">
                                                    <span className="restaurant-info-label">Website:</span>
                                                    <span className="restaurant-info-value">
                                                        <a href={result.Website} target="_blank" rel="noopener noreferrer">
                                                            {result.Website}
                                                        </a>
                                                    </span>
                                                </div>
                                            )}
                                            {result.Phone && (
                                                <div className="restaurant-info-item">
                                                    <span className="restaurant-info-label">Phone:</span>
                                                    <span className="restaurant-info-value">{result.Phone}</span>
                                                </div>
                                            )}
                                        </div>

                                        {editModeId !== result.Id && (
                                            <div className="tags-container">
                                                {result.Tags.map((tag, index) => (
                                                    <span className="tag" key={index}>
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        {editModeId === result.Id && (
                                            <div className="edit-container">
                                                <div className="tags-container">
                                                    {tags.map((tag, index) => (
                                                        <span key={index} className="tag tag-removable">
                                                            {tag}
                                                            <button
                                                                className="tag-remove"
                                                                onClick={() => handleRemoveTag(tag)}
                                                                aria-label={`Remove ${tag} tag`}
                                                            >
                                                                ×
                                                            </button>
                                                        </span>
                                                    ))}
                                                </div>
                                                <div className="tag-input-container">
                                                    <input
                                                        type="text"
                                                        className="input tag-input"
                                                        value={inputValue}
                                                        onKeyDown={handleKeyDown}
                                                        onChange={handleInputChange}
                                                        placeholder="Enter a tag"
                                                        aria-label="Add new tag"
                                                    />
                                                    <button className="btn btn-secondary" onClick={handleAddTag}>
                                                        Add Tag
                                                    </button>
                                                </div>
                                                <button
                                                    className="btn btn-primary"
                                                    onClick={() => onTagChangeSubmit(result.Id)}
                                                >
                                                    Save Changes
                                                </button>
                                            </div>
                                        )}

                                        {isAdmin && (
                                            <button
                                                className={`btn ${editModeId === result.Id ? 'btn-secondary' : 'btn-ghost'}`}
                                                onClick={() => handleEditModeClick(result.Id)}
                                                style={{ marginTop: 'var(--space-lg)' }}
                                            >
                                                {editModeId === result.Id ? 'Cancel Edit' : 'Edit Tags'}
                                            </button>
                                        )}

                                        <div className="rating-hours-container">
                                            <div className="rating-section">
                                                <div className="rating">
                                                    <span>{result.Rating.toString().replace('stars', '').trim()}</span>
                                                    <Star />
                                                    <span className="rating-count">({result.RatingCount})</span>
                                                </div>
                                                {formatCountPerRating(result.CountPerRating) &&
                                                    formatCountPerRating(result.CountPerRating).map((rating, index) => (
                                                        <div key={index} className="rating-progress">
                                                            <span className="rating-stars">{rating.grade}</span>
                                                            <div className="rating-bar">
                                                                <div 
                                                                    className="rating-fill" 
                                                                    style={{ width: `${rating.value}%` }}
                                                                />
                                                            </div>
                                                            <span className="rating-count-small">({rating.numberOfReviews})</span>
                                                        </div>
                                                    ))}
                                            </div>

                                            {result.OpeningHours.length > 0 && (
                                                <div className="hours-section">
                                                    <h3>Opening Hours</h3>
                                                    <div className="hours-list">
                                                        {formatOpeningHours(result.OpeningHours).map((hour, index) => (
                                                            <div key={index} className="hours-item">{hour}</div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="info-tile">
                                            <h3>AI Summary</h3>
                                            <p>{result.AiReviewSummary}</p>
                                        </div>

                                        <div className="photo-gallery">
                                            <div className="photo-grid">
                                                {result.Images.map((img, index) => (
                                                    <div key={index} className="photo-item">
                                                        <LazyImage
                                                            src={img}
                                                            alt={`${result.Name} photo ${index + 1}`}
                                                            placeholder="Loading..."
                                                            retryLimit={5}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {result.ChainRestaurantId && getChainRestaurants(result).length > 0 && (
                                            <div className="chain-restaurants">
                                                <h3>Other Locations</h3>
                                                {getChainRestaurants(result).map((chainRestaurant, index) => (
                                                    <div key={index} className="chain-restaurant-item">
                                                        <div className="chain-restaurant-name">
                                                            <a href={`#${chainRestaurant.Id}`}>{chainRestaurant.Name}</a>
                                                        </div>
                                                        <div className="chain-restaurant-address">
                                                            <a href={chainRestaurant.GoogleLink} target="_blank" rel="noopener noreferrer">
                                                                {chainRestaurant.Address}
                                                            </a>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </article>
                                ))}
                            </div>

                            <nav className="pagination" aria-label="Restaurant pagination">
                                <button
                                    className="pagination-button"
                                    onClick={goToPreviousPage}
                                    disabled={currentPage === 1}
                                    aria-label="Go to previous page"
                                >
                                    Previous
                                </button>

                                {Array.from({ length: Math.min(totalPages, 7) }, (_, index) => {
                                    let pageNum;
                                    if (totalPages <= 7) {
                                        pageNum = index + 1;
                                    } else if (currentPage <= 4) {
                                        pageNum = index + 1;
                                    } else if (currentPage >= totalPages - 3) {
                                        pageNum = totalPages - 6 + index;
                                    } else {
                                        pageNum = currentPage - 3 + index;
                                    }
                                    
                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => jumpToPage(pageNum)}
                                            className={`pagination-button ${pageNum === currentPage ? 'active' : ''}`}
                                            aria-label={`Go to page ${pageNum}`}
                                            aria-current={pageNum === currentPage ? 'page' : undefined}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}

                                <button
                                    className="pagination-button"
                                    onClick={goToNextPage}
                                    disabled={currentPage === totalPages}
                                    aria-label="Go to next page"
                                >
                                    Next
                                </button>
                            </nav>
                        </>
                    ) : (
                        <div className="results-info">
                            <div className="results-count">Loading restaurants...</div>
                        </div>
                    )}
                </div>
            </main>
        </>
    );
}