import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { ToastProvider } from './context/ToastContext';
import { CityProvider } from './context/CityContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import CitySelector from './components/common/CitySelector';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ScrollToTop from './components/common/ScrollToTop';
import ScrollToTopButton from './components/common/ScrollToTopButton';
import ToastContainer from './components/common/ToastContainer';
import FloatingActionButton from './components/common/FloatingActionButton';
import Home from './pages/Home';
import Services from './pages/Services';
import ServiceDetail from './pages/ServiceDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Booking from './pages/Booking';
import BookingSuccess from './pages/BookingSuccess';
import './index.css';
import './App.css';

function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <CityProvider>
          <ToastProvider>
            <Router>
              <div className="App">
                <ScrollToTop />
                <Header />
                <main>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/services/:categoryId" element={<Services />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/booking" element={<Booking />} />
                    <Route path="/booking-success" element={<BookingSuccess />} />
                  </Routes>
                </main>
                <Footer />
                <ToastContainer />
                <CitySelector />
                <FloatingActionButton />
                <ScrollToTopButton />
              </div>
            </Router>
          </ToastProvider>
        </CityProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}

export default App;
