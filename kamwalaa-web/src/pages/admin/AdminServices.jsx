import React, { useState } from 'react';
import { useToastContext as useToast } from '../../context/ToastContext';
import {
    FaEdit,
    FaTrash,
    FaPlus,
    FaSearch,
    FaImage,
    FaTimes,
    FaCheck
} from 'react-icons/fa';
import { servicesData } from '../../data/servicesData';
import './AdminServices.css';

const AdminServices = () => {
    // Convert the servicesData object into a flat array for easier management
    const initialServices = Object.values(servicesData).flatMap(category =>
        category.subcategories.flatMap(sub =>
            sub.services.map(service => ({
                ...service,
                category: category.name.en,
                subcategory: sub.name.en,
                categoryId: category.id,
                subcategoryId: sub.id
            }))
        )
    );

    const [services, setServices] = useState(initialServices);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingService, setEditingService] = useState(null);
    const { showToast } = useToast();

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
        category: '',
        image: ''
    });

    // Filter services based on search
    const filteredServices = services.filter(service =>
        service.name.en.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleEdit = (service) => {
        setEditingService(service);
        setFormData({
            name: service.name.en,
            price: service.price,
            description: service.description?.en || '',
            category: service.category,
            image: service.images?.[0] || ''
        });
        setIsModalOpen(true);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this service?')) {
            setServices(prev => prev.filter(s => s.id !== id));
            showToast('Service deleted successfully', 'success');
        }
    };

    const handleSave = (e) => {
        e.preventDefault();

        if (editingService) {
            // Update existing service
            setServices(prev => prev.map(s =>
                s.id === editingService.id
                    ? {
                        ...s,
                        name: { ...s.name, en: formData.name },
                        price: formData.price,
                        description: { ...s.description, en: formData.description },
                        images: [formData.image]
                    }
                    : s
            ));
            showToast('Service updated successfully', 'success');
        } else {
            // Add new service (Mock implementation)
            const newService = {
                id: `new-${Date.now()}`,
                name: { en: formData.name, te: formData.name, hi: formData.name }, // Simplified for mock
                price: formData.price,
                description: { en: formData.description, te: formData.description, hi: formData.description },
                category: formData.category,
                images: [formData.image],
                subcategory: 'General' // Default
            };
            setServices(prev => [newService, ...prev]);
            showToast('New service added successfully', 'success');
        }

        setIsModalOpen(false);
        setEditingService(null);
        setFormData({ name: '', price: '', description: '', category: '', image: '' });
    };

    return (
        <div className="admin-services-container">
            <div className="services-header">
                <div>
                    <h1>Services Management</h1>
                    <p>Manage your service listings, prices, and details</p>
                </div>
                <button
                    className="add-service-btn"
                    onClick={() => {
                        setEditingService(null);
                        setFormData({ name: '', price: '', description: '', category: '', image: '' });
                        setIsModalOpen(true);
                    }}
                >
                    <FaPlus /> Add New Service
                </button>
            </div>

            {/* Search Bar */}
            <div className="search-bar-wrapper">
                <FaSearch className="search-icon" />
                <input
                    type="text"
                    placeholder="Search services by name or category..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
            </div>

            {/* Services Table */}
            <div className="services-table-card">
                <div className="table-responsive">
                    <table className="services-table">
                        <thead>
                            <tr>
                                <th>Service Name</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredServices.map((service) => (
                                <tr key={service.id}>
                                    <td>
                                        <div className="service-cell">
                                            <div className="service-img-placeholder">
                                                {service.images?.[0] ? (
                                                    <img src={service.images[0]} alt={service.name.en} />
                                                ) : (
                                                    <FaImage />
                                                )}
                                            </div>
                                            <div>
                                                <span className="service-name-text">{service.name.en}</span>
                                                <span className="service-desc-text">{service.description?.en?.substring(0, 50)}...</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="category-badge">{service.category}</span>
                                    </td>
                                    <td className="price-cell">{service.price}</td>
                                    <td>
                                        <span className="status-badge active">Active</span>
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            <button
                                                className="icon-btn edit-btn"
                                                onClick={() => handleEdit(service)}
                                                title="Edit Service"
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                className="icon-btn delete-btn"
                                                onClick={() => handleDelete(service.id)}
                                                title="Delete Service"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit/Add Modal */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>{editingService ? 'Edit Service' : 'Add New Service'}</h2>
                            <button className="close-btn" onClick={() => setIsModalOpen(false)}>
                                <FaTimes />
                            </button>
                        </div>
                        <form onSubmit={handleSave} className="modal-form">
                            <div className="form-group">
                                <label>Service Name (English)</label>
                                <input
                                    type="text"
                                    className="modal-input"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Price</label>
                                    <input
                                        type="text"
                                        className="modal-input"
                                        value={formData.price}
                                        onChange={e => setFormData({ ...formData, price: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Category</label>
                                    <input
                                        type="text"
                                        className="modal-input"
                                        value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Description (English)</label>
                                <textarea
                                    className="modal-textarea"
                                    rows="4"
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    required
                                ></textarea>
                            </div>

                            <div className="form-group">
                                <label>Image URL</label>
                                <input
                                    type="text"
                                    className="modal-input"
                                    value={formData.image}
                                    onChange={e => setFormData({ ...formData, image: e.target.value })}
                                    placeholder="https://..."
                                />
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="cancel-btn" onClick={() => setIsModalOpen(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="save-btn">
                                    <FaCheck /> Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminServices;
