import React, { useState, useEffect } from 'react';
import { FiArrowUp } from 'react-icons/fi';
import './ScrollToTopButton.css';

const ScrollToTopButton = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.pageYOffset > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    if (!isVisible) return null;

    return (
        <button
            className="scroll-to-top-btn"
            onClick={scrollToTop}
            aria-label="Scroll to top"
        >
            <FiArrowUp />
        </button>
    );
};

export default ScrollToTopButton;
