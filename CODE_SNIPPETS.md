# 💻 URBAN SEVA - CODE SNIPPETS & QUICK START

## Quick Reference for Common Components and Features

---

## 🎨 CSS VARIABLES (Design System)

```css
/* styles/variables.css */
:root {
  /* Colors */
  --primary-blue: #004a99;
  --primary-blue-dark: #003770;
  --primary-blue-light: #0066cc;
  --accent-yellow: #FFA500;
  --accent-yellow-dark: #FF8C00;
  
  /* Grays */
  --white: #FFFFFF;
  --gray-50: #F9FAFB;
  --gray-100: #F3F4F6;
  --gray-200: #E5E7EB;
  --gray-300: #D1D5DB;
  --gray-400: #9CA3AF;
  --gray-500: #6B7280;
  --gray-600: #4B5563;
  --gray-700: #374151;
  --gray-800: #1F2937;
  --gray-900: #111827;
  
  /* Typography */
  --font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-size-xs: 0.75rem;    /* 12px */
  --font-size-sm: 0.875rem;   /* 14px */
  --font-size-base: 1rem;      /* 16px */
  --font-size-lg: 1.125rem;    /* 18px */
  --font-size-xl: 1.25rem;     /* 20px */
  --font-size-2xl: 1.5rem;     /* 24px */
  --font-size-3xl: 1.875rem;   /* 30px */
  --font-size-4xl: 2.25rem;    /* 36px */
  --font-size-5xl: 3rem;       /* 48px */
  
  /* Spacing */
  --spacing-xs: 0.25rem;    /* 4px */
  --spacing-sm: 0.5rem;     /* 8px */
  --spacing-md: 1rem;       /* 16px */
  --spacing-lg: 1.5rem;     /* 24px */
  --spacing-xl: 2rem;       /* 32px */
  --spacing-2xl: 3rem;      /* 48px */
  --spacing-3xl: 4rem;      /* 64px */
  
  /* Border Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-full: 9999px;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  
  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-base: 300ms ease;
  --transition-slow: 500ms ease;
  
  /* Z-Index */
  --z-dropdown: 1000;
  --z-sticky: 1020;
  --z-fixed: 1030;
  --z-modal-backdrop: 1040;
  --z-modal: 1050;
  --z-popover: 1060;
  --z-tooltip: 1070;
}
```

---

## 🧩 REACT COMPONENTS

### 1. Service Card Component

```jsx
// components/common/ServiceCard.jsx
import React from 'react';
import './ServiceCard.css';

const ServiceCard = ({ 
  service, 
  onBookNow, 
  onAddToCart 
}) => {
  const {
    id,
    name,
    image,
    price,
    rating,
    reviewCount,
    isFreeVisit
  } = service;

  return (
    <div className="service-card">
      <div className="service-card__image-container">
        <img 
          src={image} 
          alt={name}
          className="service-card__image"
          loading="lazy"
        />
        {isFreeVisit && (
          <span className="service-card__badge">
            Free Site Visit
          </span>
        )}
      </div>
      
      <div className="service-card__content">
        <h3 className="service-card__title">{name}</h3>
        
        {rating && (
          <div className="service-card__rating">
            <span className="stars">
              {'★'.repeat(Math.floor(rating))}
              {'☆'.repeat(5 - Math.floor(rating))}
            </span>
            <span className="rating-text">
              {rating} ({reviewCount} reviews)
            </span>
          </div>
        )}
        
        {price && (
          <p className="service-card__price">
            Starting at <strong>₹{price}</strong>
          </p>
        )}
        
        <div className="service-card__actions">
          <button 
            className="btn btn-secondary"
            onClick={() => onAddToCart(id)}
          >
            Add to Cart
          </button>
          <button 
            className="btn btn-primary"
            onClick={() => onBookNow(id)}
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
```

