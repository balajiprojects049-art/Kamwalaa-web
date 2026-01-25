import React, { useState, useEffect, useMemo } from 'react';
import { getServiceCategories } from '../services/apiService';
import Hero from '../components/common/Hero';
import ServiceCategoriesSlider from '../components/common/ServiceCategoriesSlider';
import FeaturedServices from '../components/home/FeaturedServices';
import ServicesSection from '../components/common/ServicesSection';
import WhyChooseUs from '../components/common/WhyChooseUs';
import HowItWorks from '../components/common/HowItWorks';
import Testimonials from '../components/common/Testimonials';
import { useLanguage } from '../context/LanguageContext';

const Home = () => {
    const { currentLanguage } = useLanguage();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await getServiceCategories();
                if (response.success) {
                    setCategories(response.data);
                }
            } catch (error) {
                console.error("Error loading home data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    // Helper to extract image
    const getRepresentativeImage = (item) => {
        // Backend data structure: item might have image_url or nested services with images
        if (item.icon_url) return item.icon_url; // Categories have icon_url
        if (item.subcategories && item.subcategories.length > 0) {
            // Try to find an image in subcategories -> services
            const sub = item.subcategories[0];
            if (sub.services && sub.services.length > 0 && sub.services[0].image_url) {
                return sub.services[0].image_url;
            }
        }
        return null;
    };

    const getName = (item) => {
        if (!item) return '';
        // Handle database format (simple string) or local format (object)
        if (typeof item.name === 'string') return item.name;
        return item.name[currentLanguage] || item.name.en || '';
    };

    // 1. Main Services -> Top Level Categories
    const mainServices = useMemo(() => {
        return categories.map(cat => ({
            id: cat.id,
            name: { en: getName(cat) }, // FeaturedServices expects object with en/te key
            price: 'View Services',
            images: [cat.icon_url || getRepresentativeImage(cat)],
            type: 'category',
            categoryId: cat.id
        })).slice(0, 4);
    }, [categories, currentLanguage]);

    // 2. Recommended -> Popular Subcategories (Just picking some for now)
    const recommendedServices = useMemo(() => {
        const recs = [];
        categories.forEach(cat => {
            if (cat.subcategories) {
                cat.subcategories.slice(0, 1).forEach(sub => {
                    recs.push({
                        id: sub.id,
                        name: { en: getName(sub) },
                        price: 'From ₹249',
                        images: sub.services?.[0]?.image_url ? [sub.services[0].image_url] : [],
                        type: 'subcategory',
                        categoryId: cat.id,
                        subcategoryId: sub.id
                    });
                });
            }
        });
        return recs.slice(0, 4);
    }, [categories, currentLanguage]);

    // 3. Special -> More Subcategories
    const specialServices = useMemo(() => {
        const specs = [];
        // Flatten all subcategories and pick from middle
        const allSubs = [];
        categories.forEach(cat => {
            if (cat.subcategories) {
                cat.subcategories.forEach(sub => {
                    allSubs.push({ sub, cat });
                });
            }
        });
        // Just pick some random/different ones
        allSubs.slice(2, 6).forEach(({ sub, cat }) => {
            specs.push({
                id: sub.id,
                name: { en: getName(sub) },
                price: 'Best Price',
                images: sub.services?.[0]?.image_url ? [sub.services[0].image_url] : [],
                type: 'subcategory',
                categoryId: cat.id,
                subcategoryId: sub.id
            });
        });
        return specs;
    }, [categories, currentLanguage]);

    return (
        <div className="home-page">
            <Hero />
            <ServiceCategoriesSlider />

            <FeaturedServices title="Main Services" services={mainServices} />

            <FeaturedServices title="Recommended Services" services={recommendedServices} />

            <FeaturedServices title="Special Services" services={specialServices} />

            <ServicesSection />
            <WhyChooseUs />
            <HowItWorks />
            <Testimonials />
        </div>
    );
};

export default Home;
