import React from 'react';
import { FiStar } from 'react-icons/fi';
import { useLanguage } from '../../context/LanguageContext';
import './Testimonials.css';

const Testimonials = () => {
    const { currentLanguage } = useLanguage();

    const testimonials = [
        {
            name: 'Ravi Kumar',
            role: 'Homeowner, Nellore',
            rating: 5,
            content: {
                en: "Excellent service! The electrician arrived on time and fixed the issue quickly. Highly recommended.",
                te: "అద్భుతమైన సేవ! ఎలక్ట్రీషియన్ సమయానికి వచ్చి సమస్యను త్వరగా పరిష్కరించారు. ఖచ్చితంగా సిఫార్సు చేస్తున్నాను.",
                hi: "उत्कृष्ट सेवा! बिजली मिस्त्री समय पर आया और समस्या को जल्दी ठीक कर दिया। अत्यधिक अनुशंसित।"
            },
            image: "https://randomuser.me/api/portraits/men/32.jpg"
        },
        {
            name: 'Priya Reddy',
            role: 'Housewife',
            rating: 5,
            content: {
                en: "Very professional cleaning service. My kitchen looks brand new. Thank you Kamwalaa!",
                te: "చాలా ప్రొఫెషనల్ క్లీనింగ్ సర్వీస్. నా వంటగది కొత్తగా కనిపిస్తోంది. ధన్యవాదాలు కంవలా!",
                hi: "बहुत ही पेशेवर सफाई सेवा। मेरी रसोई बिल्कुल नई दिख रही है। धन्यवाद कमवाला!"
            },
            image: "https://randomuser.me/api/portraits/women/44.jpg"
        },
        {
            name: 'Suresh Babu',
            role: 'Business Owner',
            rating: 4,
            content: {
                en: "Great plumbing work. The pricing was transparent and affordable.",
                te: "గొప్ప ప్లంబింగ్ పని. ధరలు పారదర్శకంగా మరియు సరసమైనవిగా ఉన్నాయి.",
                hi: "शानदार प्लंबिंग का काम। मूल्य निर्धारण पारदर्शी और किफायती था।"
            },
            image: "https://randomuser.me/api/portraits/men/67.jpg"
        }
    ];

    return (
        <section className="testimonials section">
            <div className="container">
                <div className="section-header">
                    <h2 className="section-title">
                        {{ en: 'What Our Customers Say', te: 'మా కస్టమర్లు ఏమంటున్నారు', hi: 'हमारे ग्राहक क्या कहते हैं' }[currentLanguage]}
                    </h2>
                    <p className="section-subtitle">
                        {{ en: 'Real feedback from satisfied customers', te: 'సంతృప్తికరమైన కస్టమర్ల నుండి నిజమైన అభిప్రాయం', hi: 'संतुष्ट ग्राहकों से वास्तविक प्रतिक्रिया' }[currentLanguage]}
                    </p>
                </div>

                <div className="testimonials-grid">
                    {testimonials.map((item, index) => (
                        <div key={index} className="testimonial-card">
                            <div className="testimonial-header">
                                <img src={item.image} alt={item.name} className="testimonial-img" />
                                <div>
                                    <h4 className="testimonial-name">{item.name}</h4>
                                    <p className="testimonial-role">{item.role}</p>
                                </div>
                            </div>
                            <div className="testimonial-rating">
                                {[...Array(5)].map((_, i) => (
                                    <FiStar key={i} className={`star-icon ${i < item.rating ? 'active' : ''}`} />
                                ))}
                            </div>
                            <p className="testimonial-content">"{item.content[currentLanguage]}"</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
