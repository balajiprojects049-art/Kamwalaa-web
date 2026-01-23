import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import './index.css';

// Simple test component
const TestHomePage = () => (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
        <img src="/logo.png" alt="Kamwalaa" style={{ height: '80px', marginBottom: '2rem' }} />
        <h1 style={{ fontSize: '3rem', color: '#004976', marginBottom: '1rem' }}>Kamwalaa - Home Services</h1>
        <p style={{ fontSize: '1.5rem', color: '#666', marginBottom: '2rem' }}>Website is loading...</p>
        <div style={{ padding: '2rem', background: '#f0f4f8', borderRadius: '12px' }}>
            <h2 style={{ color: '#FF9800' }}>✨ Professional Home Services</h2>
            <p>The full website is loading. If you see this, React is working!</p>
        </div>
    </div>
);

function App() {
    return (
        <Router>
            <div className="App">
                <TestHomePage />
            </div>
        </Router>
    );
}

export default App;
