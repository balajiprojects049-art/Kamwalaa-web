// Complete Kamwalaa Services Data - 54 Services across 8 Categories
// Restructured for 3-Column Layout (Category -> Subcategory -> Services)

export const servicesData = {
    electrical: {
        id: 'electrical',
        icon: '⚡',
        iconPath: '/assets/icons/electrical.png',
        name: { en: 'Electrical Services', te: 'విద్యుత్ సేవలు', hi: 'बिजली सेवाएं' },
        color: '#FFB800',
        bgColor: '#FFF8E6',
        gradient: 'linear-gradient(135deg, #FFB800, #FF9800)',
        description: {
            en: 'Professional electrical solutions for your home including fan services, house wiring, light installation, and decorative lighting.',
            te: 'ఫ్యాన్ సేవలు, హౌస్ వైరింగ్, లైట్ ఇన్‌స్టాలేషన్ మరియు డెకరేటివ్ లైటింగ్‌తో సహా మీ ఇంటి కోసం ప్రొఫెషనల్ ఎలక్ట్రికల్ సొల్యూషన్స్.',
            hi: 'आपके घर के लिए पेशेवर बिजली समाधान जिसमें पंखा सेवाएं, घर की वायरिंग, लाइट इंस्टालेशन और सजावटी लाइटिंग शामिल है।'
        },
        subcategories: [
            {
                id: 'fans',
                name: { en: 'Fans & Air Coolers', te: 'ఫ్యాన్లు & కూలర్లు', hi: 'पंखे और कूलर' },
                services: [
                    {
                        id: 'fan-install',
                        name: { en: 'Fan Installation', te: 'ఫ్యాన్ ఇన్‌స్టాలేషన్', hi: 'पंखा इंस्टालेशन' },
                        price: '₹250',
                        images: ['/assets/images/services/electrical/fan-install-1.jpg', '/assets/images/services/electrical/fan-install-2.jpg'],
                        description: {
                            en: 'Professional installation of ceiling fans with secure mounting and wiring check.',
                            te: 'సురక్షిత మౌంటింగ్ మరియు వైరింగ్ తనిఖీతో సీలింగ్ ఫ్యాన్ల ప్రొఫెషనల్ ఇన్‌స్టాలేషన్.',
                            hi: 'सुरक्षित माउंटिंग और वायरिंग जांच के साथ सीलिंग पंखे का पेशेवर इंस्टालेशन।'
                        }
                    },
                    {
                        id: 'fan-replace',
                        name: { en: 'Fan Replacement', te: 'ఫ్యాన్ రీప్లేస్‌మెంట్', hi: 'पंखा प्रतिस्थापन' },
                        price: '₹300',
                        images: ['/assets/images/services/electrical/fan-install-1.jpg'],
                        description: {
                            en: 'Replacement of old fan with new one, ensuring proper balance and speed regulation.',
                            te: 'పాత ఫ్యాన్‌ను కొత్తదానితో మార్చడం, సరైన బ్యాలెన్స్ మరియు స్పీడ్ రెగ్యులేషన్‌ను నిర్ధారించుకోవడం.',
                            hi: 'पुराने पंखे को नए के साथ बदलना, उचित संतुलन और गति विनियमन सुनिश्चित करना।'
                        }
                    },
                    {
                        id: 'fan-repair',
                        name: { en: 'Fan Repair', te: 'ఫ్యాన్ రిపేర్', hi: 'पंखा मरम्मत' },
                        price: '₹200',
                        images: ['/assets/images/services/electrical/fan-repair-1.jpg', '/assets/images/services/electrical/fan-repair-2.jpg'],
                        description: {
                            en: 'Diagnosis and repair of fan noise, wobble, or speed issues.',
                            te: 'ఫ్యాన్ శబ్దం, వణుకు లేదా వేగ సమస్యల నిర్ధారణ మరియు మరమ్మత్తు.',
                            hi: 'पंखे के शोर, डगमगाने या गति के मुद्दों का निदान और मरम्मत।'
                        }
                    },
                    {
                        id: 'regulator',
                        name: { en: 'Regulator Replacement', te: 'రెగ్యులేటర్ రీప్లేస్‌మెంట్', hi: 'नियामक प्रतिस्थापन' },
                        price: '₹150',
                        images: ['/assets/images/services/electrical/wiring-work.jpg'],
                        description: {
                            en: 'Replacement of faulty fan regulators for smooth speed control.',
                            te: 'స్మూత్ స్పీడ్ కంట్రోల్ కోసం పాడైపోయిన ఫ్యాన్ రెగ్యులేటర్ల మార్పిడి.',
                            hi: 'सुचारू गति नियंत्रण के लिए खराब पंखे नियामकों का प्रतिस्थापन।'
                        }
                    }
                ]
            },
            {
                id: 'wiring',
                name: { en: 'Wiring & Power', te: 'వైరింగ్ & పవర్', hi: 'वायरिंग और पावर' },
                services: [
                    {
                        id: 'house-wiring',
                        name: { en: 'House Wiring', te: 'హౌస్ వైరింగ్', hi: 'घर की वायरिंग' },
                        price: 'Custom',
                        images: ['/assets/images/services/electrical/wiring-work.jpg'],
                        description: {
                            en: 'Complete electrical wiring for new homes or renovation projects.',
                            te: 'కొత్త ఇళ్లు లేదా రినోవేషన్ ప్రాజెక్టుల కోసం పూర్తి ఎలక్ట్రికల్ వైరింగ్.',
                            hi: 'नए घरों या नवीनीकरण परियोजनाओं के लिए पूर्ण विद्युत वायरिंग।'
                        }
                    },
                    {
                        id: 'partial-wiring',
                        name: { en: 'Partial Wiring', te: 'పార్శియల్ వైరింగ్', hi: 'आंशिक वायरिंग' },
                        price: '₹3,000+',
                        images: ['/assets/images/services/electrical/wiring-work.jpg'],
                        description: { en: 'Wiring for specific rooms or additions.', te: 'నిర్దిష్ట గదుల కోసం వైరింగ్.', hi: 'विशिष्ट कमरों के लिए वायरिंग।' }
                    },
                    {
                        id: 'switchboard',
                        name: { en: 'Switchboard Wiring', te: 'స్విచ్‌బోర్డ్ వైరింగ్', hi: 'स्विचबोर्ड वायरिंग' },
                        price: '₹1,000',
                        images: ['/assets/images/services/electrical/wiring-work.jpg'],
                        description: { en: 'Installation and wiring of switchboards.', te: 'స్విచ్‌బోర్డుల ఇన్‌స్టాలేషన్.', hi: 'स्विचबोर्ड का इंस्टालेशन।' }
                    },
                    {
                        id: 'earthing',
                        name: { en: 'Earthing Connection', te: 'ఎర్తింగ్ కనెక్షన్', hi: 'अर्थिंग कनेक्शन' },
                        price: '₹2,000',
                        images: ['/assets/images/services/electrical/wiring-work.jpg'],
                        description: { en: 'Safety earthing for home electrical systems.', te: 'ఇంటి విద్యుత్ వ్యవస్థల కోసం ఎర్తింగ్.', hi: 'घरेलू विद्युत प्रणालियों के लिए अर्थिंग।' }
                    }
                ]
            },
            {
                id: 'lights',
                name: { en: 'Lights & Switches', te: 'లైట్లు & స్విచ్‌లు', hi: 'लाइट्स और स्विच' },
                services: [
                    {
                        id: 'light-install',
                        name: { en: 'Light Installation', te: 'లైట్ ఇన్‌స్టాలేషన్', hi: 'लाइट इंस्टालेशन' },
                        price: '₹200',
                        images: ['/assets/images/services/electrical/fan-install-1.jpg'],
                        description: { en: 'Installation of tube lights and bulbs.', te: 'ట్యూబ్ లైట్లు మరియు బల్బుల ఇన్‌స్టాలేషన్.', hi: 'ट्यूब लाइट और बल्ब का इंस्टालेशन।' }
                    },
                    {
                        id: 'switch-replace',
                        name: { en: 'Switch Replacement', te: 'స్విచ్ రీప్లేస్‌మెంట్', hi: 'स्विच प्रतिस्थापन' },
                        price: '₹100',
                        images: ['/assets/images/services/electrical/wiring-work.jpg'],
                        description: { en: 'Replacement of faulty switches and sockets.', te: 'పాడైపోయిన స్విచ్‌ల రీప్లేస్‌మెంట్.', hi: 'दोषपूर्ण स्विच का प्रतिस्थापन।' }
                    },
                    {
                        id: 'dimmer',
                        name: { en: 'Dimmer Switch Setup', te: 'డిమ్మర్ స్విచ్ సెటప్', hi: 'डिमर स्विच सेटअप' },
                        price: '₹250',
                        images: ['/assets/images/services/electrical/wiring-work.jpg'],
                        description: { en: 'Installation of fan regulators and dimmers.', te: 'ఫ్యాన్ రెగ్యులేటర్ల ఇన్‌స్టాలేషన్.', hi: 'पंखे के नियामकों का इंस्टालेशन।' }
                    },
                    {
                        id: 'festival-lights',
                        name: { en: 'Festival Lighting', te: 'ఫెస్టివల్ లైటింగ్', hi: 'त्योहार लाइटिंग' },
                        price: '₹800',
                        images: ['/assets/images/services/electrical/fan-install-1.jpg'],
                        description: { en: 'Decorative lighting setup for festivals.', te: 'పండుగలకు డెకరేటివ్ లైటింగ్.', hi: 'त्योहारों के लिए सजावटी लाइटिंग।' }
                    },
                    {
                        id: 'ceiling-lights',
                        name: { en: 'False Ceiling Lights', te: 'ఫాల్స్ సీలింగ్ లైట్స్', hi: 'फाल्स सीलिंग लाइट्स' },
                        price: '₹2,000',
                        images: ['/assets/images/services/electrical/fan-install-1.jpg'],
                        description: { en: 'Installation of LED strip, cove, and panel lights.', te: 'LED స్ట్రిప్ మరియు ప్యానెల్ లైట్ల ఇన్‌స్టాలేషన్.', hi: 'एलईडी स्ट्रिप और पैनल लाइट्स का इंस्टालेशन।' }
                    }
                ]
            }
        ]
    },
    plumbing: {
        id: 'plumbing',
        icon: '💧',
        iconPath: '/assets/icons/plumbing.png',
        name: { en: 'Plumbing Services', te: 'ప్లంబింగ్ సేవలు', hi: 'प्लंबिंग सेवाएं' },
        color: '#0EA5E9',
        bgColor: '#E0F2FE',
        gradient: 'linear-gradient(135deg, #0EA5E9, #0369A1)',
        description: {
            en: 'Complete plumbing solutions including sink & tap services, water tank cleaning, and pipe repairs.',
            te: 'సింక్ & ట్యాప్ సేవలు, వాటర్ ట్యాంక్ క్లీనింగ్ మరియు పైప్ మరమ్మతులతో సహా పూర్తి ప్లంబింగ్ సొల్యూషన్స్.',
            hi: 'सिंक और नल सेवाएं, पानी की टंकी की सफाई और पाइप मरम्मत सहित पूर्ण प्लंबिंग समाधान।'
        },
        subcategories: [
            {
                id: 'washbasin',
                name: { en: 'Washbasin & Taps', te: 'వాష్‌బేసిన్ & కుళాయిలు', hi: 'वाशबेसिन और नल' },
                services: [
                    {
                        id: 'sink-install',
                        name: { en: 'Sink Installation', te: 'సింక్ ఇన్‌స్టాలేషన్', hi: 'सिंक इंस्टालेशन' },
                        price: '₹500',
                        images: ['/assets/images/services/plumbing/tap-repair.png'],
                        description: {
                            en: 'Installation of new kitchen or bathroom sinks with secure plumbing connections.',
                            te: 'సురక్షిత ప్లంబింగ్ కనెక్షన్లతో కొత్త వంటగది లేదా బాత్రూమ్ సింక్ల ఇన్‌స్టాలేషన్.',
                            hi: 'सुरक्षित प्लंबिंग कनेक्शन के साथ नए रसोई या बाथरूम सिंक की स्थापना।'
                        }
                    },
                    { id: 'sink-repair', name: { en: 'Sink Leakage Repair', te: 'సింక్ లీకేజ్ రిపేర్', hi: 'सिंक रिसाव मरम्मत' }, price: '₹250' },
                    {
                        id: 'tap-repair',
                        name: { en: 'Tap Repair', te: 'ట్యాప్ రిపేర్', hi: 'नल मरम्मत' },
                        price: '₹200',
                        images: ['/assets/images/services/plumbing/tap-repair.png'],
                        description: {
                            en: 'Fixing leaking taps, replacing washers, and ensuring smooth water flow.',
                            te: 'లీకవుతున్న ట్యాప్లను సరిచేయడం, వాషర్లను మార్చడం మరియు సాఫీగా నీటి ప్రవాహాన్ని నిర్ధారించడం.',
                            hi: 'टपकते हुए नल को ठीक करना, वाशर बदलना और सुचारू जल प्रवाह सुनिश्चित करना।'
                        }
                    },
                    { id: 'tap-replace', name: { en: 'Tap Replacement', te: 'ట్యాప్ రీప్లేస్‌మెంట్', hi: 'नल प्रतिस्थापन' }, price: '₹300' }
                ]
            },
            {
                id: 'tanks',
                name: { en: 'Water Tanks', te: 'నీటి ట్యాంకులు', hi: 'पानी की टंकियां' },
                services: [
                    {
                        id: 'tank-clean',
                        name: { en: 'Overhead Tank Cleaning', te: 'ఓవర్‌హెడ్ ట్యాంక్ క్లీనింగ్', hi: 'ओवरहेड टैंक सफाई' },
                        price: '₹1,200',
                        images: ['/assets/images/services/plumbing/water-tank.png'],
                        description: {
                            en: 'Mechanized dewatering, sludge removal, and high-pressure cleaning of overhead water tanks.',
                            te: 'ఓవర్‌హెడ్ వాటర్ ట్యాంక్ల మెకనైజ్డ్ డీవాటరింగ్, స్లడ్జ్ తొలగింపు మరియు అధిక ఒత్తిడి క్లీనింగ్.',
                            hi: 'ओवरहेड पानी की टंकियों की मशीनीकृत डीवाटरिंग, कीचड़ हटाना और उच्च दबाव वाली सफाई।'
                        }
                    },
                    { id: 'sump-clean', name: { en: 'Underground Sump Cleaning', te: 'అండర్‌గ్రౌండ్ సంప్ క్లీనింగ్', hi: 'भूमिगत सम्प सफाई' }, price: '₹1,500' },
                    { id: 'disinfection', name: { en: 'Tank Disinfection', te: 'ట్యాంక్ డిసిన్‌ఫెక్షన్', hi: 'टैंक कीटाणुशोधन' }, price: '₹400' }
                ]
            },
            {
                id: 'pipes',
                name: { en: 'Pipelines & Pumps', te: 'పైప్‌లైన్‌లు', hi: 'पाइपलाइन' },
                services: [
                    { id: 'waterline', name: { en: 'Water Line Installation', te: 'వాటర్ లైన్ ఇన్‌స్టాలేషన్', hi: 'वॉटर लाइन इंस्टालेशन' }, price: '₹2,500' },
                    {
                        id: 'pipe-leak',
                        name: { en: 'Pipe Leakage Repair', te: 'పైప్ లీకేజ్ రిపేర్', hi: 'पाइप रिसाव मरम्मत' },
                        price: '₹500',
                        images: ['/assets/images/services/plumbing/pipe-fix.png'],
                        description: {
                            en: 'Expert detection and repair of concealed pipe leaks with minimal damage.',
                            te: 'కనిష్ట నష్టంతో దాగి ఉన్న పైప్ లీకేజీల నిపుణుల గుర్తింపు మరియు మరమ్మత్తు.',
                            hi: 'न्यूनतम क्षति के साथ छिपे हुए पाइप रिसाव का विशेषज्ञ पता लगाना और मरम्मत करना।'
                        }
                    },
                    { id: 'blockage', name: { en: 'Blockage Removal', te: 'బ్లాకేజ్ తొలగింపు', hi: 'रुकावट हटाना' }, price: '₹800' },
                    { id: 'bathroom-pipe', name: { en: 'Bathroom Pipeline Repair', te: 'బాత్రూమ్ పైప్‌లైన్ రిపేర్', hi: 'बाथरूम पाइपलाइन मरम्मत' }, price: '₹1,200' }
                ]
            }
        ]
    },
    painting: {
        id: 'painting',
        icon: '🎨',
        iconPath: '/assets/icons/painting.png',
        name: { en: 'Painting & Surface Works', te: 'పెయింటింగ్ & సర్ఫేస్ వర్క్స్', hi: 'पेंटिंग और सतह कार्य' },
        color: '#8B5CF6',
        bgColor: '#F3E8FF',
        gradient: 'linear-gradient(135deg, #8B5CF6, #7C3AED)',
        description: {
            en: 'Professional painting services for interior and exterior walls, ceiling painting, and marble & tile installation.',
            te: 'ఇంటీరియర్ మరియు ఎక్స్టీరియర్ వాల్స్, సీలింగ్ పెయింటింగ్ మరియు మార్బుల్ & టైల్ ఇన్‌స్టాలేషన్ కోసం ప్రొఫెషనల్ పెయింటింగ్ సేవలు.',
            hi: 'आंतरिक और बाहरी दीवारों, छत पेंटिंग और संगमरमर और टाइल स्थापना के लिए पेशेवर पेंटिंग सेवाएं।'
        },
        subcategories: [
            {
                id: 'painting-walls',
                name: { en: 'Wall Painting', te: 'గోడ పెయింటింగ్', hi: 'दीवार पेंटिंग' },
                services: [
                    {
                        id: 'interior-paint',
                        name: { en: 'Interior Wall Painting', te: 'ఇంటీరియర్ వాల్ పెయింటింగ్', hi: 'आंतरिक दीवार पेंटिंग' },
                        price: '₹12-18/sq.ft',
                        images: ['/assets/images/services/painting/interior.png'],
                        description: {
                            en: 'Premium interior wall painting with putty, primer, and 2-3 coats of high-quality paint.',
                            te: 'పుట్టి, ప్రైమర్ మరియు 2-3 కోట్ల అధిక నాణ్యత గల పెయింట్‌తో ప్రీమియం ఇంటీరియర్ వాల్ పెయింటింగ్.',
                            hi: 'पुट्टी, प्राइमर और उच्च गुणवत्ता वाले पेंट के 2-3 कोट के साथ प्रीमियम आंतरिक दीवार पेंटिंग।'
                        }
                    },
                    {
                        id: 'exterior-paint',
                        name: { en: 'Exterior Wall Painting', te: 'ఎక్స్టీరియర్ వాల్ పెయింటింగ్', hi: 'बाहरी दीवार पेंटिंग' },
                        price: '₹15-25/sq.ft',
                        images: ['/assets/images/services/painting/interior.png'],
                        description: {
                            en: 'Weather-proof exterior painting to protect your home from rain and sun.',
                            te: 'వర్షం మరియు ఎండ నుండి మీ ఇంటిని రక్షించడానికి వెదర్-ప్రూఫ్ ఎక్స్టీరియర్ పెయింటింగ్.',
                            hi: 'बारिश और धूप से आपके घर की रक्षा के लिए वेदर-प्रूफ बाहरी पेंटिंग।'
                        }
                    },
                    { id: 'ceiling-paint', name: { en: 'Ceiling Painting', te: 'సీలింగ్ పెయింటింగ్', hi: 'छत पेंटिंग' }, price: '₹10-15/sq.ft' },
                    { id: 'texture-paint', name: { en: 'Texture Painting', te: 'టెక్స్చర్ పెయింటింగ్', hi: 'बनावट पेंटिंग' }, price: '₹25-50/sq.ft' }
                ]
            },
            {
                id: 'flooring',
                name: { en: 'Flooring & Tiling', te: 'ఫ్లోరింగ్ & టైలింగ్', hi: 'फर्श और टाइलिंग' },
                services: [
                    { id: 'tile-install', name: { en: 'Tile Installation', te: 'టైల్ ఇన్‌స్టాలేషన్', hi: 'टाइल इंस्टालेशन' }, price: '₹50-100/sq.ft' },
                    { id: 'tile-replace', name: { en: 'Tile Replacement', te: 'టైల్ రీప్లేస్‌మెంట్', hi: 'टाइल प्रतिस्थापन' }, price: '₹350/tile' },
                    { id: 'marble-floor', name: { en: 'Marble Flooring', te: 'మార్బుల్ ఫ్లోరింగ్', hi: 'संगमरमर फर्श' }, price: 'Custom' }
                ]
            }
        ]
    },
    waterPurifier: {
        id: 'waterPurifier',
        icon: '💧',
        name: { en: 'Water Purifier Services', te: 'వాటర్ ప్యూరిఫైయర్ సేవలు', hi: 'वॉटर प्यूरीफायर सेवाएं' },
        color: '#06B6D4',
        bgColor: '#CFFAFE',
        gradient: 'linear-gradient(135deg, #06B6D4, #0891B2)',
        description: {
            en: 'RO installation, relocation, filter cleaning, and membrane replacement services.',
            te: 'RO ఇన్‌స్టాలేషన్, రీలొకేషన్, ఫిల్టర్ క్లీనింగ్ మరియు మెంబ్రేన్ రీప్లేస్‌మెంట్ సేవలు.',
            hi: 'RO इंस्टालेशन, स्थानांतरण, फिल्टर सफाई और मेम्ब्रेन प्रतिस्थापन सेवाएं।'
        },
        subcategories: [
            {
                id: 'ro-repair',
                name: { en: 'Service & Repair', te: 'సేవ & మరమ్మత్తు', hi: 'सेवा और मरम्मत' },
                services: [
                    { id: 'filter-clean', name: { en: 'Filter Cleaning', te: 'ఫిల్టర్ క్లీనింగ్', hi: 'फिल्टर सफाई' }, price: '₹300' },
                    { id: 'filter-replace', name: { en: 'Filter Replacement', te: 'ఫిల్టర్ రీప్లేస్‌మెంట్', hi: 'फिल्टर प्रतिस्थापन' }, price: '₹450' },
                    { id: 'membrane', name: { en: 'Membrane Replacement', te: 'మెంబ్రేన్ రీప్లేస్‌మెంట్', hi: 'मेम्ब्रेन प्रतिस्थापन' }, price: '₹600' }
                ]
            },
            {
                id: 'ro-install',
                name: { en: 'Installation', te: 'ఇన్‌స్టాలేషన్', hi: 'इंस्टालेशन' },
                services: [
                    { id: 'ro-install', name: { en: 'New RO Installation', te: 'కొత్త RO ఇన్‌స్టాలేషన్', hi: 'नया RO इंस्टालेशन' }, price: '₹600' },
                    { id: 'ro-relocate', name: { en: 'RO Relocation', te: 'RO రీలొకేషన్', hi: 'RO स्थानांतरण' }, price: '₹700' }
                ]
            }
        ]
    },
    dismantling: {
        id: 'dismantling',
        icon: '🔨',
        name: { en: 'Home Dismantling Services', te: 'హోమ్ డిస్మాంటిలింగ్ సేవలు', hi: 'घर विघटन सेवाएं' },
        color: '#EF4444',
        bgColor: '#FEE2E2',
        gradient: 'linear-gradient(135deg, #EF4444, #DC2626)',
        description: {
            en: 'Safe and efficient dismantling of kitchen, wardrobes, false ceiling, and old fittings.',
            te: 'కిచెన్, వార్డ్‌రోబ్స్, ఫాల్స్ సీలింగ్ మరియు పాత ఫిట్టింగ్‌ల యొక్క సురక్షితమైన మరియు సమర్థవంతమైన డిస్మాంటిలింగ్.',
            hi: 'रसोई, अलमारी, झूठी छत और पुरानी फिटिंग्स का सुरक्षित और कुशल विघटन।'
        },
        subcategories: [
            {
                id: 'furniture-dismantle',
                name: { en: 'Furniture', te: 'ఫర్నిచర్', hi: 'फर्नीचर' },
                services: [
                    { id: 'kitchen-dismantle', name: { en: 'Kitchen Dismantling', te: 'కిచెన్ డిస్మాంటిలింగ్', hi: 'रसोई विघटन' }, price: '₹3,500' },
                    { id: 'wardrobe-dismantle', name: { en: 'Wardrobe Dismantling', te: 'వార్డ్‌రోబ్ డిస్మాంటిలింగ్', hi: 'अलमारी विघटन' }, price: '₹1,200' }
                ]
            },
            {
                id: 'structure-dismantle',
                name: { en: 'Structural', te: 'నిర్మాణ', hi: 'संरचनात्मक' },
                services: [
                    { id: 'ceiling-dismantle', name: { en: 'False Ceiling Dismantling', te: 'ఫాల్స్ సీలింగ్ డిస్మాంటిలింగ్', hi: 'फाल्स सीलिंग विघटन' }, price: '₹2,000' },
                    { id: 'fittings-remove', name: { en: 'Old Fittings Removal', te: 'పాత ఫిట్టింగ్స్ తొలగింపు', hi: 'पुरानी फिटिंग्स हटाना' }, price: '₹800' }
                ]
            }
        ]
    },
    cleaning: {
        id: 'cleaning',
        icon: '🧹',
        iconPath: '/assets/icons/cleaning.png',
        name: { en: 'Cleaning Services', te: 'క్లీనింగ్ సేవలు', hi: 'सफाई सेवाएं' },
        color: '#10B981',
        bgColor: '#DCFCE7',
        gradient: 'linear-gradient(135deg, #10B981, #059669)',
        description: {
            en: 'Professional kitchen and bathroom cleaning services for a hygienic home.',
            te: 'పరిశుభ్రమైన ఇంటి కోసం ప్రొఫెషనల్ కిచెన్ మరియు బాత్రూమ్ క్లీనింగ్ సేవలు.',
            hi: 'स्वच्छ घर के लिए पेशेवर रसोई और बाथरूम सफाई सेवाएं।'
        },
        subcategories: [
            {
                id: 'home-clean',
                name: { en: 'Home Cleaning', te: 'ఇంటి శుభ్రత', hi: 'घर की सफाई' },
                services: [
                    {
                        id: 'floor-clean',
                        name: { en: 'Floor Cleaning', te: 'ఫ్లోర్ క్లీనింగ్', hi: 'फर्श सफाई' },
                        price: '₹300',
                        images: ['/assets/images/services/painting/interior.png'],
                        description: { en: 'Deep cleaning and mopping of all floor types.', te: 'అన్ని రకాల ఫ్లోర్ల డీప్ క్లీనింగ్.', hi: 'सभी प्रकार के फर्श की गहरी सफाई।' }
                    },
                    {
                        id: 'tile-clean',
                        name: { en: 'Tile Cleaning', te: 'టైల్ క్లీనింగ్', hi: 'टाइल सफाई' },
                        price: '₹400',
                        images: ['/assets/images/services/painting/interior.png'],
                        description: { en: 'Scrubbing and stain removal for tiles.', te: 'టైల్స్ కోసం మరకలు తొలగించడం.', hi: 'टाइल्स के लिए दाग हटाना।' }
                    },
                    {
                        id: 'cabinet-clean',
                        name: { en: 'Cabinet Cleaning', te: 'క్యాబినెట్ క్లీనింగ్', hi: 'कैबिनेट सफाई' },
                        price: '₹450',
                        images: ['/assets/images/services/painting/interior.png'],
                        description: { en: 'Cleaning and dusting of cupboards and shelves.', te: 'అల్మారాలు మరియు షెల్ఫుల క్లీనింగ్.', hi: 'अलमारियों और अलमारियों की सफाई।' }
                    }
                ]
            },
            {
                id: 'kitchen-bath',
                name: { en: 'Kitchen & Bath', te: 'వంటగది & స్నానాల గది', hi: 'रसोई और स्नानघर' },
                services: [
                    { id: 'stove-clean', name: { en: 'Stove & Chimney Cleaning', te: 'స్టవ్ & చిమ్నీ క్లీనింగ్', hi: 'स्टोव और चिमनी सफाई' }, price: '₹600' },
                    { id: 'toilet-clean', name: { en: 'Toilet Cleaning', te: 'టాయిలెట్ క్లీనింగ్', hi: 'शौचालय सफाई' }, price: '₹300' },
                    { id: 'basin-clean', name: { en: 'Basin Cleaning', te: 'బేసిన్ క్లీనింగ్', hi: 'बेसिन सफाई' }, price: '₹200' }
                ]
            }
        ]
    },
    gardening: {
        id: 'gardening',
        icon: '🌿',
        iconPath: '/assets/icons/gardening.png',
        name: { en: 'Gardening & Plantation', te: 'గార్డెనింగ్ & ప్లాంటేషన్', hi: 'बागवानी और रोपण' },
        color: '#22C55E',
        bgColor: '#D1FAE5',
        gradient: 'linear-gradient(135deg, #22C55E, #16A34A)',
        description: {
            en: 'Complete gardening solutions including planting, lawn maintenance, and garden cleaning.',
            te: 'ప్లాంటింగ్, లాన్ మెయింటెనెన్స్ మరియు గార్డెన్ క్లీనింగ్‌తో సహా పూర్తి గార్డెనింగ్ సొల్యూషన్స్.',
            hi: 'रोपण, लॉन रखरखाव और बगीचे की सफाई सहित पूर्ण बागवानी समाधान।'
        },
        subcategories: [
            {
                id: 'garden-maintain',
                name: { en: 'Maintenance', te: 'నిర్వహణ', hi: 'रखरखाव' },
                services: [
                    { id: 'lawn-maintain', name: { en: 'Lawn Maintenance', te: 'లాన్ మెయింటెనెన్స్', hi: 'लॉन रखरखाव' }, price: '₹800' },
                    { id: 'garden-clean', name: { en: 'Garden Cleaning', te: 'గార్డెన్ క్లీనింగ్', hi: 'बगीचे की सफाई' }, price: '₹450' }
                ]
            },
            {
                id: 'planting',
                name: { en: 'New Works', te: 'కొత్త పనులు', hi: 'नए कार्य' },
                services: [
                    { id: 'plant-new', name: { en: 'Planting New Plants', te: 'కొత్త మొక్కలను నాటడం', hi: 'नए पौधे लगाना' }, price: '₹500' },
                    { id: 'garden-waterline', name: { en: 'Garden Water Line Installation', te: 'గార్డెన్ వాటర్ లైన్ ఇన్‌స్టాలేషన్', hi: 'बगीचे की वॉटर लाइन इंस्टालेशन' }, price: '₹1,800' }
                ]
            }
        ]
    },
    gas: {
        id: 'gas',
        icon: '🔥',
        iconPath: '/assets/icons/gas.png',
        name: { en: 'Stove & Gas Services', te: 'స్టవ్ & గ్యాస్ సేవలు', hi: 'स्टोव और गैस सेवाएं' },
        color: '#F59E0B',
        bgColor: '#FEF3C7',
        gradient: 'linear-gradient(135deg, #F59E0B, #D97706)',
        description: {
            en: 'Gas stove installation, pipeline installation, leak detection, and regulator replacement.',
            te: 'గ్యాస్ స్టవ్ ఇన్‌స్టాలేషన్, పైప్‌లైన్ ఇన్‌స్టాలేషన్, లీక్ డిటెక్షన్ మరియు రెగ్యులేటర్ రీప్లేస్‌మెంట్.',
            hi: 'गैस स्टोव इंस्टालेशन, पाइपलाइन इंस्टालेशन, रिसाव का पता लगाना और नियामक प्रतिस्थापन।'
        },
        subcategories: [
            {
                id: 'stove-gas',
                name: { en: 'Stove & Gas', te: 'స్టవ్ & గ్యాస్', hi: 'स्टोव और गैस' },
                services: [
                    { id: 'stove-install', name: { en: 'Stove Installation', te: 'స్టవ్ ఇన్‌స్టాలేషన్', hi: 'स्टोव इंस्टालेशन' }, price: '₹300' },
                    { id: 'gas-pipeline', name: { en: 'Gas Pipeline Installation', te: 'గ్యాస్ పైప్‌లైన్ ఇన్‌స్టాలేషన్', hi: 'गैस पाइपलाइन इंस्टालेशन' }, price: '₹1,200' },
                    { id: 'leak-detect', name: { en: 'Leakage Detection', te: 'లీకేజ్ డిటెక్షన్', hi: 'रिसाव का पता लगाना' }, price: '₹350' },
                    { id: 'gas-regulator', name: { en: 'Regulator Replacement', te: 'రెగ్యులేటర్ రీప్లేస్‌మెంట్', hi: 'नियामक प्रतिस्थापन' }, price: '₹200' }
                ]
            }
        ]
    }
};

