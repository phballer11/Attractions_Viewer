'use client';

import { useEffect, useState } from 'react';
import styles from './page.module.css';
import { promptGroq } from './api/groqApiclient';
import { parseCSV } from './services/csvService';
import { RestaurantData } from './types/RestaurantData';
import LazyImage from './components/LazyImage';
import Star from './components/Star';
import PointUpIcon from './components/PointUpIcon';
import PointDownIcon from './components/PointDownIcon';

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

    return (
        <main className={styles.main}>
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
                                <div className="rating_hours_row">
                                    <div className="rating_section">
                                        <div className="rating">
                                            <div>{result.rating.toString().replace('stars', '').trim()}</div>
                                            <Star />
                                            <span className="review-count">{result.ratingCount}</span>
                                        </div>
                                        {/* <div>Counts per rating</div> */}
                                    </div>
                                    {result.openingHours.length > 0 && (
                                        <div className="hours_section">
                                            <h3>Opening Hours</h3>
                                            <div>
                                                {formatOpeningHours(result.openingHours).map((hour, index) => (
                                                    <p key={index}>{hour}</p>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
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
                                {/* {result.count_per_rating.map((rating, index) => (
                                    <p key={index}>{rating}</p>
                                ))} */}

                                {/*
                                <p>{result.chainRestaurantId}</p>

                                <p> {result.ai_review_summary}</p> */}
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
                                <div className="information-tile">
                                    <h2>AI summary</h2>
                                    <p>{result.ai_review_summary}</p>
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
