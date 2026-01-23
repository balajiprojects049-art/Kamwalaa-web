import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import PageHero from '../components/common/PageHero';
import { FiUser, FiMail, FiPhone, FiMapPin, FiSave } from 'react-icons/fi';
import './UserProfile.css';

const UserProfile = () => {
    const { user, updateUser } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: ''
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                address: user.address || ''
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        updateUser(formData);
        alert('Profile updated successfully!');
    };

    if (!user) {
        return (
            <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
                <h2>Please log in to view your profile</h2>
            </div>
        );
    }

    return (
        <div className="user-profile-page">
            <PageHero title="My Profile" subtitle="Manage your account details" />

            <div className="container profile-container">
                <div className="profile-card">
                    <div className="profile-header">
                        <div className="profile-avatar">
                            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <h3>{user.name || 'User'}</h3>
                        <p>{user.phone}</p>
                    </div>

                    <form onSubmit={handleSubmit} className="profile-form">
                        <div className="form-group">
                            <label><FiUser /> Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="form-input"
                            />
                        </div>

                        <div className="form-group">
                            <label><FiPhone /> Phone Number</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="form-input"
                                disabled // Usually phone is unique ID
                            />
                        </div>

                        <div className="form-group">
                            <label><FiMail /> Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="form-input"
                            />
                        </div>

                        <div className="form-group">
                            <label><FiMapPin /> Address</label>
                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className="form-input"
                                rows="3"
                            ></textarea>
                        </div>

                        <button type="submit" className="btn btn-primary btn-block">
                            <FiSave /> Save Changes
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
