import React from 'react';
import { FiSearch, FiCalendar, FiCheckSquare } from 'react-icons/fi';
import { useLanguage } from '../../context/LanguageContext';
import './HowItWorks.css';

const HowItWorks = () => {
    const { currentLanguage } = useLanguage();

    const steps = [
        {
            icon: FiSearch,
            title: { en: 'Choose a Service', te: 'సేవను ఎంచుకోండి', hi: 'एक सेवा चुनें' },
            desc: {
                en: 'Select from our wide range of professional services',
                te: 'మా విస్తృత శ్రేణి ప్రొఫెషనల్ సేవల నుండి ఎంచుకోండి',
                hi: 'हमारी पेशेवर सेवाओं की विस्तृत श्रृंखला में से चुनें'
            },
            color: '#004976'
        },
        {
            icon: FiCalendar,
            title: { en: 'Book a Slot', te: 'స్లాట్‌ను బుక్ చేయండి', hi: 'एक स्लॉट बुक करें' },
            desc: {
                en: 'Pick a convenient date and time for the service',
                te: 'సేవ కోసం అనుకూలమైన తేదీ మరియు సమయాన్ని ఎంచుకోండి',
                hi: 'सेवा के लिए एक सुविधाजनक तिथि और समय चुनें'
            },
            color: '#FF9800'
        },
        {
            icon: FiCheckSquare,
            title: { en: 'Enjoy the Service', te: 'సేవను ఆస్వాదించండి', hi: 'सेवा का आनंद लें' },
            desc: {
                en: 'Our professionals will take care of the rest',
                te: 'మా నిపుణులు మిగిలినవాటిని చూసుకుంటారు',
                hi: 'हमारे पेशेवर बाकी की देखभाल करेंगे'
            },
            color: '#10B981'
        }
    ];

    return (
        <section className="how-it-works section">
            <div className="container">
                <div className="section-header">
                    <h2 className="section-title">
                        {{ en: 'How It Works', te: 'ఇది ఎలా పని చేస్తుంది', hi: 'यह कैसे काम करता है' }[currentLanguage]}
                    </h2>
                    <p className="section-subtitle">
                        {{ en: '3 simple steps to get your work done', te: 'మీ పనిని పూర్తి చేయడానికి 3 సాధారణ దశలు', hi: 'अपना काम पूरा करने के लिए 3 सरल चरण' }[currentLanguage]}
                    </p>
                </div>

                <div className="steps-container">
                    {steps.map((step, index) => {
                        const Icon = step.icon;
                        return (
                            <div key={index} className="step-card">
                                <div className="step-number" style={{ background: step.color }}>{index + 1}</div>
                                <div className="step-icon-wrapper">
                                    <Icon className="step-icon" style={{ color: step.color }} />
                                </div>
                                <h3 className="step-title">{step.title[currentLanguage]}</h3>
                                <p className="step-description">{step.desc[currentLanguage]}</p>
                                {index < steps.length - 1 && <div className="step-connector"></div>}
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
