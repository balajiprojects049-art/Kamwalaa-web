import React from 'react';
import { FiStar } from 'react-icons/fi';
import { useLanguage } from '../../context/LanguageContext';
import './Testimonials.css';

const Testimonials = () => {
    const { currentLanguage } = useLanguage();

    const testimonials = [
        {
            name: 'Priyanka Rao',
            role: 'Resident, Hyderabad',
            rating: 5,
            content: {
                en: "Excellent deep cleaning service for my flat in Gachibowli. The team was verified and very professional. worth every penny!",
                te: "గచ్చిబౌలిలోని నా ఫ్లాట్‌కి అద్భుతమైన డీప్ క్లీనింగ్ నిపుణులు. బృందం చాలా ప్రొఫెషనల్. ప్రతీ పైసాకు విలువ!",
                hi: "गचीबोौली में मेरे फ्लैट के लिए उत्कृष्ट पेशेवर सफाई सेवा। टीम सत्यापित और बहुत पेशेवर थी।"
            },
            // Indian Professional Woman
            image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&h=150&q=80"
        },
        {
            name: 'Venkat Reddy',
            role: 'Shop Owner, Warangal',
            rating: 5,
            content: {
                en: "Booked an electrician for my shop in Hanamkonda. He came within 2 hours and fixed the main board issue perfectly.",
                te: "హనుమకొండలోని నా షాపు కోసం ఎలక్ట్రీషియన్‌ని బుక్ చేసాను. 2 గంటల్లో వచ్చి మెయిన్ బోర్డు సమస్యను పరిష్కరించారు.",
                hi: "हनमकोंडा में मेरी दुकान के लिए एक बिजली मिस्त्री बुक किया। वह 2 घंटे के भीतर आया और समस्या ठीक की।"
            },
            // Indian Man
            image: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=150&h=150&q=80"
        },
        {
            name: 'Srinivas G',
            role: 'Homeowner, Nalgonda',
            rating: 4,
            content: {
                en: "Good plumbing service. The booking process on the app was easy and the plumber knew his job well.",
                te: "మంచి ప్లంబింగ్ సర్వీస్. యాప్‌లో బుకింగ్ ప్రాసెస్ సులభం మరియు ప్లంబర్‌కు పని బాగా తెలుసు.",
                hi: "अच्छी प्लंबिंग सेवा। ऐप पर बुकिंग प्रक्रिया आसान थी और प्लंबर को अपना काम अच्छे से आता था।"
            },
            // Another Indian Man
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80"
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
