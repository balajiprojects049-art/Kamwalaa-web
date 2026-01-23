// Multi-language support: Telugu, English, Hindi
export const translations = {
  te: {
    // Telugu translations
    nav: {
      home: 'హోమ్',
      services: 'సేవలు',
      about: 'మా గురించి',
      contact: 'సంప్రదించండి',
      login: 'లాగిన్',
      signup: 'సైన్ అప్'
    },
    hero: {
      title: 'మీ ఇంటి కోసం నమ్మకమైన సేవలు',
      subtitle: 'ప్రొఫెషనల్ హోమ్ సర్వీస్‌లను సులభంగా బుక్ చేసుకోండి',
      cta: 'సేవలను అన్వేషించండి',
      bookNow: 'ఇప్పుడే బుక్ చేయండి'
    },
    services: {
      title: 'మా సేవలు',
      subtitle: '8 వర్గాలలో 54+ సేవలు',
      viewAll: 'అన్నీ చూడండి',
      bookService: 'సేవను బుక్ చేయండి',
      categories: {
        electrical: 'విద్యుత్ సేవలు',
        plumbing: 'ప్లంబింగ్ సేవలు',
        painting: 'పెయింటింగ్ & సర్ఫేస్',
        waterPurifier: 'వాటర్ ప్యూరిఫైయర్',
        dismantling: 'డిస్మాంటిలింగ్',
        cleaning: 'క్లీనింగ్ సేవలు',
        gardening: 'గార్డెనింగ్',
        gas: 'గ్యాస్ సేవలు'
      }
    },
    footer: {
      about: 'మా గురించి',
      quickLinks: 'త్వరిత లింక్‌లు',
      contact: 'సంప్రదించండి',
      rights: 'అన్ని హక్కులు రక్షించబడ్డాయి'
    }
  },
  en: {
    // English translations
    nav: {
      home: 'Home',
      services: 'Services',
      about: 'About Us',
      contact: 'Contact',
      login: 'Login',
      signup: 'Sign Up'
    },
    hero: {
      title: 'Trusted Home Services at Your Doorstep',
      subtitle: 'Book professional home services with ease and transparency',
      cta: 'Explore Services',
      bookNow: 'Book Now'
    },
    services: {
      title: 'Our Services',
      subtitle: '54+ Services across 8 categories',
      viewAll: 'View All',
      bookService: 'Book Service',
      categories: {
        electrical: 'Electrical Services',
        plumbing: 'Plumbing Services',
        painting: 'Painting & Surface',
        waterPurifier: 'Water Purifier',
        dismantling: 'Dismantling',
        cleaning: 'Cleaning Services',
        gardening: 'Gardening',
        gas: 'Gas Services'
      }
    },
    footer: {
      about: 'About Us',
      quickLinks: 'Quick Links',
      contact: 'Contact Us',
      rights: 'All rights reserved'
    }
  },
  hi: {
    // Hindi translations
    nav: {
      home: 'होम',
      services: 'सेवाएं',
      about: 'हमारे बारे में',
      contact: 'संपर्क करें',
      login: 'लॉगिन',
      signup: 'साइन अप'
    },
    hero: {
      title: 'आपके दरवाजे पर विश्वसनीय गृह सेवाएं',
      subtitle: 'आसानी से पेशेवर घर सेवाओं को बुक करें',
      cta: 'सेवाओं का अन्वेषण करें',
      bookNow: 'अभी बुक करें'
    },
    services: {
      title: 'हमारी सेवाएं',
      subtitle: '8 श्रेणियों में 54+ सेवाएं',
      viewAll: 'सभी देखें',
      bookService: 'सेवा बुक करें',
      categories: {
        electrical: 'बिजली सेवाएं',
        plumbing: 'प्लंबिंग सेवाएं',
        painting: 'पेंटिंग और सरफेस',
        waterPurifier: 'वॉटर प्यूरीफायर',
        dismantling: 'डिस्मेंटलिंग',
        cleaning: 'सफाई सेवाएं',
        gardening: 'बागवानी',
        gas: 'गैस सेवाएं'
      }
    },
    footer: {
      about: 'हमारे बारे में',
      quickLinks: 'त्वरित लिंक',
      contact: 'संपर्क करें',
      rights: 'सर्वाधिकार सुरक्षित'
    }
  }
};

