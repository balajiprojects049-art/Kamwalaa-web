import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useModal } from '../../context/ModalContext';
import { FiUpload, FiArrowRight, FiArrowLeft, FiCheckCircle } from 'react-icons/fi';
import { getAllCategories } from '../../data/servicesData';
import { createPartner } from '../../services/apiService';
import './PartnerDashboard.css'; // Reuse container styles

const PartnerRegistration = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const toast = useToast();
    const modal = useModal();
    const categories = getAllCategories();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [step, setStep] = useState(1);

    const [formData, setFormData] = useState({
        name: user?.name || '',
        phone: user?.phone || '',
        whatsapp_number: user?.phone || '',
        city: user?.city || '',
        email: user?.email || '',
        serviceCategory: '',
        business_name: '',
        aadhar_number: '',
        pan_number: '',
        address: ''
    });

    const [files, setFiles] = useState({
        aadhar_file: null,
        pan_file: null
    });

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                name: user.name || '',
                phone: user.phone || '',
                whatsapp_number: user.phone || '',
                email: user.email || '',
                city: user.city || ''
            }));
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFiles({ ...files, [e.target.name]: e.target.files[0] });
    };

    const handleNext = (e) => {
        e.preventDefault();
        if (!formData.city || !formData.serviceCategory) {
            toast.error('Please Select City and Category');
            return;
        }
        setStep(2);
    };

    const handleBack = () => {
        setStep(1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (!formData.address || !formData.aadhar_number || !formData.pan_number || !files.aadhar_file || !files.pan_file) {
            toast.error('Please complete all verification details.');
            setIsSubmitting(false);
            return;
        }

        try {
            const data = new FormData();
            // Append text data
            Object.keys(formData).forEach(key => {
                if (key === 'serviceCategory') {
                    data.append('service_category', formData[key]);
                } else {
                    data.append(key, formData[key]);
                }
            });
            // Append files
            if (files.aadhar_file) data.append('aadhar_file', files.aadhar_file);
            if (files.pan_file) data.append('pan_file', files.pan_file);

            // Pass user_id if authenticated
            if (user?.id) {
                data.append('user_id', user.id);
            }

            const response = await createPartner(data);

            if (response.success) {
                modal.alert(
                    '✅ Registration Successful',
                    'Your verification documents have been submitted. Admin will verify shortly.',
                    () => {
                        navigate('/partner/dashboard');
                    }
                );
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Registration failed.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="partner-dashboard-container" style={{ marginTop: '100px', maxWidth: '800px' }}>
            <div className="job-card" style={{ padding: '40px' }}>
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <h1 style={{ color: '#1e3a8a' }}>Complete Partner Registration</h1>
                    <p style={{ color: '#64748b' }}>Step {step} of 2 - {step === 1 ? 'Service Details' : 'Verification Documents'}</p>
                </div>

                <div className="step-indicator" style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '30px' }}>
                    <div style={{ width: '40px', height: '10px', borderRadius: '5px', background: step >= 1 ? '#2563eb' : '#e2e8f0' }}></div>
                    <div style={{ width: '40px', height: '10px', borderRadius: '5px', background: step >= 2 ? '#2563eb' : '#e2e8f0' }}></div>
                </div>

                <form onSubmit={step === 1 ? handleNext : handleSubmit}>
                    {step === 1 && (
                        <div className="fade-in">
                            <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <div className="form-group">
                                    <label>Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="form-input"
                                        placeholder="Enter your full name"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Phone Number</label>
                                    <input type="text" name="phone" value={formData.phone} disabled className="form-input" style={{ background: '#f1f5f9' }} />
                                </div>
                            </div>

                            <div className="form-group" style={{ marginTop: '20px' }}>
                                <label>City</label>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="Enter your city"
                                    required
                                />
                            </div>

                            <div className="form-group" style={{ marginTop: '20px' }}>
                                <label>Service Category</label>
                                <select
                                    name="serviceCategory"
                                    value={formData.serviceCategory}
                                    onChange={handleChange}
                                    className="form-input"
                                    required
                                >
                                    <option value="">Choose a category</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name.en}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group" style={{ marginTop: '20px' }}>
                                <label>Business Name (Optional)</label>
                                <input
                                    type="text"
                                    name="business_name"
                                    value={formData.business_name}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="e.g. Rahul Electricals"
                                />
                            </div>

                            <button type="submit" className="btn-complete" style={{ marginTop: '30px', background: '#2563eb' }}>
                                Next Step <FiArrowRight />
                            </button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="fade-in">
                            <div className="form-group">
                                <label>Permanent Address</label>
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="form-input"
                                    rows="3"
                                    placeholder="Enter full address"
                                    required
                                ></textarea>
                            </div>

                            <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
                                <div className="form-group">
                                    <label>Aadhar Number</label>
                                    <input type="text" name="aadhar_number" value={formData.aadhar_number} onChange={handleChange} className="form-input" required />
                                </div>
                                <div className="form-group">
                                    <label>PAN Number</label>
                                    <input type="text" name="pan_number" value={formData.pan_number} onChange={handleChange} className="form-input" required />
                                </div>
                            </div>

                            <div className="form-group" style={{ marginTop: '20px' }}>
                                <label>Upload Aadhar Card (Image/PDF)</label>
                                <input type="file" name="aadhar_file" onChange={handleFileChange} className="form-input" accept="image/*,application/pdf" required />
                            </div>

                            <div className="form-group" style={{ marginTop: '20px' }}>
                                <label>Upload PAN Card (Image/PDF)</label>
                                <input type="file" name="pan_file" onChange={handleFileChange} className="form-input" accept="image/*,application/pdf" required />
                            </div>

                            <div style={{ display: 'flex', gap: '20px', marginTop: '30px' }}>
                                <button type="button" onClick={handleBack} className="btn-complete" style={{ background: '#64748b' }}>
                                    <FiArrowLeft /> Back
                                </button>
                                <button type="submit" disabled={isSubmitting} className="btn-complete" style={{ background: '#16a34a' }}>
                                    {isSubmitting ? 'Submitting...' : 'Submit Documents'}
                                </button>
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default PartnerRegistration;
