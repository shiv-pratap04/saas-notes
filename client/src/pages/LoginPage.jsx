import React, { useState } from 'react';
import API from '../services/api';

const LoginPage = ({ onLoginSuccess }) => {
    const [email, setEmail] = useState('admin@acme.test'); // Default for easy testing
    const [password, setPassword] = useState('password');   // Default for easy testing
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const { data } = await API.post('/auth/login', { email, password });
            localStorage.setItem('token', data.token);
            onLoginSuccess();
        } catch (err) {
            setError('Invalid credentials. Please try again.');
        }
    };

    return (
        <div className="app-container">
            <div className="card">
                <h1 className="card-header">Login to Your Tenant</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input
                            type="email"
                            className="form-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            className="form-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">Login</button>
                </form>
                {error && <p className="error-message">{error}</p>}
            </div>
        </div>
    );
};

export default LoginPage;