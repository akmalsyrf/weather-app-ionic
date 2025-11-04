# Mobile Setup Guide - Weather App

## Prerequisites

### Android Development
- [Android Studio](https://developer.android.com/studio) dengan Android SDK
- Java Development Kit (JDK) 11 atau lebih baru
- Android SDK Platform 33 atau lebih baru

### iOS Development (macOS only)
- [Xcode](https://developer.apple.com/xcode/) dengan iOS SDK
- CocoaPods: `sudo gem install cocoapods`
- Xcode Command Line Tools: `xcode-select --install`

## Setup Project

### 1. Install Dependencies
```bash
npm install
```

### 2. Initialize Capacitor (First Time Only)
```bash
npx cap init
```

Ini akan membuat file `capacitor.config.ts` jika belum ada.

### 3. Add Platforms

**Android:**
```bash
npx cap add android
```

**iOS (macOS only):**
```bash
npx cap add ios
```

## Development Workflow

### 1. Build Web App
```bash
npm run build
```

### 2. Sync to Native Projects
```bash
# Sync all platforms
npm run ionic:sync

# Or sync specific platform
npx cap sync android
npx cap sync ios
```

### 3. Open in Native IDE

**Android:**
```bash
npx cap open android
```

**iOS:**
```bash
npx cap open ios
```

### 4. Run in Emulator/Simulator

**Android Emulator:**
```bash
npm run android:<emulator-id>
```

**iOS Simulator:**
```bash
npm run ios:<emulator-id>
```

## Quick Commands

### Android
- `npm run android:dev` - Build, sync, dan buka Android Studio
- `npm run android:run` - Build, sync, dan jalankan
- `npm run android:emulator` - Jalankan di emulator

### iOS
- `npm run ios:dev` - Build, sync, dan buka Xcode
- `npm run ios:run` - Build, sync, dan jalankan
- `npm run ios:emulator` - Jalankan di simulator

## Troubleshooting

### Android

**Error: Android SDK not found**
- Install Android SDK melalui Android Studio
- Set environment variable `ANDROID_HOME`

**Error: Gradle build failed**
- Pastikan Android SDK Platform 33+ terinstall
- Update Gradle di `android/build.gradle`

**Emulator tidak muncul**
- Buat AVD (Android Virtual Device) di Android Studio
- Atau gunakan device fisik dengan USB debugging enabled

### iOS

**Error: CocoaPods not found**
```bash
sudo gem install cocoapods
cd ios/App
pod install
```

**Error: Xcode Command Line Tools**
```bash
xcode-select --install
```

**Simulator tidak muncul**
- Pastikan Xcode sudah terinstall
- Buka Xcode dan install iOS Simulator

## Live Reload

Untuk live reload saat development:

1. **Jalankan dev server**:
```bash
npm run dev
```

2. **Update capacitor.config.ts**:
```typescript
server: {
  url: 'http://localhost:3000',
  cleartext: true
}
```

3. **Sync dan jalankan**:
```bash
npx cap sync
npm run android:emulator  # atau ios:emulator
```

## Building for Production

### Android APK
```bash
npm run build
npx cap sync android
cd android
./gradlew assembleRelease
```

APK akan berada di `android/app/build/outputs/apk/release/`

### iOS IPA
```bash
npm run build
npx cap sync ios
cd ios/App
# Buka di Xcode dan archive untuk production
```

## Plugin Configuration

Plugin Capacitor yang sudah terinstall:
- `@capacitor/app` - App lifecycle events
- `@capacitor/haptics` - Haptic feedback
- `@capacitor/keyboard` - Keyboard events
- `@capacitor/status-bar` - Status bar styling

Untuk menambah plugin:
```bash
npm install @capacitor/[plugin-name]
npx cap sync
```