```css
/* components/common/ServiceCard.css */
.service-card {
  background: var(--white);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-md);
  transition: all var(--transition-base);
  height: 100%;
  display: flex;
  flex-direction: column;
}

.service-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-xl);
}

.service-card__image-container {
  position: relative;
  width: 100%;
  padding-top: 66.67%; /* 3:2 aspect ratio */
  overflow: hidden;
}

.service-card__image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.service-card__badge {
  position: absolute;
  top: var(--spacing-md);
  right: var(--spacing-md);
  background: var(--accent-yellow);
  color: var(--white);
  padding: var(--spacing-xs) var(--spacing-md);
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  font-weight: 600;
}

.service-card__content {
  padding: var(--spacing-lg);
  flex: 1;
  display: flex;
  flex-direction: column;
}

.service-card__title {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--gray-900);
  margin: 0 0 var(--spacing-sm);
}

.service-card__rating {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
}

.stars {
  color: var(--accent-yellow);
  font-size: var(--font-size-lg);
}

.rating-text {
  font-size: var(--font-size-sm);
  color: var(--gray-600);
}

.service-card__price {
  font-size: var(--font-size-base);
  color: var(--gray-700);
  margin-bottom: var(--spacing-lg);
}

.service-card__price strong {
  color: var(--primary-blue);
  font-size: var(--font-size-xl);
}

.service-card__actions {
  display: flex;
  gap: var(--spacing-sm);
  margin-top: auto;
}

.service-card__actions .btn {
  flex: 1;
}
```

---

### 2. City Selector Modal

```jsx
// components/modals/CitySelector.jsx
import React, { useState, useEffect } from 'react';
import './CitySelector.css';

const cities = [
  'Ranchi',
  'Bokaro',
  'Godda',
  'Koderma',
  'G. Noida',
  'Ghaziabad',
  'Delhi',
  'Mumbai',
  'Bangalore',
  'Hyderabad'
];

const CitySelector = ({ onCitySelect, onClose }) => {
  const [selectedCity, setSelectedCity] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Check if city already selected
    const savedCity = localStorage.getItem('selectedCity');
    if (savedCity) {
      setSelectedCity(savedCity);
    }
  }, []);

  const filteredCities = cities.filter(city =>
    city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleNext = () => {
    if (selectedCity) {
      localStorage.setItem('selectedCity', selectedCity);
      onCitySelect(selectedCity);
      onClose();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content city-selector">
        <div className="modal-header">
          <h2>Select City</h2>
          <p>Choose your city to see available services</p>
        </div>

        <div className="modal-body">
          <input
            type="text"
            className="search-input"
            placeholder="Search city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <div className="city-list">
            {filteredCities.map((city) => (
              <label key={city} className="city-item">
                <input
                  type="radio"
                  name="city"
                  value={city}
                  checked={selectedCity === city}
                  onChange={(e) => setSelectedCity(e.target.value)}
                />
                <span className="city-name">{city}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="modal-footer">
          <button
            className="btn btn-primary btn-block"
            onClick={handleNext}
            disabled={!selectedCity}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default CitySelector;
```

```css
/* components/modals/CitySelector.css */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--z-modal-backdrop);
  padding: var(--spacing-md);
}

.modal-content {
  background: var(--white);
  border-radius: var(--radius-lg);
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: var(--shadow-xl);
  z-index: var(--z-modal);
}

.modal-header {
  padding: var(--spacing-xl);
  border-bottom: 1px solid var(--gray-200);
}

.modal-header h2 {
  margin: 0 0 var(--spacing-sm);
  font-size: var(--font-size-2xl);
  color: var(--gray-900);
}

.modal-header p {
  margin: 0;
  color: var(--gray-600);
  font-size: var(--font-size-sm);
}

.modal-body {
  padding: var(--spacing-xl);
}

.search-input {
  width: 100%;
  padding: var(--spacing-md);
  border: 2px solid var(--gray-300);
  border-radius: var(--radius-md);
  font-size: var(--font-size-base);
  margin-bottom: var(--spacing-lg);
  transition: border-color var(--transition-fast);
}

.search-input:focus {
  outline: none;
  border-color: var(--primary-blue);
}

.city-list {
  max-height: 300px;
  overflow-y: auto;
}

.city-item {
  display: flex;
  align-items: center;
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: background var(--transition-fast);
}

.city-item:hover {
  background: var(--gray-50);
}

.city-item input[type="radio"] {
  margin-right: var(--spacing-md);
  cursor: pointer;
}

.city-name {
  font-size: var(--font-size-base);
  color: var(--gray-800);
}

.modal-footer {
  padding: var(--spacing-xl);
  border-top: 1px solid var(--gray-200);
}

.btn-block {
  width: 100%;
}
```

