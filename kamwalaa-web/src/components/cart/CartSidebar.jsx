import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiX, FiTrash2, FiShoppingBag } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import './CartSidebar.css';

const CartSidebar = () => {
    const { cartItems, removeFromCart, updateQuantity, getCartTotal, isCartOpen, setIsCartOpen } = useCart();
    const navigate = useNavigate();

    const handleCheckout = () => {
        setIsCartOpen(false);
        navigate('/booking', {
            state: {
                selectedServices: cartItems.map(item => ({
                    ...item,
                    quantity: item.quantity
                }))
            }
        });
    };

    if (!isCartOpen) return null;

    return (
        <>
            {/* Overlay */}
            <div className="cart-overlay" onClick={() => setIsCartOpen(false)} />

            {/* Cart Sidebar */}
            <div className="cart-sidebar">
                {/* Header */}
                <div className="cart-header">
                    <div className="cart-title">
                        <FiShoppingBag />
                        <h3>Your Cart ({cartItems.length})</h3>
                    </div>
                    <button className="cart-close-btn" onClick={() => setIsCartOpen(false)}>
                        <FiX />
                    </button>
                </div>

                {/* Cart Items */}
                <div className="cart-body">
                    {cartItems.length === 0 ? (
                        <div className="empty-cart">
                            <FiShoppingBag className="empty-cart-icon" />
                            <h4>Your cart is empty</h4>
                            <p>Add services to get started</p>
                        </div>
                    ) : (
                        <>
                            {cartItems.map(item => (
                                <div key={item.id} className="cart-item">
                                    {/* Item Image */}
                                    {item.images && item.images[0] && (
                                        <div className="cart-item-image">
                                            <img src={item.images[0]} alt={item.name.en} />
                                        </div>
                                    )}

                                    {/* Item Details */}
                                    <div className="cart-item-details">
                                        <h4>{item.name.en}</h4>
                                        <p className="cart-item-price">{item.price}</p>

                                        {/* Quantity Controls */}
                                        <div className="cart-item-quantity">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="qty-btn"
                                            >
                                                -
                                            </button>
                                            <span className="qty-value">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="qty-btn"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>

                                    {/* Remove Button */}
                                    <button
                                        className="cart-item-remove"
                                        onClick={() => removeFromCart(item.id)}
                                        title="Remove from cart"
                                    >
                                        <FiTrash2 />
                                    </button>
                                </div>
                            ))}
                        </>
                    )}
                </div>

                {/* Cart Footer */}
                {cartItems.length > 0 && (
                    <div className="cart-footer">
                        <div className="cart-total">
                            <span className="total-label">Total Amount</span>
                            <span className="total-amount">₹{getCartTotal().toLocaleString()}</span>
                        </div>
                        <button className="checkout-btn" onClick={handleCheckout}>
                            Proceed to Checkout
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};

export default CartSidebar;
