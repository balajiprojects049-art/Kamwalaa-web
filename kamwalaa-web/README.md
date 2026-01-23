# 🏠 Kamwalaa - Professional Home Services Platform

![Kamwalaa](./public/logo.png)

## 📋 Overview

**Kamwalaa** is a comprehensive home services booking platform that connects customers with verified professional service providers. The platform offers 54+ services across 8 major categories including electrical, plumbing, painting, cleaning, water purifier maintenance, home dismantling, gardening, and gas services.

### ✨ Key Features

- **🌐 Multi-language Support**: English, Hindi, and Telugu
- **📱 Responsive Design**: Mobile-first, works seamlessly on all devices
- **🔐 User Authentication**: Secure login and signup system
- **📅 Easy Booking**: Simple 3-step booking process (Address → Schedule → Payment)
- **💰 Transparent Pricing**: All service prices listed upfront
- **✅ Verified Professionals**: All service providers are verified
- **⚡ Same-Day Service**: Quick service availability
- **🎨 Modern UI/UX**: Clean, intuitive interface with smooth animations

## 🛠️ Tech Stack

### Frontend
- **React 19.2.0** - UI library
- **React Router DOM 7.12.0** - Navigation and routing
- **Framer Motion 12.28.1** - Animations
- **React Hook Form 7.71.1** - Form management
- **React Icons 5.5.0** - Icon library
- **Zustand 5.0.10** - State management
- **Axios 1.13.2** - HTTP client

### Build Tools
- **Vite 7.2.4** - Fast build tool and dev server
- **ESLint** - Code linting

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/kamwalaa-web.git
   cd kamwalaa-web
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open browser**
   Navigate to `http://localhost:5173`

## 📁 Project Structure

```
kamwalaa-web/
├── public/
│   ├── logo.png              # Company logo
│   └── vite.svg
├── src/
│   ├── assets/               # Static assets
│   ├── components/
│   │   ├── common/          # Reusable components
│   │   │   ├── Hero.jsx
│   │   │   ├── ServicesSection.jsx
│   │   │   ├── WhyChooseUs.jsx
│   │   │   ├── HowItWorks.jsx
│   │   │   └── Testimonials.jsx
│   │   └── layout/          # Layout components
│   │       ├── Header.jsx
│   │       └── Footer.jsx
│   ├── context/
│   │   └── LanguageContext.jsx   # Multi-language context
│   ├── data/
│   │   └── servicesData.js       # All services data
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Services.jsx
│   │   ├── ServiceDetail.jsx
│   │   ├── About.jsx
│   │   ├── Contact.jsx
│   │   ├── Login.jsx
│   │   ├── SignUp.jsx
│   │   ├── Booking.jsx
│   │   └── BookingSuccess.jsx
│   ├── App.jsx              # Main app component
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
├── index.html
├── package.json
└── vite.config.js
```

## 🎯 Available Services

### Service Categories (54 total services)

1. **⚡ Electrical Services** (13 services)
   - Fan Installation/Replacement/Repair
   - House Wiring & Partial Wiring
   - Light Installation & Switch Replacement
   - Festival & Ceiling Lighting

2. **💧 Plumbing Services** (11 services)
   - Sink & Tap Services
   - Water Tank Cleaning
   - Pipe Leakage & Blockage Removal

3. **🎨 Painting & Surface Works** (7 services)
   - Interior/Exterior Wall Painting
   - Ceiling & Texture Painting
   - Tile & Marble Installation

4. **💧 Water Purifier Services** (5 services)
   - RO Installation & Relocation
   - Filter Cleaning & Replacement
   - Membrane Replacement

5. **🔨 Home Dismantling Services** (4 services)
   - Kitchen & Wardrobe Dismantling
   - False Ceiling Removal

6. **🧹 Cleaning Services** (6 services)
   - Kitchen & Bathroom Cleaning
   - Floor & Tile Cleaning

7. **🌿 Gardening Services** (4 services)
   - Plant Installation
   - Lawn Maintenance
   - Garden Cleaning

8. **🔥 Gas & Stove Services** (4 services)
   - Stove Installation
   - Gas Pipeline Installation
   - Leak Detection

## 🚀 Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 🎨 Design System

### Color Palette
- **Primary**: `#004976` (Deep Blue)
- **Secondary**: `#FF9800` (Orange)
- **Success**: `#10B981` (Green)
- **Background**: `#f8f9fa` (Light Gray)

### Typography
- Font Family: System fonts with fallback
- Heading Font Weight: 700
- Body Font Weight: 400

## 🌍 Multi-Language Support

The application supports three languages:
- 🇬🇧 English (en)
- 🇮🇳 Hindi (hi)
- 🇮🇳 Telugu (te)

Language can be switched using the language selector in the header.

## 📱 Responsive Breakpoints

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🔐 Authentication

The platform includes:
- User Login
- User Registration
- Password Recovery (Coming Soon)
- OAuth Integration (Coming Soon)

## 📋 Booking Flow

1. **Browse Services**: Explore 54+ services across 8 categories
2. **Select Services**: Choose multiple services from a category
3. **Enter Address**: Provide service location details
4. **Schedule**: Select preferred date and time slot
5. **Payment**: Choose payment method (Cash/Online)
6. **Confirmation**: Receive booking confirmation with ID

## 🚧 Upcoming Features

- [ ] User Dashboard
- [ ] Order Tracking
- [ ] Online Payment Integration (Razorpay/Stripe)
- [ ] Service Provider App
- [ ] Admin Panel
- [ ] Rating & Review System
- [ ] Push Notifications
- [ ] Real-time Chat Support
- [ ] Referral Program
- [ ] Subscription Plans

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
VITE_API_URL=your_api_url_here
VITE_PAYMENT_KEY=your_payment_gateway_key
```

## 📊 SEO Optimization

The application includes:
- Comprehensive meta tags
- Open Graph tags for social media
- Twitter Card tags
- Schema.org structured data
- Sitemap (Coming Soon)
- robots.txt (Coming Soon)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is proprietary software. All rights reserved © 2026 Kamwalaa.

## 📞 Contact & Support

- **Email**: support@kamwalaa.com
- **Phone**: +91 98765 43210
- **Website**: https://kamwalaa.com

## 🙏 Acknowledgments

- Icons by [React Icons](https://react-icons.github.io/react-icons/)
- Animations by [Framer Motion](https://www.framer.com/motion/)
- Built with [Vite](https://vitejs.dev/)
- Powered by [React](https://react.dev/)

---

**Made with ❤️ by the Kamwalaa Team**
