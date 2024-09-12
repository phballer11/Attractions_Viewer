'use client';

import { useEffect, useState } from 'react';
import { parseCSV } from './services/csvService';
import { RestaurantData } from './types/RestaurantData';
import LazyImage from './components/LazyImage';
import Star from './components/Star';
import ProgressBar from './components/ProgressBar/ProgressBar';
import Select, { ActionMeta, MultiValue, SingleValue } from 'react-select';
import { COUNTRY_OPTIONS, COUNTRY_SELECT_STYLES, TAGS_SELECT_STYLES } from './types/contants';

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

    const [allFilters, setAllFilters] = useState<{ value: string; label: string }[]>([]);
    const [selectedFilters, setSelectedFilters] = useState<{ value: string; label: string }[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

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

    const getChainRestaurants = (chainRestaurantId: string | null): RestaurantData[] => {
        if (!chainRestaurantId) {
            return [];
        }

        return data.filter(
            (restaurant) => restaurant.ChainRestaurantId === chainRestaurantId && restaurant.Id !== chainRestaurantId
        );
    };

    return (
        <main>
            {/* <button onClick={sendToFirebase}>Testing to firebase</button> */}
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
                        <div style={{ margin: '0 16px' }}>{data.length} results</div>
                        {data.map((result, index) => (
                            <div className="card" key={index} id={result.Id}>
                                <h1>{result.Name}</h1>

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
                                <div style={{ marginTop: '8px' }}>
                                    {result.Tags.map((tag, index) => (
                                        <div className="tag" key={index}>
                                            {tag}
                                        </div>
                                    ))}
                                </div>
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
                                {result.ChainRestaurantId &&
                                    getChainRestaurants(result.ChainRestaurantId).length > 0 && (
                                        <div className="information-tile">
                                            <h2>Chain restaurants:</h2>
                                            {getChainRestaurants(result.ChainRestaurantId).map(
                                                (chainRestaurant, index) => (
                                                    <div key={index}>
                                                        <p style={{ fontWeight: 700, fontSize: '24px' }}>
                                                            <a href={'#' + chainRestaurant.Id}>
                                                                {chainRestaurant.Name}
                                                            </a>
                                                        </p>

                                                        <p style={{ marginTop: '0' }}>
                                                            <a
                                                                style={{ textDecoration: 'none', color: 'white' }}
                                                                href={result.GoogleLink}
                                                            >
                                                                {result.Address}
                                                            </a>
                                                        </p>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No results yet.</p>
                )}
            </div>
        </main>
    );
}
