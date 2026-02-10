import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllCategories } from '../data/servicesData';
import { translations } from '../i18n/translations';
import Hero from '../components/common/Hero';
import ServiceCategoriesSlider from '../components/common/ServiceCategoriesSlider';
import FeaturedServices from '../components/home/FeaturedServices';
import ServicesSection from '../components/common/ServicesSection';
import WhyChooseUs from '../components/common/WhyChooseUs';
import HowItWorks from '../components/common/HowItWorks';
import Testimonials from '../components/common/Testimonials';
import { useLanguage } from '../context/LanguageContext';

const Home = () => {
    const navigate = useNavigate();
    const { currentLanguage } = useLanguage();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    // Initial Data Fetch
    useEffect(() => {
        // Use local data instead of API to ensure consistency
        const localCategories = getAllCategories();
        setCategories(localCategories);
        setLoading(false);
    }, []);

    // Helper to extract image
    const getRepresentativeImage = (item) => {
        if (item.image) return item.image;
        if (item.iconPath) return item.iconPath;

        if (item.subcategories && item.subcategories.length > 0) {
            const sub = item.subcategories[0];
            if (sub.services && sub.services.length > 0 && sub.services[0].images && sub.services[0].images.length > 0) {
                return sub.services[0].images[0];
            }
        }
        return null;
    };

    const getName = (item) => {
        if (!item) return '';
        if (item.name && typeof item.name === 'object') {
            return item.name[currentLanguage] || item.name.en || '';
        }
        return item.name || '';
    };

    // 1. Main Services -> Top Level Categories
    const mainServices = useMemo(() => {
        return categories.map(cat => ({
            id: cat.id,
            name: { en: getName(cat) },
            price: 'View Services',
            images: [getRepresentativeImage(cat)],
            type: 'category',
            categoryId: cat.id
        })).slice(0, 4);
    }, [categories, currentLanguage]);



    // 3. Special -> Specific Hand-picked Services
    const specialServices = useMemo(() => {
        const targetIds = [
            { catId: 'electrical', subId: 'fans' },
            { catId: 'ac', subId: 'ac-service' },
            { catId: 'waterPurifier', subId: 'ro-repair' },
            { catId: 'cleaning', subId: 'bathroom-cleaning' }
        ];

        const specs = [];
        targetIds.forEach(({ catId, subId }) => {
            const cat = categories.find(c => c.id === catId);
            if (cat && cat.subcategories) {
                const sub = cat.subcategories.find(s => s.id === subId);
                if (sub) {
                    const serviceImage = sub.services?.[0]?.images?.[0] || null;
                    specs.push({
                        id: sub.id,
                        name: { en: getName(sub) },
                        price: null,
                        images: serviceImage ? [serviceImage] : [],
                        type: 'subcategory',
                        categoryId: cat.id,
                        subcategoryId: sub.id
                    });
                }
            }
        });
        return specs;
    }, [categories, currentLanguage]);

    return (
        <div className="home-page">
            <Hero />
            <ServiceCategoriesSlider />

            <FeaturedServices title="Main Services" services={mainServices} />

            <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0 40px' }}>
                <button
                    onClick={() => navigate('/services')}
                    style={{
                        padding: '12px 30px',
                        background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)',
                        transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 6px 8px -1px rgba(37, 99, 235, 0.3)';
                    }}
                    onMouseOut={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 4px 6px -1px rgba(37, 99, 235, 0.2)';
                    }}
                >
                    {translations[currentLanguage]?.services?.viewAll || 'View All Services'}
                </button>
            </div>



            <FeaturedServices title="Special Services" services={specialServices} />

            <ServicesSection />
            <WhyChooseUs />
            <HowItWorks />
            <Testimonials />
        </div>
    );
};

export default Home;
