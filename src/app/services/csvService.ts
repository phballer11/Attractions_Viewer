import Papa from 'papaparse';
import { RestaurantData } from '../types/RestaurantData';
import { prefix } from '../utils/prefix';

export const parseCSV = async (): Promise<RestaurantData[]> => {
    const results: RestaurantData[] = [];

    // const response = await fetch(`${prefix}/data/japan_restaurants.csv`);
    // const csvString = await response.text();
    let csvString = '';
    try {
        csvString = await getCsvResposne();
    } catch (e) {
        console.error('Error fetching CSV', e);
        return [];
    }

    Papa.parse(csvString, {
        header: true,
        skipEmptyLines: true,
        transform: (value: string, header: string) => {
            if (
                header === 'openingHours' ||
                header === 'count_per_rating' ||
                header === 'images' ||
                header === 'reviews' ||
                header === 'tags'
            ) {
                try {
                    const results: string[] = JSON.parse(value) as string[];
                    if (header === 'reviews') {
                        const uniqueArray: string[] = Array.from(new Set(results))
                            .filter((item) => item.length > 4)
                            .sort((a, b) => b.length - a.length);

                        return uniqueArray;
                    }

                    if (header === 'images') {
                        const uniqueUrls = results.filter((url, index, self) => {
                            const match = url.match(/\/p\/(.*?)=/);
                            if (match) {
                                const identifier = match[1];
                                return self.findIndex((u) => u.includes(`/p/${identifier}=`)) === index;
                            }
                            return true;
                        });
                        return uniqueUrls;
                    }

                    return results;
                } catch (e) {
                    console.error(`Error parsing JSON for ${header}: ${value}`);
                    return value;
                }
            }

            const result = value;
            if (header === 'website' && result.length > 0 && !result.startsWith('http')) {
                return `http://${result}`;
            }
            return result;
        },
        complete: (parsedData) => {
            results.push(...(parsedData.data as RestaurantData[]));
        },
    });

    return results;
};

const getCsvResposne = async () => {
    // try {
    //     console.log('prefix in csv:', prefix);
    //     const response = await fetch(`${prefix}/data/japan_restaurants.csv`);
    //     const csvString = await response.text();
    //     return csvString;
    // } catch (e) {
    //     console.error('Error fetching CSV for path:`${prefix}/data/japan_restaurants.csv`', e);
    // }

    // try {
    //     console.log('second path');
    //     const response = await fetch(`/data/japan_restaurants.csv`);
    //     const csvString = await response.text();
    //     return csvString;
    // } catch (e) {
    //     console.error('Error fetching CSV for path:`/data/japan_restaurants.csv`', e);
    // }

    try {
        const response = await fetch(`Attractions_Viewer/data/japan_restaurants.csv`);
        const csvString = await response.text();
        return csvString;
    } catch (e) {
        console.error('Error fetching CSV for path:`Attractions_Viewer/data/japan_restaurants.csv`', e);
    }
    throw new Error('Error fetching CSV');
};
