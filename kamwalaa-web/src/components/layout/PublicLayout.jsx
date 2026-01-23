import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import ScrollToTop from '../common/ScrollToTop';
import ToastContainer from '../common/ToastContainer';
import CitySelector from '../common/CitySelector';
import FloatingActionButton from '../common/FloatingActionButton';
import ScrollToTopButton from '../common/ScrollToTopButton';

const PublicLayout = () => {
    return (
        <>
            <ScrollToTop />
            <Header />
            <main>
                <Outlet />
            </main>
            <Footer />
            <ToastContainer />
            <CitySelector />
            <FloatingActionButton />
            <ScrollToTopButton />
        </>
    );
};

export default PublicLayout;