---

### 3. Header Component

```jsx
// components/layout/Header.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = ({ userCity, onCityChange }) => {
  const [isServicesMenuOpen, setIsServicesMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const categories = [
    { name: 'Appliances Repair', link: '/services/appliances' },
    { name: 'Home Repair', link: '/services/home-repair' },
    { name: 'Gadgets Repair', link: '/services/gadgets' },
    { name: 'Painting Services', link: '/services/painting' },
    { name: 'IT Services', link: '/services/it' },
    { name: 'Photographer', link: '/services/photography' },
    { name: 'Beauty Services', link: '/services/beauty' },
    { name: 'Haircut & Grooming', link: '/services/grooming' },
    { name: 'Carpenter', link: '/services/carpenter' }
  ];

  return (
    <header className="header">
      <div className="container">
        <nav className="navbar">
          {/* Logo */}
          <Link to="/" className="navbar__logo">
            <img src="/logo.png" alt="UrbanSeva" />
          </Link>

          {/* Desktop Menu */}
          <ul className="navbar__menu">
            <li>
              <Link to="/" className="navbar__link">
                Home
              </Link>
            </li>
            
            <li 
              className="navbar__item--dropdown"
              onMouseEnter={() => setIsServicesMenuOpen(true)}
              onMouseLeave={() => setIsServicesMenuOpen(false)}
            >
              <button className="navbar__link">
                Services <span className="arrow">▾</span>
              </button>
              
              {isServicesMenuOpen && (
                <div className="dropdown-menu">
                  <div className="dropdown-menu__grid">
                    {categories.map((category) => (
                      <Link
                        key={category.name}
                        to={category.link}
                        className="dropdown-menu__item"
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </li>

            <li>
              <Link to="/partner" className="navbar__link">
                Become a Partner
              </Link>
            </li>
          </ul>

          {/* Right Side */}
          <div className="navbar__actions">
            {/* City Selector */}
            <button 
              className="city-selector-btn"
              onClick={onCityChange}
            >
              📍 {userCity || 'Select City'}
            </button>

            {/* Cart */}
            <Link to="/cart" className="cart-btn">
              🛒 Cart <span className="cart-badge">0</span>
            </Link>

            {/* Login/Signup */}
            <Link to="/signup" className="btn btn-primary">
              Login / Sign Up
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              className="mobile-menu-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              ☰
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="mobile-menu">
            <Link to="/" className="mobile-menu__item">Home</Link>
            <Link to="/services" className="mobile-menu__item">Services</Link>
            <Link to="/partner" className="mobile-menu__item">Become a Partner</Link>
            <Link to="/cart" className="mobile-menu__item">Cart</Link>
            <Link to="/signup" className="mobile-menu__item">Login / Sign Up</Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
```

---

### 4. Bottom Navigation (Mobile)

```jsx
// components/layout/BottomNav.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './BottomNav.css';

const BottomNav = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: '🏠', label: 'Home' },
    { path: '/orders', icon: '📋', label: 'Orders' },
    { path: '/quick-book', icon: '⚡', label: 'Quick Book', primary: true },
    { path: '/services', icon: '🔧', label: 'Services' },
    { path: '/profile', icon: '👤', label: 'Profile' }
  ];

  return (
    <nav className="bottom-nav">
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`bottom-nav__item ${
            location.pathname === item.path ? 'active' : ''
          } ${item.primary ? 'primary' : ''}`}
        >
          <span className="bottom-nav__icon">{item.icon}</span>
          <span className="bottom-nav__label">{item.label}</span>
        </Link>
      ))}
    </nav>
  );
};

export default BottomNav;
```

