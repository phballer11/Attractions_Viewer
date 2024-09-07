'use client';

import { useEffect, useState } from 'react';
import styles from './page.module.css';
import { promptGroq } from './api/groqApiclient';
import { parseCSV } from './services/csvService';
import { RestaurantData } from './types/RestaurantData';
import LazyImage from './components/LazyImage';

// TODO:
// Add button to save entry to C# backend
// Add feature to mark chain restaurants together
// Add csv input to upload data
// add csv limit

// TODO - viewer:
// Create new project with plain html javscript to view data

// TODO - saver:
// Create C# backend to save data
export default function Home() {
    const [aiResults, setAiResults] = useState<{ [key: string]: string }>({}); // State to hold the API results
    const [data, setData] = useState<RestaurantData[]>([]);

    // const handleSearch = async (restaruant: RestaurantData) => {
    //     const searchQuery = `${JSON.stringify(
    //         restaruant
    //     )} Summarise the reviews, signature dish of this restaruant. You may search online to gather data. In two sentences only.`;
    //     try {
    //         const response = await promptGroq(searchQuery); // Call the API
    //         setAiResults({
    //             ...aiResults,
    //             [restaruant.data_id]: response,
    //         }); // Update the results state
    //     } catch (error) {
    //         console.error('Error:', error);
    //         setAiResults({
    //             ...aiResults,
    //             [restaruant.data_id]: '',
    //         });
    //     }
    // };

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

    return (
        <main className={styles.main}>
            <div>
                <h1>Prompt</h1>
                {/* <button onClick={onNotionClicked}>Notion create page</button> */}

                {data ? (
                    <div style={{ display: 'flex', flexDirection: 'column', margin: 'auto', gap: '24px' }}>
                        <h2>Results:</h2>
                        {data.map((result, index) => (
                            <div style={{ marginBottom: '24px' }} key={index}>
                                <p>
                                    {index + 1} - {result.name}
                                </p>
                                {/* <p>{result.address}</p>
                                <p>{result.website}</p>
                                <p>{result.category}</p>
                                <p>{result.id}</p> */}
                                {/* <p>{result.googleLink}</p> */}
                                {/* <p>{result.latitude}</p>
                                <p>{result.longitude}</p>
                                <p>{result.phone}</p>
                                <p>{result.rating}</p>
                                <p>{result.ratingCount}</p>
                                <p>{result.chainRestaurantId}</p>
                                <p>{result.success}</p>
                                {result.openingHours.map((hour, index) => (
                                    <p key={index}>{hour}</p>
                                ))}

                                {result.count_per_rating.map((rating, index) => (
                                    <p key={index}>{rating}</p>
                                ))}
                                <p> {result.ai_review_summary}</p> */}
                                {/* <div className="photo-gallery">
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
                                </div> */}
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
