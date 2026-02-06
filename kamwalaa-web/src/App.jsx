import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { ToastProvider } from './context/ToastContext';
import { ModalProvider } from './context/ModalContext';
import { AuthProvider } from './context/AuthContext';
import { CityProvider } from './context/CityContext';
import { CartProvider } from './context/CartContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import PublicLayout from './components/layout/PublicLayout';
import AdminLayout from './components/admin/AdminLayout';
import AdminProtectedRoute from './components/admin/AdminProtectedRoute';

// Public Pages
import Home from './pages/Home';
import Services from './pages/Services';
import ServiceDetail from './pages/ServiceDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import Booking from './pages/Booking';
import BookingSuccess from './pages/BookingSuccess';
import Invoice from './pages/Invoice';
import BecomePartner from './pages/BecomePartner';
import PartnerDashboard from './pages/partner/PartnerDashboard';
import PartnerRegistration from './pages/partner/PartnerRegistration';
import PartnerLogin from './pages/partner/PartnerLogin';

// Public Pages for User Profile
import UserProfile from './pages/UserProfile';
import MyBookings from './pages/MyBookings';
import ProtectedRoute from './components/common/ProtectedRoute';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminServices from './pages/admin/AdminServices';
import AdminBookings from './pages/admin/AdminBookings';
import AdminCustomers from './pages/admin/AdminCustomers';
import AdminSettings from './pages/admin/AdminSettings';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminReports from './pages/admin/AdminReports';
import AdminPartnerRequests from './pages/admin/AdminPartnerRequests';

import './index.css';
import './App.css';

function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <AuthProvider>
          <CityProvider>
            <ToastProvider>
              <ModalProvider>
                <CartProvider>
                  <Router>
                    <div className="App">
                      <Routes>
                        {/* Public Routes wrapped in PublicLayout */}
                        <Route element={<PublicLayout />}>
                          <Route path="/" element={<Home />} />
                          <Route path="/services" element={<Services />} />
                          <Route path="/services/:categoryId" element={<Services />} />
                          <Route path="/about" element={<About />} />
                          <Route path="/contact" element={<Contact />} />
                          <Route path="/login" element={<Login />} />
                          <Route path="/register" element={<Register />} />
                          <Route path="/bookings" element={
                            <ProtectedRoute>
                              <MyBookings />
                            </ProtectedRoute>
                          } />
                          <Route path="/booking" element={<Booking />} />
                          <Route path="/invoice/:id" element={<Invoice />} />
                          <Route path="/booking-success" element={<BookingSuccess />} />
                          <Route path="/become-partner" element={<BecomePartner />} />
                          {/* Profile routes */}
                          <Route path="/profile" element={
                            <ProtectedRoute>
                              <UserProfile />
                            </ProtectedRoute>
                          } />
                          <Route path="/partner/dashboard" element={
                            <ProtectedRoute>
                              <PartnerDashboard />
                            </ProtectedRoute>
                          } />
                          <Route path="/partner/register" element={
                            <ProtectedRoute>
                              <PartnerRegistration />
                            </ProtectedRoute>
                          } />
                          <Route path="/partner/login" element={<PartnerLogin />} />
                        </Route>


                        {/* Admin Routes - Strictly Separated */}
                        <Route path="/admin/login" element={<AdminLogin />} />

                        <Route path="/admin" element={
                          <AdminProtectedRoute>
                            <AdminLayout />
                          </AdminProtectedRoute>
                        }>
                          <Route index element={<AdminDashboard />} />
                          <Route path="dashboard" element={<AdminDashboard />} />
                          <Route path="analytics" element={<AdminAnalytics />} />
                          <Route path="reports" element={<AdminReports />} />
                          <Route path="services" element={<AdminServices />} />
                          <Route path="bookings" element={<AdminBookings />} />
                          <Route path="customers" element={<AdminCustomers />} />
                          <Route path="partners" element={<AdminPartnerRequests />} />
                          <Route path="settings" element={<AdminSettings />} />
                        </Route>
                      </Routes>
                    </div>
                  </Router>
                </CartProvider>
              </ModalProvider>
            </ToastProvider>
          </CityProvider>
        </AuthProvider>
      </LanguageProvider>
    </ErrorBoundary >
  );
}

export default App;
// Version: 1.1 - Force Deploy Fix Admin Redirect
