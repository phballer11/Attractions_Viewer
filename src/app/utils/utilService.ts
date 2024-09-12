import { COUNTRY_OPTIONS } from '../types/contants';

export const checkIfCountrySupported = (country: string): boolean => {
    return COUNTRY_OPTIONS.some((option) => option.value === country);
};
