# Weather App - Jakarta

Aplikasi sederhana untuk menampilkan data prakiraan cuaca di Jakarta menggunakan Ionic, Vue, dan TypeScript.

## Fitur

- Menampilkan data cuaca dari API Open-Meteo
- Menampilkan waktu pengukuran (time) dan suhu per jam (temperature_2m)
- Tampilan yang mudah dibaca dengan desain modern
- Responsif dan menggunakan Ionic UI components

## Teknologi

- **Ionic Vue**: Framework UI untuk aplikasi mobile/web
- **Vue 3**: Framework JavaScript progresif
- **TypeScript**: Superset JavaScript dengan type checking
- **Vite**: Build tool yang cepat
- **Capacitor**: Native runtime untuk mobile apps
- **Cypress**: End-to-end dan component testing framework
- **ESLint**: Code linting dan quality tool

## Instalasi

1. Install dependencies:

```bash
npm install
```

2. Jalankan development server:

```bash
npm run dev
```

3. Buka browser di `http://localhost:3000`

## Scripts

### Development
- `npm run dev` - Menjalankan development server
- `npm run build` - Build untuk production
- `npm run preview` - Preview build production
- `npm run type-check` - Type checking dengan TypeScript

### Linting
- `npm run lint` - Menjalankan ESLint dan auto-fix issues
- `npm run lint:check` - Menjalankan ESLint tanpa auto-fix (hanya check)

### Testing
- `npm run test` - Menjalankan semua test Cypress (headless)
- `npm run test:open` - Membuka Cypress Test Runner (GUI)
- `npm run test:e2e` - Menjalankan E2E tests saja
- `npm run test:component` - Menjalankan component tests saja

### Ionic / Mobile
- `npm run ionic:build` - Build aplikasi untuk production
- `npm run ionic:serve` - Serve aplikasi dengan Ionic CLI
- `npm run ionic:sync` - Sync web assets ke native project
- `npm run ionic:copy` - Copy web assets ke native project

### Android
- `npm run android:dev` - Build, sync, dan buka Android Studio
- `npm run android:run` - Build, sync, dan jalankan di device/emulator
- `npm run android:emulator` - Build, sync, dan jalankan di emulator

### iOS
- `npm run ios:dev` - Build, sync, dan buka Xcode
- `npm run ios:run` - Build, sync, dan jalankan di device/simulator
- `npm run ios:emulator` - Build, sync, dan jalankan di simulator

## Struktur Project

```
weather-app/
├── src/
│   ├── components/
│   │   └── WeatherList.vue    # Komponen utama untuk menampilkan data cuaca
│   ├── services/
│   │   └── weatherService.ts  # Service untuk fetch data dari API
│   ├── types/
│   │   └── weather.ts         # Type definitions untuk data cuaca
│   ├── App.vue                # Root component
│   └── main.ts                # Entry point aplikasi
├── cypress/
│   ├── e2e/
│   │   └── weather.cy.ts      # E2E tests untuk aplikasi
│   ├── component/
│   │   └── WeatherList.cy.ts  # Component tests untuk WeatherList
│   ├── fixtures/
│   │   └── weather-response.json  # Mock data untuk testing
│   └── support/
│       ├── commands.ts        # Custom Cypress commands
│       ├── e2e.ts             # E2E support file
│       └── component.tsx      # Component test support file
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── cypress.config.ts          # Konfigurasi Cypress
└── README.md
```

## API

Aplikasi menggunakan API Open-Meteo:
- Endpoint: `https://api.open-meteo.com/v1/forecast`
- Latitude: -6.2 (Jakarta)
- Longitude: 106.8 (Jakarta)
- Parameter: `hourly=temperature_2m`

## Testing

Proyek ini menggunakan Cypress untuk testing. Ada dua jenis test:

### E2E Tests
Test end-to-end yang menguji aplikasi secara keseluruhan:
- Loading state
- Menampilkan data cuaca
- Format waktu dan suhu
- Error handling
- Retry functionality
- Responsive design

