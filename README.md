# UrbanAV Mobile App - Quick Start Guide

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- Expo CLI installed globally: `npm install -g expo-cli`
- MongoDB installed and running on `mongodb://localhost:27017`

### 1. Start the Backend Server

```bash
# Navigate to server directory
cd server

# Install dependencies (if not already done)
npm install

# Seed the database with 50+ equipment items
node scripts/seed.js

# Start the backend server (port 3001)
node index.js
```

### 2. Start the Mobile App

```bash
# Navigate to mobile app directory
cd urbanav-mobile

# Install dependencies (already done)
npm install

# Start Expo
npx expo start
```

### 3. Run on Device/Emulator

Choose one of the following options:

**Option A: Web Browser (Fastest)**
- Press `w` in the terminal
- App will open in your browser at `http://localhost:8081`

**Option B: iOS Simulator** (Mac only)
- Press `i` in the terminal
- Requires Xcode installed

**Option C: Android Emulator**
- Press `a` in the terminal
- Requires Android Studio with emulator

**Option D: Physical Device** (Recommended)
1. Install Expo Go app on your phone
2. Scan the QR code shown in terminal
3. App will load on your device

## 📱 Demo Credentials

### Buyer Account
- **Email:** buyer@test.com
- **Password:** password123

### Supplier Account
- **Email:** proav@urbanav.com
- **Password:** password123

### Other Suppliers
- soundmaster@urbanav.com / password123
- djpro@urbanav.com / password123
- techvision@urbanav.com / password123

## 🎨 App Features

### ✅ Completed
- Purple glass-morphism theme matching UrbanAV branding
- Login & Register screens with demo credentials
- Home screen with categories and popular equipment
- Bottom tab navigation (Home, Categories, Cart, Orders, Profile)
- State management with Zustand
- API integration ready
- UI components with glass effects

### 🚧 In Progress
- Equipment detail screens
- Cart & checkout flow
- Real-time chat with WebSocket
- Order management screens
- Supplier dashboard
- Push notifications

## 📁 Project Structure

```
urbanav-mobile/
├── src/
│   ├── api/           # API client & endpoints
│   ├── components/    # Reusable UI components
│   │   └── ui/        # Glass-morphism components
│   ├── screens/       # App screens
│   ├── store/         # Zustand state management
│   └── theme/         # Colors, sizes, fonts
├── App.tsx            # Main app with navigation
├── package.json
├── tsconfig.json
└── app.json
```

## 🎯 Next Steps

1. **Add remaining screens:**
   - Equipment Detail
   - Categories
   - Cart & Checkout
   - Order tracking
   - Real-time chat
   - Supplier dashboard

2. **Connect to real backend:**
   - Uncomment API calls in store
   - Add token handling
   - Test authentication flow

3. **Add WebSocket chat:**
   - Install socket.io-client
   - Implement real-time messaging
   - Add notification badges

4. **Deploy:**
   - Run `eas build` for production builds
   - Deploy backend to Heroku/AWS
   - Configure MongoDB Atlas

## 🔧 Troubleshooting

### Backend won't start
```bash
# Make sure MongoDB is running
mongod

# Check if port 3001 is available
netstat -ano | findstr :3001
```

### Expo won't start
```bash
# Clear cache
npx expo start -c

# Reinstall dependencies
rm -rf node_modules
npm install
```

### Can't connect to backend
- Make sure backend is running on `http://localhost:3001`
- Check API_URL in `src/api/index.ts`
- If using physical device, use your computer's IP instead of localhost

## 📞 Support

For issues or questions:
- Check backend logs in server terminal
- Check app logs in Expo terminal
- Review network requests in browser DevTools
