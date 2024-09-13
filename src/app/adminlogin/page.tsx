'use client';
import { useEffect, useState } from 'react';

export default function Admin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        if (username.trim() === 'peteradmin' && password.trim() === 'qwert') {
            sessionStorage.setItem('user', 'admin');
            setUsername('');
            setPassword('');
            setIsLoggedIn(true);
            alert('Login successful');
            return;
        }

        sessionStorage.removeItem('user');
        setUsername('');
        setPassword('');
        setIsLoggedIn(false);
    };

    useEffect(() => {
        if (sessionStorage.getItem('user') === 'admin') {
            setIsLoggedIn(true);
        }
    }, []);

    return (
        <main>
            <div className="container">
                <h1>{isLoggedIn ? 'Hi Admin' : 'Log in here'}</h1>
                <form onSubmit={handleSubmit}>
                    {!isLoggedIn && (
                        <div>
                            <div className="search-container">
                                <label htmlFor="searchString">Username:</label>
                                <input
                                    className="search-input"
                                    type="text"
                                    id="searchString"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>
                            <div className="search-container">
                                <label htmlFor="link">Password:</label>
                                <input
                                    type="password"
                                    id="link"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="search-input"
                                />
                            </div>
                        </div>
                    )}
                    <button type="submit" className="button">
                        {isLoggedIn ? 'Log out' : 'Login'}
                    </button>
                    <br />
                    <br />
                    <br />
                    <br />
                    {isLoggedIn && (
                        <div>
                            <a
                                href="https://phballer11.github.io/Attractions_Viewer/admin"
                                style={{ marginTop: '24px' }}
                            >
                                Admin page
                            </a>
                            <br />
                            <br />
                            <br />
                            <a href="https://phballer11.github.io/Attractions_Viewer/" style={{ marginTop: '24px' }}>
                                Home page
                            </a>
                        </div>
                    )}
                </form>
            </div>
        </main>
    );
}
