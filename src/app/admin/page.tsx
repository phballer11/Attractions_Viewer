'use client';
import { useEffect, useState } from 'react';
import { db } from '../firebase.config';
import { collection, addDoc } from 'firebase/firestore';
import Select, { SingleValue } from 'react-select';
import { COUNTRY_OPTIONS, COUNTRY_SELECT_STYLES } from '../types/contants';
import { checkIfCountrySupported } from '../utils/utilService';

export default function Admin() {
    const [selectedCountry, setSelectedCountry] = useState<{ value: string; label: string }>({
        value: '',
        label: '',
    });
    const [searchString, setSearchString] = useState('');
    const [link, setLink] = useState('');
    const [tags, setTags] = useState('');

    const handleSubmit = async (event: any) => {
        event.preventDefault();

        if (!checkIfCountrySupported(selectedCountry.value)) {
            alert('Country not supported');
            return;
        }
        if (searchString.trim() === '' && link.trim() === '') {
            alert('Please enter either a search string or a link.');
            return;
        }

        if (searchString.trim() !== '' && link.trim() !== '') {
            alert('Please enter either a search string or a link, not both.');
            return;
        }
        const tagsArray = tags.split(',').map((tag) => tag.trim());
        try {
            const itemsRef = collection(db, 'jobs');
            await addDoc(itemsRef, {
                link: link,
                searchString: searchString,
                tags: tagsArray,
                country: selectedCountry.value,
            });
        } catch (error) {
            console.error('Error sending data to firebase:', error);
        } finally {
            setSearchString('');
            setLink('');
            setTags('');

            alert('Submitted, please check back in 10mins.');
        }
    };

    const handleCountryChange = (selectedOption: SingleValue<{ value: string; label: string }>) => {
        if (!selectedOption) {
            return;
        }
        setSelectedCountry({
            value: selectedOption.value,
            label: selectedOption.label,
        });
    };

    useEffect(() => {
        sessionStorage.getItem('user') === 'admin' ? null : (window.location.href = '/');
    }, []);

    return (
        <main>
            <div className="container">
                <h1>Submit search request to the queue</h1>
                <div style={{ width: '50%', marginTop: '32px' }}>
                    <label htmlFor="country-select">Country:</label>
                    <Select
                        required={true}
                        options={COUNTRY_OPTIONS}
                        styles={COUNTRY_SELECT_STYLES}
                        value={selectedCountry}
                        onChange={handleCountryChange}
                        id="country-select"
                        placeholder="Select country"
                    />
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="search-container">
                        <label htmlFor="searchString">Search:</label>
                        <input
                            className="search-input"
                            type="text"
                            id="searchString"
                            value={searchString}
                            onChange={(e) => setSearchString(e.target.value)}
                        />
                    </div>
                    <div className="search-container">
                        <label htmlFor="link">Link:</label>
                        <input
                            type="text"
                            id="link"
                            value={link}
                            onChange={(e) => setLink(e.target.value)}
                            className="search-input"
                        />
                    </div>
                    <div className="search-container">
                        <label htmlFor="tags">Tags:</label>
                        <input
                            className="search-input"
                            type="text"
                            id="tags"
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                            placeholder="Separate tags by comma"
                        />
                    </div>
                    <button type="submit" className="button">
                        Submit
                    </button>
                </form>
                <br />
                <br />
                <br />
                <br />
                <br />
                <a href="https://phballer11.github.io/Attractions_Viewer/">Home page</a>
            </div>
        </main>
    );
}