// Get all categories as array
export const getAllCategories = () => Object.values(servicesData);

// Get category by ID
export const getCategoryById = (id) => servicesData[id];

// Get service by ID (FLATTENED LOOKUP)
export const getServiceById = (serviceId) => {
    // Iterate through all categories
    for (const catKey in servicesData) {
        const category = servicesData[catKey];
        if (category.subcategories) {
            for (const subcat of category.subcategories) {
                const service = subcat.services.find(s => s.id === serviceId);
                if (service) {
                    return { ...service, categoryId: category.id, subcategoryId: subcat.id };
                }
            }
        }
    }
    return null;
};

// Get total service count
export const getTotalServiceCount = () => {
    return getAllCategories().reduce((total, category) => {
        const categoryServices = category.subcategories?.reduce((subTotal, sub) => subTotal + sub.services.length, 0) || 0;
        return total + categoryServices;
    }, 0);
};

// Helper: Flatten all services for search/filtering
export const getAllServicesFlat = () => {
    let allServices = [];
    getAllCategories().forEach(cat => {
        if (cat.subcategories) {
            cat.subcategories.forEach(sub => {
                sub.services.forEach(svc => {
                    allServices.push({
                        ...svc,
                        categoryId: cat.id,
                        subcategoryId: sub.id,
                        categoryName: cat.name,
                        subcategoryName: sub.name
                    });
                });
            });
        }
    });
    return allServices;
};
