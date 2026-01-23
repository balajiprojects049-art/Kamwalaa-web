import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);

    // Load cart from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('kamwalaa_cart');
        if (savedCart) {
            try {
                setCartItems(JSON.parse(savedCart));
            } catch (error) {
                console.error('Error loading cart:', error);
            }
        }
    }, []);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('kamwalaa_cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (service) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.id === service.id);

            if (existingItem) {
                // Increase quantity if already in cart
                return prevItems.map(item =>
                    item.id === service.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                // Add new item
                return [...prevItems, { ...service, quantity: 1 }];
            }
        });
    };

    const removeFromCart = (serviceId) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== serviceId));
    };

    const updateQuantity = (serviceId, quantity) => {
        if (quantity <= 0) {
            removeFromCart(serviceId);
            return;
        }

        setCartItems(prevItems =>
            prevItems.map(item =>
                item.id === serviceId
                    ? { ...item, quantity }
                    : item
            )
        );
    };

    const clearCart = () => {
        setCartItems([]);
        localStorage.removeItem('kamwalaa_cart');
    };

    const getCartTotal = () => {
        return cartItems.reduce((total, item) => {
            const price = parseInt(item.price.replace('₹', '').replace(',', ''));
            return total + (price * item.quantity);
        }, 0);
    };

    const getCartCount = () => {
        return cartItems.reduce((count, item) => count + item.quantity, 0);
    };

    const toggleCart = () => {
        setIsCartOpen(prev => !prev);
    };

    const value = {
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
        isCartOpen,
        setIsCartOpen,
        toggleCart
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};