```css
/* components/layout/BottomNav.css */
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--white);
  display: flex;
  justify-content: space-around;
  padding: var(--spacing-sm) 0;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  z-index: var(--z-fixed);
}

.bottom-nav__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-sm);
  color: var(--gray-600);
  text-decoration: none;
  transition: all var(--transition-fast);
  flex: 1;
  position: relative;
}

.bottom-nav__item.active {
  color: var(--primary-blue);
}

.bottom-nav__item.primary {
  background: var(--accent-yellow);
  color: var(--white);
  border-radius: 50%;
  width: 56px;
  height: 56px;
  margin-top: -28px;
  padding: 0;
  box-shadow: var(--shadow-lg);
}

.bottom-nav__icon {
  font-size: var(--font-size-2xl);
  margin-bottom: var(--spacing-xs);
}

.bottom-nav__item.primary .bottom-nav__icon {
  margin-bottom: 0;
}

.bottom-nav__label {
  font-size: var(--font-size-xs);
  font-weight: 500;
}

.bottom-nav__item.primary .bottom-nav__label {
  display: none;
}

/* Hide on desktop */
@media (min-width: 768px) {
  .bottom-nav {
    display: none;
  }
}
```

---

## 🔧 UTILITY FUNCTIONS

### API Helper

```javascript
// utils/api.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API methods
export const apiService = {
  // Auth
  sendOTP: (phone) => api.post('/auth/send-otp', { phone }),
  verifyOTP: (phone, otp) => api.post('/auth/verify-otp', { phone, otp }),
  register: (data) => api.post('/auth/register', data),

  // Services
  getServices: (params) => api.get('/services', { params }),
  getServiceById: (id) => api.get(`/services/${id}`),
  getCategories: () => api.get('/categories'),
  getServicesByCategory: (categoryId) => api.get(`/categories/${categoryId}/services`),

  // Cart
  getCart: () => api.get('/cart'),
  addToCart: (serviceId, quantity = 1) => api.post('/cart', { serviceId, quantity }),
  removeFromCart: (cartItemId) => api.delete(`/cart/${cartItemId}`),
  updateCartItem: (cartItemId, quantity) => api.put(`/cart/${cartItemId}`, { quantity }),

  // Bookings
  createBooking: (data) => api.post('/bookings', data),
  getBookings: () => api.get('/bookings'),
  getBookingById: (id) => api.get(`/bookings/${id}`),
  updateBookingStatus: (id, status) => api.put(`/bookings/${id}/status`, { status }),

  // Reviews
  submitReview: (data) => api.post('/reviews', data),
  getServiceReviews: (serviceId) => api.get(`/services/${serviceId}/reviews`),

  // Partner
  registerPartner: (data) => api.post('/partners/register', data),
  getPartnerProfile: (id) => api.get(`/partners/${id}`),
  updatePartnerProfile: (id, data) => api.put(`/partners/${id}`, data),
  getPartnerBookings: (id) => api.get(`/partners/${id}/bookings`),

  // Cities
  getCities: () => api.get('/cities')
};

export default api;
```

---

### Format Helpers

```javascript
// utils/helpers.js

// Format currency
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0
  }).format(amount);
};

// Format date
export const formatDate = (date) => {
  return new Intl.DateFormat('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date(date));
};

// Format phone number
export const formatPhone = (phone) => {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{2})(\d{5})(\d{5})$/);
  if (match) {
    return `+${match[1]} ${match[2]} ${match[3]}`;
  }
  return phone;
};

// Validate phone
export const isValidPhone = (phone) => {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone);
};

// Validate email
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Truncate text
export const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Get initials from name
export const getInitials = (name) => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

// Debounce function
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Calculate rating stars
export const getRatingStars = (rating) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
  return {
    full: '★'.repeat(fullStars),
    half: hasHalfStar ? '⯨' : '',
    empty: '☆'.repeat(emptyStars)
  };
};
```

---

## 🎯 REACT HOOKS

### useCart Hook

```javascript
// hooks/useCart.js
import { useState, useEffect } from 'react';
import { apiService } from '../utils/api';

export const useCart = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch cart
  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await apiService.getCart();
      setCart(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Add to cart
  const addToCart = async (serviceId, quantity = 1) => {
    try {
      await apiService.addToCart(serviceId, quantity);
      await fetchCart(); // Refresh cart
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // Remove from cart
  const removeFromCart = async (cartItemId) => {
    try {
      await apiService.removeFromCart(cartItemId);
      await fetchCart(); // Refresh cart
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // Update quantity
  const updateQuantity = async (cartItemId, quantity) => {
    try {
      await apiService.updateCartItem(cartItemId, quantity);
      await fetchCart(); // Refresh cart
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // Calculate total
  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      return total + (item.service.price * item.quantity);
    }, 0);
  };

  // Get cart count
  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return {
    cart,
    loading,
    error,
    addToCart,
    removeFromCart,
    updateQuantity,
    getCartTotal,
    getCartCount,
    refreshCart: fetchCart,
  };
};
```

