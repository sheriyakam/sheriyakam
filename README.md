# Sheriyakam - Professional Service Booking Platform

## 📱 Project Overview

Sheriyakam is a modern, professional service booking platform built with React Native and Expo. It connects customers with verified service professionals for electrical, AC, CCTV, and other home services.

---

## ✨ Key Features

### Customer Features
- 🔐 **Secure Authentication**
  - Email/Phone login
  - Google Sign-In via Firebase
  - Password recovery
  - Session management

- 📅 **Smart Booking System**
  - Real-time service availability
  - Flexible scheduling (Today/Tomorrow/Custom date)
  - Time slot selection (Morning/Afternoon/Evening)
  - Photo upload for service requests
  - Login verification before booking

- 📊 **Booking Management**
  - View all bookings (Upcoming/Completed/Cancelled)
  - Pull-to-refresh functionality
  - Real-time status updates
  - Payment tracking
  - OTP verification for service completion

- 💳 **Payment Integration**
  - Dynamic pricing (base + hourly rates)
  - Cash and online payment options
  - Payment status tracking
  - Invoice generation

### Partner Features
- 👨‍💼 **Partner Dashboard**
  - View new job requests
  - Accept/manage bookings
  - Job navigation with maps
  - Earnings tracking
  - Profile management

- 📍 **Location Services**
  - Real-time GPS tracking
  - Distance calculation
  - Service area management
  - Map integration

### UI/UX Features
- 🎨 **Modern Design**
  - Clean, professional interface
  - Smooth animations
  - Dark/Light theme support
  - Responsive layout (Mobile/Tablet/Desktop)
  - Glassmorphism effects

- ⚡ **Performance**
  - Optimized rendering
  - Lazy loading
  - Efficient state management
  - Fast page transitions

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React Native (Expo)
- **Routing**: Expo Router
- **UI Components**: Custom components with React Native
- **Icons**: Lucide React Native
- **Maps**: React Native Maps
- **Image Handling**: Expo Image Picker
- **Animations**: React Native Reanimated

### Backend & Services
- **Authentication**: Firebase Authentication
- **Database**: AsyncStorage (local), Firebase (cloud-ready)
- **State Management**: React Context API
- **Storage**: Expo Secure Store

### Development Tools
- **Version Control**: Git & GitHub
- **Package Manager**: npm
- **Build Tool**: Expo CLI
- **Deployment**: Vercel (recommended) / Netlify

---

## 📁 Project Structure

```
sheriyakam/
├── app/                          # Main application screens
│   ├── index.js                  # Home screen
│   ├── bookings.js              # Customer bookings
│   ├── about.js                 # About page
│   ├── auth/
│   │   └── login.js             # Authentication screen
│   └── partner/                 # Partner-specific screens
│       ├── index.js             # Partner dashboard
│       ├── auth.js              # Partner authentication
│       ├── profile.js           # Partner profile
│       ├── messages.js          # Partner messages
│       ├── chat.js              # Partner chat
│       └── job/
│           └── [id].js          # Job details
├── components/                   # Reusable components
│   ├── BookingModal.js          # Booking creation modal
│   ├── PaymentModal.js          # Payment processing modal
│   ├── ServiceCard.js           # Service display card
│   ├── MenuModal.js             # Navigation menu
│   ├── LocationModal.js         # Location selector
│   └── JobMap.js                # Map components
├── constants/                    # App constants
│   ├── theme.js                 # Theme configuration
│   ├── bookingStore.js          # Booking data management
│   └── partnerStore.js          # Partner data management
├── context/                      # React Context providers
│   ├── AuthContext.js           # Authentication context
│   └── ThemeContext.js          # Theme context
├── config/                       # Configuration files
│   └── firebaseConfig.js        # Firebase setup
├── assets/                       # Static assets
│   ├── images/                  # Service images
│   └── icon.png                 # App icon
└── public/                       # Public files for web
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/sheriyakam/sheriyakam.git
cd sheriyakam
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure Firebase**
- Create a Firebase project at https://console.firebase.google.com/
- Enable Google Authentication
- Copy your Firebase config to `config/firebaseConfig.js`
- See `FIREBASE_SETUP.md` for detailed instructions

4. **Run the development server**
```bash
npm start
```

5. **Run on specific platform**
```bash
npm run web      # Web browser
npm run android  # Android emulator
npm run ios      # iOS simulator
```

---

## 🌐 Deployment

### Recommended: Vercel (Unlimited Bandwidth)

1. **Via Vercel Website**
   - Go to https://vercel.com/
   - Sign in with GitHub
   - Import `sheriyakam` repository
   - Deploy!

2. **Via Command Line**
```bash
npx vercel --prod
```

See `DEPLOY_TO_VERCEL_GUIDE.md` for detailed instructions.

### Alternative: Cloudflare Pages, GitHub Pages, Render

See `FREE_HOSTING_OPTIONS.md` for all deployment options.

---

## 🔐 Security Features

- ✅ Firebase Authentication integration
- ✅ Secure token management
- ✅ Input validation (email, phone)
- ✅ XSS protection
- ✅ HTTPS enforcement
- ✅ Environment variable support
- ✅ Login verification for bookings

---

## 📱 Supported Platforms

- ✅ Web (Chrome, Firefox, Safari, Edge)
- ✅ Android (via Expo Go or APK)
- ✅ iOS (via Expo Go or App Store)
- ✅ Responsive design (Mobile, Tablet, Desktop)

---

## 🎨 Design System

### Colors
- Primary: `#2563EB` (Blue)
- Secondary: `#001F3F` (Navy)
- Accent: `#FFD700` (Gold)
- Success: `#10B981` (Green)
- Danger: `#EF4444` (Red)

