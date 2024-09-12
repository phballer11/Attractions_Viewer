import { CSSObjectWithLabel } from 'react-select';

export const POPULAR_JAPAN_CITIES: string[] = [
    'Tokyo',
    'Osaka',
    'Kyoto',
    'Hiroshima',
    'Nara',
    'Fukuoka',
    'Sapporo',
    'Nagoya',
    'Kobe',
    'Yokohama',
];

export const COUNTRY_OPTIONS = [
    { value: 'japan', label: 'Japan' },
    { value: 'taiwan', label: 'Taiwan' },
    // { value: 'hk', label: 'Hong Kong' },
    // Add more countries as needed
];

export const TAGS_SELECT_STYLES = {
    container: (provided: CSSObjectWithLabel) => ({
        ...provided,
        backgroundColor: '#333', // Dark background for the container
        borderRadius: '4px',
        margin: '0 12px 24px 12px',
    }),
    control: (provided: CSSObjectWithLabel) => ({
        ...provided,
        backgroundColor: '#444', // Dark background for the control
        borderColor: '#666', // Dark border color
        boxShadow: 'none',
        '&:hover': {
            borderColor: '#888', // Slightly lighter border color on hover
        },
    }),
    menu: (provided: CSSObjectWithLabel) => ({
        ...provided,
        backgroundColor: '#333', // Dark background for the dropdown menu
        color: '#fff', // White text color
    }),
    menuList: (provided: CSSObjectWithLabel) => ({
        ...provided,
        padding: 0,
    }),
    option: (provided: CSSObjectWithLabel, state: any) => ({
        ...provided,
        backgroundColor: state.isSelected ? '#555' : '#333', // Dark background for options, lighter on select
        color: '#fff', // White text color
        '&:hover': {
            backgroundColor: '#555', // Slightly lighter background on hover
        },
    }),
    placeholder: (provided: CSSObjectWithLabel) => ({
        ...provided,
        color: '#aaa', // Placeholder text color
    }),
    singleValue: (provided: CSSObjectWithLabel) => ({
        ...provided,
        color: '#fff', // Text color for selected item
    }),
    input: (provided: CSSObjectWithLabel) => ({
        ...provided,
        color: '#fff', // Input text color
    }),
    indicatorSeparator: (provided: CSSObjectWithLabel) => ({
        ...provided,
        backgroundColor: '#666', // Separator color
    }),
    clearIndicator: (provided: CSSObjectWithLabel) => ({
        ...provided,
        backgroundColor: 'red', // Blue background for clear button
        color: '#fff', // White text color
        padding: '0 8px', // Padding inside the button
        borderRadius: '2px', // Rounded corners for the button
        '&:hover': {
            backgroundColor: '#0056b3', // Darker blue on hover
        },
    }),
    dropdownIndicator: (provided: CSSObjectWithLabel) => ({
        ...provided,
        color: '#fff', // Color for the dropdown indicator
    }),
    multiValue: (provided: CSSObjectWithLabel) => ({
        ...provided,
        backgroundColor: '#007bff', // Background color of multi-value tags
        borderRadius: '4px', // Rounded corners for multi-value tags
        padding: '2px 6px', // Padding inside the tag
    }),
    multiValueLabel: (provided: CSSObjectWithLabel) => ({
        ...provided,
        color: '#fff', // Text color inside the multi-value tags
    }),
    multiValueRemove: (provided: CSSObjectWithLabel) => ({
        ...provided,
        color: '#fff', // Color for the remove icon
        backgroundColor: 'red', // Blue background for the remove button
        borderRadius: '50%', // Rounded shape for the remove button
        ':hover': {
            backgroundColor: '#0056b3', // Darker blue on hover for remove button
        },
    }),
};

export const COUNTRY_SELECT_STYLES = {
    container: (provided: CSSObjectWithLabel) => ({
        ...provided,
        backgroundColor: '#333', // Dark background for the container
        borderRadius: '4px',
        margin: '0 12px 24px 12px',
    }),
    control: (provided: CSSObjectWithLabel) => ({
        ...provided,
        backgroundColor: '#444', // Dark background for the control
        borderColor: '#666', // Dark border color
        boxShadow: 'none',
        '&:hover': {
            borderColor: '#888', // Slightly lighter border color on hover
        },
    }),
    menu: (provided: CSSObjectWithLabel) => ({
        ...provided,
        backgroundColor: '#333', // Dark background for the dropdown menu
        color: '#fff', // White text color
    }),
    menuList: (provided: CSSObjectWithLabel) => ({
        ...provided,
        padding: 0,
    }),
    option: (provided: CSSObjectWithLabel, state: any) => ({
        ...provided,
        backgroundColor: state.isSelected ? '#555' : '#333', // Dark background for options, lighter on select
        color: '#fff', // White text color
        '&:hover': {
            backgroundColor: '#555', // Slightly lighter background on hover
        },
    }),
    placeholder: (provided: CSSObjectWithLabel) => ({
        ...provided,
        color: '#aaa', // Placeholder text color
    }),
    singleValue: (provided: CSSObjectWithLabel) => ({
        ...provided,
        color: '#fff', // Text color for selected item
    }),
    input: (provided: CSSObjectWithLabel) => ({
        ...provided,
        color: '#fff', // Input text color
    }),
    indicatorSeparator: (provided: CSSObjectWithLabel) => ({
        ...provided,
        backgroundColor: '#666', // Separator color
    }),
    clearIndicator: (provided: CSSObjectWithLabel) => ({
        ...provided,
        backgroundColor: 'red', // Blue background for clear button
        color: '#fff', // White text color
        padding: '0 8px', // Padding inside the button
        borderRadius: '2px', // Rounded corners for the button
        '&:hover': {
            backgroundColor: '#0056b3', // Darker blue on hover
        },
    }),
    dropdownIndicator: (provided: CSSObjectWithLabel) => ({
        ...provided,
        color: '#fff', // Color for the dropdown indicator
    }),
};
