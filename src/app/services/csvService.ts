import Papa from 'papaparse';
import { RestaurantData } from '../types/RestaurantData';
import { prefix } from '../utils/prefix';

export const parseCSV = async (country: string): Promise<RestaurantData[]> => {
    const results: RestaurantData[] = [];

    const filePath = getFilePathByCountry(country);

    const response = await fetch(`${prefix}/data/${filePath}`);
    const csvString = await response.text();
    Papa.parse(csvString, {
        header: true,
        skipEmptyLines: true,
        transform: (value: string, header: string) => {
            if (
                header === 'OpeningHours' ||
                header === 'CountPerRating' ||
                header === 'Images' ||
                header === 'Reviews' ||
                header === 'Tags'
            ) {
                try {
                    const results: string[] = JSON.parse(value) as string[];
                    if (header === 'Reviews') {
                        const uniqueArray: string[] = Array.from(new Set(results))
                            .filter((item) => item.length > 4)
                            .sort((a, b) => b.length - a.length);

                        return uniqueArray;
                    }

                    if (header === 'Images') {
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

            const result = value.replace('', '').replace('', '').replace('', '');
            if (header === 'Website' && result.length > 0 && !result.startsWith('http')) {
                return `https://${result}`;
            }
            return result;
        },
        complete: (parsedData) => {
            console.log(parsedData);
            results.push(...(parsedData.data as RestaurantData[]));
        },
    });

    return results;
};

const getFilePathByCountry = (country: string): string => {
    switch (country) {
        case 'japan':
            return 'japan_restaurants.csv';
        case 'taiwan':
            return 'taiwan_restaurants.csv';
        case 'hongkong':
            return 'hong_kong_restaurants.csv';
        case 'malaysia':
            return 'malaysia_restaurants.csv';
        case 'singapore':
            return 'singapore_restaurants.csv';
        default:
            return '';
    }
};