### Component Tests
Test untuk komponen individu:
- Rendering component
- Loading state
- Error state
- Data display
- Formatting

### Menjalankan Tests

#### Opsi 1: Otomatis (Recommended)
Script ini akan otomatis menjalankan dev server dan test:

1. **Jalankan semua test (otomatis start server)**:
```bash
npm run test
# atau
yarn test
```

2. **Jalankan E2E tests saja (otomatis start server)**:
```bash
npm run test:e2e
# atau
yarn test:e2e
```

#### Opsi 2: Manual (Jika server sudah berjalan)
Jika dev server sudah berjalan di terminal lain:

1. **Jalankan E2E tests (manual)**:
```bash
npm run test:e2e:manual
```

2. **Buka Cypress Test Runner (GUI)**:
```bash
# Pastikan dev server sudah berjalan di terminal lain
npm run dev

# Di terminal lain, buka Cypress GUI
npm run test:open
# atau
yarn test:open
```

**Catatan**: Command `test:open` akan membuka Cypress Test Runner. Pastikan dev server sudah berjalan di `http://localhost:3000` sebelum menjalankan test melalui GUI.

3. **Jalankan component tests saja**:
```bash
npm run test:component
```

#### Opsi 3: Manual dengan 2 Terminal
Jika ingin kontrol penuh:

```bash
# Terminal 1: Jalankan dev server
npm run dev
# atau
yarn dev

# Terminal 2: Jalankan test
npm run test:e2e:manual
# atau
yarn test:e2e:manual
```

### Test Coverage

E2E tests mencakup core functionality dengan test yang stabil:
- ✅ Initial load & app structure
- ✅ Loading states
- ✅ Success state dengan data cuaca
- ✅ Error handling (500 error, retry functionality)
- ✅ Data display (time, temperature, formatting)
- ✅ UI/UX (responsive design, multiple viewports)
- ✅ Accessibility & semantics

Semua test dirancang untuk passed dan reliable.

## Mobile Development (Android & iOS)

### Setup Awal

1. **Install dependencies**:
```bash
npm install
```

2. **Inisialisasi Capacitor** (jika belum):
```bash
npx cap init
```

3. **Add platform**:
```bash
# Untuk Android
npx cap add android

# Untuk iOS (hanya di macOS)
npx cap add ios
```

### Menjalankan di Android Emulator

1. **Pastikan Android Studio dan emulator sudah terinstall**

2. **Jalankan script**:
```bash
npm run android:emulator
```

Atau manual:
```bash
# Build aplikasi
npm run build

# Sync ke Android project
npx cap sync android

# Buka di Android Studio
npx cap open android
```

3. **Di Android Studio**, pilih emulator dan klik Run

### Menjalankan di iOS Simulator

1. **Pastikan Xcode sudah terinstall** (hanya macOS)

2. **Jalankan script**:
```bash
npm run ios:emulator
```

Atau manual:
```bash
# Build aplikasi
npm run build

# Sync ke iOS project
npx cap sync ios

# Buka di Xcode
npx cap open ios
```

3. **Di Xcode**, pilih simulator dan klik Run

### Menjalankan di Device Fisik

**Android**:
```bash
npm run android:run
```

**iOS**:
```bash
npm run ios:run
```

Atau buka project di Android Studio/Xcode dan jalankan langsung dari IDE.

### Sync Changes

Setelah melakukan perubahan di web code:
```bash
npm run ionic:sync
```

Atau untuk platform tertentu:
```bash
npx cap sync android
npx cap sync ios
```

Untuk dokumentasi lengkap, lihat [MOBILE_SETUP.md](./MOBILE_SETUP.md)

## Code Quality

### ESLint

Proyek ini menggunakan ESLint untuk menjaga kualitas code:

```bash
# Lint dan auto-fix
npm run lint

# Lint tanpa auto-fix (hanya check)
npm run lint:check
```

Konfigurasi ESLint:
- `.eslintrc.json` - Konfigurasi ESLint
- `.eslintignore` - File yang diabaikan

## Lisensi

MIT