// Service descriptions in 3 languages
export const serviceDetails = {
  electrical: {
    en: {
      title: 'Electrical Services',
      description: 'Professional electrical solutions for your home including fan services, house wiring, light installation, and decorative lighting.',
      services: [
        'Fan Installation & Repair',
        'House Wiring',
        'Light & Switch Installation',
        'Decorative Lighting'
      ]
    },
    te: {
      title: 'విద్యుత్ సేవలు',
      description: 'ఫ్యాన్ సేవలు, హౌస్ వైరింగ్, లైట్ ఇన్‌స్టాలేషన్ మరియు డెకరేటివ్ లైటింగ్‌తో సహా మీ ఇంటి కోసం ప్రొఫెషనల్ ఎలక్ట్రికల్ సొల్యూషన్స్.',
      services: [
        'ఫ్యాన్ ఇన్‌స్టాలేషన్ & రిపేర్',
        'హౌస్ వైరింగ్',
        'లైట్ & స్విచ్ ఇన్‌స్టాలేషన్',
        'డెకరేటివ్ లైటింగ్'
      ]
    },
    hi: {
      title: 'बिजली सेवाएं',
      description: 'आपके घर के लिए पेशेवर बिजली समाधान जिसमें पंखा सेवाएं, घर की वायरिंग, लाइट इंस्टालेशन और सजावटी लाइटिंग शामिल है।',
      services: [
        'पंखा इंस्टालेशन और मरम्मत',
        'घर की वायरिंग',
        'लाइट और स्विच इंस्टालेशन',
        'सजावटी लाइटिंग'
      ]
    }
  },
  plumbing: {
    en: {
      title: 'Plumbing Services',
      description: 'Complete plumbing solutions including sink & tap services, water tank cleaning, and pipe repairs.',
      services: [
        'Sink & Tap Services',
        'Water Tank Cleaning',
        'Pipe & Water Line Services',
        'Bathroom Pipeline Repair'
      ]
    },
    te: {
      title: 'ప్లంబింగ్ సేవలు',
      description: 'సింక్ & ట్యాప్ సేవలు, వాటర్ ట్యాంక్ క్లీనింగ్ మరియు పైప్ మరమ్మతులతో సహా పూర్తి ప్లంబింగ్ సొల్యూషన్స్.',
      services: [
        'సింక్ & ట్యాప్ సేవలు',
        'వాటర్ ట్యాంక్ క్లీనింగ్',
        'పైప్ & వాటర్ లైన్ సేవలు',
        'బాత్రూమ్ పైప్‌లైన్ రిపేర్'
      ]
    },
    hi: {
      title: 'प्लंबिंग सेवाएं',
      description: 'सिंक और नल सेवाएं, पानी की टंकी की सफाई और पाइप मरम्मत सहित पूर्ण प्लंबिंग समाधान।',
      services: [
        'सिंक और नल सेवाएं',
        'पानी की टंकी की सफाई',
        'पाइप और वॉटर लाइन सेवाएं',
        'बाथरूम पाइपलाइन मरम्मत'
      ]
    }
  },
  painting: {
    en: {
      title: 'Painting & Surface Works',
      description: 'Professional painting services for interior and exterior walls, ceiling painting, and marble & tile installation.',
      services: [
        'Interior Wall Painting',
        'Exterior Wall Painting',
        'Texture Painting',
        'Tile & Marble Installation'
      ]
    },
    te: {
      title: 'పెయింటింగ్ & సర్ఫేస్ వర్క్స్',
      description: 'ఇంటీరియర్ మరియు ఎక్స్టీరియర్ వాల్స్, సీలింగ్ పెయింటింగ్ మరియు మార్బుల్ & టైల్ ఇన్‌స్టాలేషన్ కోసం ప్రొఫెషనల్ పెయింటింగ్ సేవలు.',
      services: [
        'ఇంటీరియర్ వాల్ పెయింటింగ్',
        'ఎక్స్టీరియర్ వాల్ పెయింటింగ్',
        'టెక్స్చర్ పెయింటింగ్',
        'టైల్ & మార్బుల్ ఇన్‌స్టాలేషన్'
      ]
    },
    hi: {
      title: 'पेंटिंग और सतह कार्य',
      description: 'आंतरिक और बाहरी दीवारों, छत पेंटिंग और संगमरमर और टाइल स्थापना के लिए पेशेवर पेंटिंग सेवाएं।',
      services: [
        'आंतरिक दीवार पेंटिंग',
        'बाहरी दीवार पेंटिंग',
        'बनावट पेंटिंग',
        'टाइल और संगमरमर स्थापना'
      ]
    }
  },
  waterPurifier: {
    en: {
      title: 'Water Purifier Services',
      description: 'RO installation, relocation, filter cleaning, and membrane replacement services.',
      services: [
        'New RO Installation',
        'RO Relocation',
        'Filter Cleaning & Replacement',
        'Membrane Replacement'
      ]
    },
    te: {
      title: 'వాటర్ ప్యూరిఫైయర్ సేవలు',
      description: 'RO ఇన్‌స్టాలేషన్, రీలొకేషన్, ఫిల్టర్ క్లీనింగ్ మరియు మెంబ్రేన్ రీప్లేస్‌మెంట్ సేవలు.',
      services: [
        'కొత్త RO ఇన్‌స్టాలేషన్',
        'RO రీలొకేషన్',
        'ఫిల్టర్ క్లీనింగ్ & రీప్లేస్‌మెంట్',
        'మెంబ్రేన్ రీప్లేస్‌మెంట్'
      ]
    },
    hi: {
      title: 'वॉटर प्यूरीफायर सेवाएं',
      description: 'RO इंस्टालेशन, स्थानांतरण, फिल्टर सफाई और मेम्ब्रेन प्रतिस्थापन सेवाएं।',
      services: [
        'नया RO इंस्टालेशन',
        'RO स्थानांतरण',
        'फिल्टर सफाई और प्रतिस्थापन',
        'मेम्ब्रेन प्रतिस्थापन'
      ]
    }
  },
  dismantling: {
    en: {
      title: 'Home Dismantling Services',
      description: 'Safe and efficient dismantling of kitchen, wardrobes, false ceiling, and old fittings.',
      services: [
        'Kitchen Dismantling',
        'Wardrobe Dismantling',
        'False Ceiling Dismantling',
        'Old Fittings Removal'
      ]
    },
    te: {
      title: 'హోమ్ డిస్మాంటిలింగ్ సేవలు',
      description: 'కిచెన్, వార్డ్‌రోబ్స్, ఫాల్స్ సీలింగ్ మరియు పాత ఫిట్టింగ్‌ల యొక్క సురక్షితమైన మరియు సమర్థవంతమైన డిస్మాంటిలింగ్.',
      services: [
        'కిచెన్ డిస్మాంటిలింగ్',
        'వార్డ్‌రోబ్ డిస్మాంటిలింగ్',
        'ఫాల్స్ సీలింగ్ డిస్మాంటిలింగ్',
        'పాత ఫిట్టింగ్స్ తొలగింపు'
      ]
    },
    hi: {
      title: 'घर विघटन सेवाएं',
      description: 'रसोई, अलमारी, झूठी छत और पुरानी फिटिंग्स का सुरक्षित और कुशल विघटन।',
      services: [
        'रसोई विघटन',
        'अलमारी विघटन',
        'झूठी छत विघटन',
        'पुरानी फिटिंग्स हटाना'
      ]
    }
  },
  cleaning: {
    en: {
      title: 'Cleaning Services',
      description: 'Professional kitchen and bathroom cleaning services for a hygienic home.',
      services: [
        'Stove & Chimney Cleaning',
        'Cabinet Cleaning',
        'Tile Cleaning',
        'Toilet & Basin Cleaning'
      ]
    },
    te: {
      title: 'క్లీనింగ్ సేవలు',
      description: 'పరిశుభ్రమైన ఇంటి కోసం ప్రొఫెషనల్ కిచెన్ మరియు బాత్రూమ్ క్లీనింగ్ సేవలు.',
      services: [
        'స్టవ్ & చిమ్నీ క్లీనింగ్',
        'క్యాబినెట్ క్లీనింగ్',
        'టైల్ క్లీనింగ్',
        'టాయిలెట్ & బేసిన్ క్లీనింగ్'
      ]
    },
    hi: {
      title: 'सफाई सेवाएं',
      description: 'स्वच्छ घर के लिए पेशेवर रसोई और बाथरूम सफाई सेवाएं।',
      services: [
        'स्टोव और चिमनी सफाई',
        'कैबिनेट सफाई',
        'टाइल सफाई',
        'शौचालय और बेसिन सफाई'
      ]
    }
  },
  gardening: {
    en: {
      title: 'Gardening & Plantation Services',
      description: 'Complete gardening solutions including planting, lawn maintenance, and garden cleaning.',
      services: [
        'Planting New Plants',
        'Lawn Maintenance',
        'Garden Cleaning',
        'Water Line Installation'
      ]
    },
    te: {
      title: 'గార్డెనింగ్ & ప్లాంటేషన్ సేవలు',
      description: 'ప్లాంటింగ్, లాన్ మెయింటెనెన్స్ మరియు గార్డెన్ క్లీనింగ్‌తో సహా పూర్తి గార్డెనింగ్ సొల్యూషన్స్.',
      services: [
        'కొత్త మొక్కలను నాటడం',
        'లాన్ మెయింటెనెన్స్',
        'గార్డెన్ క్లీనింగ్',
        'వాటర్ లైన్ ఇన్‌స్టాలేషన్'
      ]
    },
    hi: {
      title: 'बागवानी और रोपण सेवाएं',
      description: 'रोपण, लॉन रखरखाव और बगीचे की सफाई सहित पूर्ण बागवानी समाधान।',
      services: [
        'नए पौधे लगाना',
        'लॉन रखरखाव',
        'बगीचे की सफाई',
        'वॉटर लाइन इंस्टालेशन'
      ]
    }
  },
  gas: {
    en: {
      title: 'Stove & Gas Services',
      description: 'Gas stove installation, pipeline installation, leak detection, and regulator replacement.',
      services: [
        'Stove Installation',
        'Gas Pipeline Installation',
        'Leakage Detection',
        'Regulator Replacement'
      ]
    },
    te: {
      title: 'స్టవ్ & గ్యాస్ సేవలు',
      description: 'గ్యాస్ స్టవ్ ఇన్‌స్టాలేషన్, పైప్‌లైన్ ఇన్‌స్టాలేషన్, లీక్ డిటెక్షన్ మరియు రెగ్యులేటర్ రీప్లేస్‌మెంట్.',
      services: [
        'స్టవ్ ఇన్‌స్టాలేషన్',
        'గ్యాస్ పైప్‌లైన్ ఇన్‌స్టాలేషన్',
        'లీకేజ్ డిటెక్షన్',
        'రెగ్యులేటర్ రీప్లేస్‌మెంట్'
      ]
    },
    hi: {
      title: 'स्टोव और गैस सेवाएं',
      description: 'गैस स्टोव इंस्टालेशन, पाइपलाइन इंस्टालेशन, रिसाव का पता लगाना और नियामक प्रतिस्थापन।',
      services: [
        'स्टोव इंस्टालेशन',
        'गैस पाइपलाइन इंस्टालेशन',
        'रिसाव का पता लगाना',
        'नियामक प्रतिस्थापन'
      ]
    }
  }
};
