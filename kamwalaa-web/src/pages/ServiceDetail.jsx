import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FiCheck, FiArrowLeft } from 'react-icons/fi';
import { useLanguage } from '../context/LanguageContext';
import { getServiceById } from '../data/servicesData';
import { getServiceIcon } from '../utils/serviceIcons';
import './ServiceDetail.css';

const ServiceDetail = () => {
    const { categoryId } = useParams();
    const { currentLanguage } = useLanguage();
    const navigate = useNavigate();
    const service = getServiceById(categoryId);
    const [selectedServices, setSelectedServices] = useState([]);

    if (!service) return <div className="container section center">Service Not Found</div>;

    const toggleService = (id) => {
        if (selectedServices.includes(id)) {
            setSelectedServices(selectedServices.filter(s => s !== id));
        } else {
            setSelectedServices([...selectedServices, id]);
        }
    };

    return (
        <div className="service-detail-page">
            <div className="detail-header" style={{ background: service.gradient }}>
                <div className="container">
                    <Link to="/services" className="back-link"><FiArrowLeft /> Back to Services</Link>
                    <div className="detail-header-content">
                        {(() => {
                            const IconComponent = getServiceIcon(service.id);
                            return (
                                <div className="detail-icon-wrapper">
                                    <IconComponent className="detail-icon" />
                                </div>
                            );
                        })()}
                        <div>
                            <h1 className="detail-title">{service.name[currentLanguage]}</h1>
                            <p className="detail-subtitle">{service.description[currentLanguage]}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="section container">
                <div className="detail-content">
                    <div className="services-selection">
                        <h2 className="selection-title">Select Services to Book</h2>
                        <div className="selection-list">
                            {service.services.map((item) => (
                                <div
                                    key={item.id}
                                    className={`selection-item ${selectedServices.includes(item.id) ? 'selected' : ''}`}
                                    onClick={() => toggleService(item.id)}
                                >
                                    <div className="selection-checkbox">
                                        {selectedServices.includes(item.id) && <FiCheck />}
                                    </div>
                                    <div className="selection-info">
                                        <h3 className="item-name">{item.name[currentLanguage]}</h3>
                                        <span className="item-price">{item.price}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="booking-summary">
                        <div className="summary-card">
                            <h3 className="summary-title">Booking Summary</h3>
                            <div className="summary-list">
                                {selectedServices.length === 0 ? (
                                    <p className="empty-msg">No services selected</p>
                                ) : (
                                    selectedServices.map(id => {
                                        const item = service.services.find(s => s.id === id);
                                        return (
                                            <div key={id} className="summary-item">
                                                <span>{item.name[currentLanguage]}</span>
                                                <span>{item.price}</span>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                            <div className="summary-total">
                                <span>Items Selected:</span>
                                <span>{selectedServices.length}</span>
                            </div>
                            <button
                                className="btn btn-primary btn-block btn-lg"
                                disabled={selectedServices.length === 0}
                                style={{ background: service.gradient, border: 'none' }}
                                onClick={() => navigate('/booking', {
                                    state: {
                                        selectedServices: selectedServices.map(id =>
                                            service.services.find(s => s.id === id)
                                        ),
                                        category: service
                                    }
                                })}
                            >
                                Proceed to Book
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServiceDetail;
