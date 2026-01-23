import React from 'react';
import { FiCheckCircle, FiShield, FiDollarSign, FiClock } from 'react-icons/fi';
import { useLanguage } from '../../context/LanguageContext';
import './WhyChooseUs.css';

const WhyChooseUs = () => {
    const { currentLanguage } = useLanguage();

    const features = [
        {
            icon: FiCheckCircle,
            title: { en: 'Verified Professionals', te: 'ధృవీకరించబడిన నిపుణులు', hi: 'सत्यापित पेशेवर' },
            description: {
                en: 'All service providers are thoroughly verified and background checked',
                te: 'అన్ని సర్వీస్ ప్రొవైడర్లు పూర్తిగా ధృవీకరించబడ్డారు మరియు బ్యాక్‌గ్రౌండ్ తనిఖీ చేయబడ్డారు',
                hi: 'सभी सेवा प्रदाता पूरी तरह से सत्यापित और पृष్ठभूमि जांच किए गए हैं'
            },
            color: '#10B981'
        },
        {
            icon: FiShield,
            title: { en: '100% Safe & Secure', te: '100% సురక్షితం', hi: '100% सुरक्षित' },
            description: {
                en: 'Your safety and security is our top priority with insured services',
                te: 'బీమా చేయబడిన సేవలతో మీ భద్రత మా ప్రథమ ప్రాధాన్యత',
                hi: 'बीमित सेवाओं के साथ आपकी सुरक्षा हमारी शीर्ष प्राथमिकता है'
            },
            color: '#0EA5E9'
        },
        {
            icon: FiDollarSign,
            title: { en: 'Transparent Pricing', te: 'పారదర్శక ధరలు', hi: 'पारदर्शी मूल्य निर्धारण' },
            description: {
                en: 'No hidden charges. What you see is what you pay',
                te: 'దాచిన ఛార్జీలు లేవు. మీరు చూసేది మీరు చెల్లించేది',
                hi: 'कोई छिपा शुल्क नहीं। आप जो देखते हैं वही भुगतान करते हैं'
            },
            color: '#FF9800'
        },
        {
            icon: FiClock,
            title: { en: 'On-Time Service', te: 'సకాలంలో సేవ', hi: 'समय पर सेवा' },
            description: {
                en: 'We value your time. Service providers arrive on schedule',
                te: 'మేము మీ సమయానికి విలువ ఇస్తాము. సర్వీస్ ప్రొవైడర్లు షెడ్యూల్ ప్రకారం వస్తారు',
                hi: 'हम आपके समय को महत्व देते हैं। सेवा प्रदाता शेड्यूल पर पहुंचते हैं'
            },
            color: '#8B5CF6'
        }
    ];

    return (
        <section className="why-choose-us section">
            <div className="container">
                <div className="section-header">
                    <h2 className="section-title">
                        {{ en: 'Why Choose Kamwalaa?', te: 'కంవలాను ఎందుకు ఎంచుకోవాలి?', hi: 'कमवाला क्यों चुनें?' }[currentLanguage]}
                    </h2>
                    <p className="section-subtitle">
                        {{ en: 'Trusted by thousands of happy customers', te: 'వేలాది సంతోషకరమైన కస్టమర్లచే నమ్మబడినది', hi: 'हजारों खुश ग्राहकों द्वारा भरोसेमंद' }[currentLanguage]}
                    </p>
                </div>

                <div className="features-grid">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <div key={index} className="feature-card" style={{ animationDelay: `${index * 0.1}s` }}>
                                <div className="feature-icon-wrapper" style={{ background: `${feature.color}15` }}>
                                    <Icon className="feature-icon" style={{ color: feature.color }} />
                                </div>
                                <h3 className="feature-title">{feature.title[currentLanguage]}</h3>
                                <p className="feature-description">{feature.description[currentLanguage]}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default WhyChooseUs;