### Typography
- Headings: Bold, 18-28px
- Body: Regular, 14-16px
- Captions: Regular, 12px

### Spacing
- XS: 4px
- SM: 8px
- MD: 16px
- LG: 24px
- XL: 32px

---

## 📊 Data Management

### Local Storage (AsyncStorage)
- User preferences
- Booking data
- Authentication tokens
- Theme settings

### Cloud Storage (Firebase - Ready)
- User profiles
- Service history
- Partner information
- Real-time updates

---

## 🔄 Continuous Deployment

### Auto-Deploy from GitHub
Every push to `master` branch automatically:
1. Triggers build on Vercel
2. Runs `npx expo export -p web`
3. Deploys to production
4. Updates live site in 2-3 minutes

```bash
git add .
git commit -m "your changes"
git push origin master
# Site auto-updates!
```

---

## 📈 Performance Optimizations

- ✅ Code splitting
- ✅ Lazy loading
- ✅ Image optimization
- ✅ Efficient re-renders
- ✅ Memoization
- ✅ Virtual scrolling
- ✅ CDN delivery

---

## 🧪 Testing

### Manual Testing Checklist
- [ ] User registration/login
- [ ] Google Sign-In
- [ ] Service booking flow
- [ ] Payment processing
- [ ] Partner dashboard
- [ ] Map navigation
- [ ] Responsive design
- [ ] Cross-browser compatibility

---

## 📚 Documentation

- `README.md` - This file
- `FIREBASE_SETUP.md` - Firebase configuration guide
- `DEPLOY_TO_VERCEL_GUIDE.md` - Deployment instructions
- `FREE_HOSTING_OPTIONS.md` - Hosting alternatives
- `AUTO_DEPLOY_WORKFLOW.md` - CI/CD workflow
- `GOOGLE_SIGNIN_FIX.md` - Authentication setup

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is proprietary and confidential.

---

## 👥 Team

- **Development**: Sheriyakam Development Team
- **Design**: UI/UX Team
- **Support**: support@sheriyakam.com

---

## 🆘 Support

For issues and questions:
- 📧 Email: support@sheriyakam.com
- 📱 Phone: +91 XXXXX XXXXX
- 🌐 Website: https://sheriyakam.vercel.app

---

## 🗺️ Roadmap

### Completed ✅
- [x] User authentication (Email, Phone, Google)
- [x] Service booking system
- [x] Partner dashboard
- [x] Payment integration
- [x] Map integration
- [x] Responsive design
- [x] Dark/Light theme
- [x] Pull-to-refresh
- [x] Input validation
- [x] Login verification for bookings

### In Progress 🚧
- [ ] Backend API integration
- [ ] Real-time notifications
- [ ] In-app chat
- [ ] Ratings & reviews
- [ ] Advanced analytics

### Planned 📋
- [ ] Multi-language support
- [ ] Push notifications
- [ ] Referral system
- [ ] Loyalty program
- [ ] Advanced search & filters
- [ ] Service packages
- [ ] Subscription plans

---

## 📊 Project Stats

- **Lines of Code**: ~15,000+
- **Components**: 20+
- **Screens**: 15+
- **Services**: 8 categories
- **Supported Languages**: English (more coming)

---

## 🎯 Key Achievements

✅ **Professional UI/UX** - Modern, clean design  
✅ **Secure Authentication** - Firebase integration  
✅ **Smart Booking** - Intelligent scheduling  
✅ **Real-time Updates** - Live data synchronization  
✅ **Cross-platform** - Web, iOS, Android  
✅ **Production Ready** - Deployed and scalable  

---

**Built with ❤️ by the Sheriyakam Team**

*Last Updated: February 2026*
