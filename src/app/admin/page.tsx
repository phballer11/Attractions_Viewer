'use client';
import { useEffect, useState } from 'react';
import { db } from '../firebase.config';
import { collection, addDoc } from 'firebase/firestore';
import Select, { SingleValue } from 'react-select';
import { COUNTRY_OPTIONS, COUNTRY_SELECT_STYLES } from '../types/contants';
import { checkIfCountrySupported } from '../utils/utilService';
import ThemeToggle from '../components/ThemeToggle';

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
        <>
            <header className="app-header">
                <div className="container">
                    <div className="app-header-content">
                        <h1 className="app-title">Admin Panel</h1>
                        <div className="app-controls">
                            <ThemeToggle />
                        </div>
                    </div>
                </div>
            </header>

            <main>
                <div className="container">
                    <div className="admin-content">
                        <div className="admin-card">
                            <div className="card-header">
                                <h2 className="card-title">Submit Search Request</h2>
                                <p className="card-subtitle">
                                    Add new restaurants or attractions to the queue for processing
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="admin-form">
                                <div className="form-group">
                                    <label htmlFor="country-select" className="form-label">
                                        Country *
                                    </label>
                                    <div className="country-select-wrapper">
                                        <Select
                                            required={true}
                                            options={COUNTRY_OPTIONS}
                                            styles={COUNTRY_SELECT_STYLES}
                                            value={selectedCountry}
                                            onChange={handleCountryChange}
                                            id="country-select"
                                            placeholder="Select country"
                                            aria-label="Select country for search request"
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="searchString" className="form-label">
                                        Search Query
                                    </label>
                                    <input
                                        className="input"
                                        type="text"
                                        id="searchString"
                                        value={searchString}
                                        onChange={(e) => setSearchString(e.target.value)}
                                        placeholder="Enter search terms (e.g., 'sushi Tokyo')"
                                        aria-describedby="search-help"
                                    />
                                    <p id="search-help" className="form-help">
                                        Use either search query or direct link, not both
                                    </p>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="link" className="form-label">
                                        Direct Link
                                    </label>
                                    <input
                                        type="text"
                                        id="link"
                                        value={link}
                                        onChange={(e) => setLink(e.target.value)}
                                        className="input"
                                        placeholder="https://maps.google.com/..."
                                        aria-describedby="link-help"
                                    />
                                    <p id="link-help" className="form-help">
                                        Direct Google Maps or business link
                                    </p>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="tags" className="form-label">
                                        Tags
                                    </label>
                                    <input
                                        className="input"
                                        type="text"
                                        id="tags"
                                        value={tags}
                                        onChange={(e) => setTags(e.target.value)}
                                        placeholder="restaurant, sushi, japanese, tokyo"
                                        aria-describedby="tags-help"
                                    />
                                    <p id="tags-help" className="form-help">
                                        Separate multiple tags with commas
                                    </p>
                                </div>

                                <div className="form-actions">
                                    <button type="submit" className="btn btn-primary btn-lg">
                                        Submit Request
                                    </button>
                                </div>
                            </form>
                        </div>

                        <div className="admin-footer">
                            <a href="/" className="btn btn-ghost">
                                ← Back to Home
                            </a>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
