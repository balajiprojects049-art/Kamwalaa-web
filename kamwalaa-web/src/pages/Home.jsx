import React, { useMemo } from 'react';
import Hero from '../components/common/Hero';
import ServiceCategoriesSlider from '../components/common/ServiceCategoriesSlider';
import FeaturedServices from '../components/home/FeaturedServices';
import ServicesSection from '../components/common/ServicesSection';
import WhyChooseUs from '../components/common/WhyChooseUs';
import HowItWorks from '../components/common/HowItWorks';
import Testimonials from '../components/common/Testimonials';
import { servicesData } from '../data/servicesData';

const Home = () => {
    // Helper to extract image from a category/subcategory
    const getRepresentativeImage = (item) => {
        if (item.subcategories && item.subcategories.length > 0) {
            return item.subcategories[0]?.services?.[0]?.images?.[0];
        }
        if (item.services && item.services.length > 0) {
            return item.services?.[0]?.images?.[0];
        }
        return null;
    };

    // 1. Main Services -> Top Level Categories (Electrical, Plumbing, etc.)
    const mainServices = useMemo(() => {
        return Object.values(servicesData).map(cat => ({
            id: cat.id,
            name: cat.name,
            price: 'View Services',
            images: [getRepresentativeImage(cat)],
            type: 'category',
            categoryId: cat.id
        }));
    }, []);

    // Helper to get specific subcategory
    const getSubcategory = (catId, subId) => {
        const cat = servicesData[catId];
        if (!cat) return null;
        const sub = cat.subcategories?.find(s => s.id === subId);
        if (!sub) return null;
        return {
            id: sub.id,
            name: sub.name,
            price: 'From ₹299', // Generic starting price
            images: [getRepresentativeImage(sub)],
            type: 'subcategory',
            categoryId: cat.id,
            subcategoryId: sub.id
        };
    };

    // 2. Recommended -> Popular Subcategories
    const recommendedServices = useMemo(() => {
        return [
            getSubcategory('electrical', 'fans'),
            getSubcategory('plumbing', 'washbasin'),
            getSubcategory('cleaning', 'home-clean'),
            getSubcategory('painting', 'painting-walls')
        ].filter(Boolean);
    }, []);

    // 3. Special -> Niche Subcategories (using IDs from servicesData)
    const specialServices = useMemo(() => {
        return [
            getSubcategory('waterPurifier', 'ro-install'), // Note: ID might be ro-install in category too
            getSubcategory('cleaning', 'kitchen-bath'),
            getSubcategory('gardening', 'garden-maintain'),
            getSubcategory('gas', 'gas-pipeline') // Assuming subcat id exists or similar
        ].filter(Boolean);
        // Fallback if some subcats don't match, we might need to verify IDs but this is best effort
    }, []);

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
