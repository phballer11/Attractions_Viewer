'use client';

import { useEffect, useState } from 'react';
import { parseCSV } from './services/csvService';
import { RestaurantData } from './types/RestaurantData';
import LazyImage from './components/LazyImage';
import Star from './components/Star';
import ProgressBar from './components/ProgressBar/ProgressBar';

// TODO:
// Add search bar
// Add filter by rating
// Add filter by tags
// Add countries

// Nice to have:
// Add pagination ?

type CountPerRating = {
    value: string;
    numberOfReviews: number;
    grade: number;
};

export default function Home() {
    const [data, setData] = useState<RestaurantData[]>([]);
    const [showOpeningHours, setShowOpeningHours] = useState<{ [key: string]: boolean }>({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await parseCSV();
                console.log(result);
                setData(result);
            } catch (error) {
                console.error('Error fetching CSV data:', error);
            }
        };

        fetchData();
    }, []);

    const toggleOpeningHours = (id: string) => {
        console.log(id);
        setShowOpeningHours((prev) => ({
            ...prev,
            [id]: !!!prev[id],
        }));
    };

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
                const reviews = parseInt(rating.split(',')[1].trim().split(' ')[0]);
                return total + reviews;
            }, 0);

            return countPerRating.map((rating) => {
                const splitValue = rating.split(',');
                const grade = splitValue[0].split(' ')[0];
                const numberOfReviews = parseInt(splitValue[1].trim().split(' ')[0]);
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

    return (
        <main>
            <div className="container">
                {data ? (
                    <div>
                        {data.map((result, index) => (
                            <div className="card" key={index}>
                                <h1>{result.name}</h1>

                                <h2>
                                    <a style={{ textDecoration: 'none' }} href={result.googleLink}>
                                        {result.address}
                                    </a>
                                </h2>
                                {result.website && (
                                    <p style={{ marginTop: '8px' }}>
                                        <b> Website:</b> <a href={result.website}>{result.website}</a>
                                    </p>
                                )}
                                {result.phone && (
                                    <p style={{ marginTop: '8px' }}>
                                        <b>Phone:</b> {result.phone}
                                    </p>
                                )}
                                <div style={{ margin: '16px 0' }}>
                                    {result.tags.map((tag, index) => (
                                        <div className="tag" key={index}>
                                            {tag}
                                        </div>
                                    ))}
                                </div>
                                <div className="rating_hours_row ">
                                    <div className="rating_section information-tile">
                                        <div className="rating">
                                            <div>{result.rating.toString().replace('stars', '').trim()}</div>
                                            <Star />
                                            <span className="review-count">{result.ratingCount}</span>
                                        </div>
                                        {formatCountPerRating(result.count_per_rating) &&
                                            formatCountPerRating(result.count_per_rating).map((rating, index) => (
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
                                    {result.openingHours.length > 0 && (
                                        <div className="hours_section information-tile">
                                            <h2>Opening Hours:</h2>
                                            <div>
                                                {formatOpeningHours(result.openingHours).map((hour, index) => (
                                                    <p key={index}>{hour}</p>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* {result.count_per_rating.map((rating, index) => (
                                    <p key={index}>{rating}</p>
                                ))} */}

                                {/*
                                <p>{result.chainRestaurantId}</p>
 */}
                                <div className="information-tile">
                                    <h2>AI summary</h2>
                                    <p>{result.ai_review_summary}</p>
                                </div>
                                <div className="photo-gallery">
                                    <div className="photos">
                                        {result.images.map((img, index) => (
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