---

### useAuth Hook

```javascript
// hooks/useAuth.js
import { useState, useEffect, createContext, useContext } from 'react';
import { apiService } from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth token
    const token = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (phone, otp) => {
    try {
      const response = await apiService.verifyOTP(phone, otp);
      const { token, user } = response.data;
      
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setUser(null);
  };

  const register = async (userData) => {
    try {
      const response = await apiService.register(userData);
      const { token, user } = response.data;
      
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

---

## 🎨 GLOBAL STYLES

```css
/* styles/index.css */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
@import './variables.css';

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  font-size: 16px;
  scroll-behavior: smooth;
}

body {
  font-family: var(--font-primary);
  color: var(--gray-900);
  background: var(--gray-50);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Container */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-md);
}

@media (min-width: 768px) {
  .container {
    padding: 0 var(--spacing-xl);
  }
}

/* Button Styles */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 24px;
  font-size: var(--font-size-base);
  font-weight: 600;
  border-radius: var(--radius-md);
  border: none;
  cursor: pointer;
  transition: all var(--transition-base);
  text-decoration: none;
  white-space: nowrap;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background: var(--accent-yellow);
  color: var(--white);
}

.btn-primary:hover:not(:disabled) {
  background: var(--accent-yellow-dark);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.btn-secondary {
  background: transparent;
  color: var(--primary-blue);
  border: 2px solid var(--primary-blue);
}

.btn-secondary:hover:not(:disabled) {
  background: var(--primary-blue);
  color: var(--white);
}

.btn-lg {
  padding: 16px 32px;
  font-size: var(--font-size-lg);
}

.btn-sm {
  padding: 8px 16px;
  font-size: var(--font-size-sm);
}

/* Form Elements */
.form-group {
  margin-bottom: var(--spacing-lg);
}

.form-label {
  display: block;
  margin-bottom: var(--spacing-sm);
  font-weight: 500;
  color: var(--gray-700);
}

.form-input,
.form-select,
.form-textarea {
  width: 100%;
  padding: var(--spacing-md);
  border: 2px solid var(--gray-300);
  border-radius: var(--radius-md);
  font-size: var(--font-size-base);
  font-family: inherit;
  transition: border-color var(--transition-fast);
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--primary-blue);
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

/* Grid System */
.grid {
  display: grid;
  gap: var(--spacing-lg);
}

.grid-cols-2 {
  grid-template-columns: repeat(2, 1fr);
}

.grid-cols-3 {
  grid-template-columns: repeat(3, 1fr);
}

.grid-cols-4 {
  grid-template-columns: repeat(4, 1fr);
}

@media (max-width: 1024px) {
  .grid-cols-4 {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .grid-cols-3,
  .grid-cols-4 {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .grid-cols-2,
  .grid-cols-3,
  .grid-cols-4 {
    grid-template-columns: 1fr;
  }
}

/* Utility Classes */
.text-center {
  text-align: center;
}

.text-left {
  text-align: left;
}

.text-right {
  text-align: right;
}

.mt-sm { margin-top: var(--spacing-sm); }
.mt-md { margin-top: var(--spacing-md); }
.mt-lg { margin-top: var(--spacing-lg); }
.mt-xl { margin-top: var(--spacing-xl); }

.mb-sm { margin-bottom: var(--spacing-sm); }
.mb-md { margin-bottom: var(--spacing-md); }
.mb-lg { margin-bottom: var(--spacing-lg); }
.mb-xl { margin-bottom: var(--spacing-xl); }

.p-sm { padding: var(--spacing-sm); }
.p-md { padding: var(--spacing-md); }
.p-lg { padding: var(--spacing-lg); }
.p-xl { padding: var(--spacing-xl); }
```

---

This quick reference guide provides all the essential code snippets you need to get started building a service marketplace like Urban Seva. Use these components as building blocks and customize them according to your specific requirements!

