import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    padding: '2rem',
                    textAlign: 'center',
                    fontFamily: 'system-ui, sans-serif'
                }}>
                    <h1 style={{ color: '#dc2626' }}>Something went wrong</h1>
                    <p style={{ color: '#666', marginTop: '1rem' }}>
                        {this.state.error?.message || 'An unexpected error occurred'}
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        style={{
                            marginTop: '1rem',
                            padding: '0.75rem 1.5rem',
                            background: '#004976',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '1rem'
                        }}
                    >
                        Reload Page
                    </button>
                    <details style={{ marginTop: '2rem', textAlign: 'left', maxWidth: '800px', margin: '2rem auto' }}>
                        <summary style={{ cursor: 'pointer', color: '#666' }}>Error Details</summary>
                        <pre style={{
                            background: '#f3f4f6',
                            padding: '1rem',
                            borderRadius: '8px',
                            overflow: 'auto',
                            marginTop: '1rem'
                        }}>
                            {this.state.error?.stack}
                        </pre>
                    </details>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
