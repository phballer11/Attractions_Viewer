'use client';
import { useEffect, useState } from 'react';
import ThemeToggle from '../components/ThemeToggle';

export default function AdminLogin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsLoading(true);
        setError('');

        // Simulate login delay for better UX
        await new Promise(resolve => setTimeout(resolve, 500));

        if (username.trim() === 'peteradmin' && password.trim() === 'qwert') {
            sessionStorage.setItem('user', 'admin');
            setUsername('');
            setPassword('');
            setIsLoggedIn(true);
            setIsLoading(false);
        } else {
            sessionStorage.removeItem('user');
            setError('Invalid username or password');
            setUsername('');
            setPassword('');
            setIsLoggedIn(false);
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        sessionStorage.removeItem('user');
        setIsLoggedIn(false);
        setUsername('');
        setPassword('');
        setError('');
    };

    useEffect(() => {
        if (sessionStorage.getItem('user') === 'admin') {
            setIsLoggedIn(true);
        }
    }, []);

    return (
        <>
            <header className="app-header">
                <div className="container">
                    <div className="app-header-content">
                        <h1 className="app-title">Admin Login</h1>
                        <div className="app-controls">
                            <ThemeToggle />
                        </div>
                    </div>
                </div>
            </header>
            
            <main>
                <div className="container">
                    <div className="login-container">
                        <div className="login-card">
                            {!isLoggedIn ? (
                                <>
                                    <div className="login-header">
                                        <div className="login-icon">
                                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                                                <circle cx="12" cy="7" r="4"/>
                                            </svg>
                                        </div>
                                        <h2 className="login-title">Welcome Back</h2>
                                        <p className="login-subtitle">Sign in to access the admin panel</p>
                                    </div>

                                    <form onSubmit={handleSubmit} className="login-form">
                                        {error && (
                                            <div className="error-message" role="alert">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <circle cx="12" cy="12" r="10"/>
                                                    <line x1="15" y1="9" x2="9" y2="15"/>
                                                    <line x1="9" y1="9" x2="15" y2="15"/>
                                                </svg>
                                                {error}
                                            </div>
                                        )}

                                        <div className="form-group">
                                            <label htmlFor="username" className="form-label">Username</label>
                                            <input
                                                className="input"
                                                type="text"
                                                id="username"
                                                value={username}
                                                onChange={(e) => setUsername(e.target.value)}
                                                placeholder="Enter your username"
                                                required
                                                disabled={isLoading}
                                                autoComplete="username"
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="password" className="form-label">Password</label>
                                            <input
                                                type="password"
                                                id="password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="input"
                                                placeholder="Enter your password"
                                                required
                                                disabled={isLoading}
                                                autoComplete="current-password"
                                            />
                                        </div>

                                        <button 
                                            type="submit" 
                                            className="btn btn-primary btn-lg w-full"
                                            disabled={isLoading || !username.trim() || !password.trim()}
                                        >
                                            {isLoading ? (
                                                <>
                                                    <div className="login-spinner">
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <path d="M21 12a9 9 0 11-6.219-8.56"/>
                                                        </svg>
                                                    </div>
                                                    Signing in...
                                                </>
                                            ) : (
                                                'Sign In'
                                            )}
                                        </button>
                                    </form>
                                </>
                            ) : (
                                <>
                                    <div className="login-header">
                                        <div className="login-icon success">
                                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                                                <polyline points="22,4 12,14.01 9,11.01"/>
                                            </svg>
                                        </div>
                                        <h2 className="login-title">Welcome, Admin!</h2>
                                        <p className="login-subtitle">You are successfully logged in</p>
                                    </div>

                                    <div className="login-actions">
                                        <a href="/admin" className="btn btn-primary btn-lg">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                            </svg>
                                            Go to Admin Panel
                                        </a>
                                        
                                        <a href="/" className="btn btn-secondary btn-lg">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                                                <polyline points="9,22 9,12 15,12 15,22"/>
                                            </svg>
                                            Back to Home
                                        </a>
                                    </div>

                                    <div className="logout-section">
                                        <button 
                                            onClick={handleLogout}
                                            className="btn btn-ghost"
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                                                <polyline points="16,17 21,12 16,7"/>
                                                <line x1="21" y1="12" x2="9" y2="12"/>
                                            </svg>
                                            Sign Out
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}