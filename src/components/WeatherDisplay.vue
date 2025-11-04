<template>
  <div class="weather-display-container">
    <div class="content-wrapper">
      <div v-if="loading" class="loading-container">
        <ion-spinner name="crescent" />
        <p>{{ loadingMessage }}</p>
      </div>

      <div v-else-if="error" class="error-container">
        <ion-icon name="alert-circle" size="large" />
        <p>{{ error }}</p>
        <ion-button color="primary" @click="loadWeather">
          Coba Lagi
        </ion-button>
      </div>

      <div v-else-if="weatherData" class="weather-card">
        <div class="location-section">
          <ion-icon name="location" size="large" />
          <h1 class="location-name">
            {{ locationName }}
          </h1>
        </div>

        <div class="temperature-section">
          <div class="temperature-value">
            {{ Math.round(weatherData.current.temperature_2m) }}°
          </div>
          <div class="temperature-unit">
            C
          </div>
        </div>

        <div class="time-section">
          <p class="last-updated">
            Diperbarui: {{ formatTime(weatherData.current.time) }}
          </p>
        </div>

        <div class="action-section">
          <ion-button color="light" fill="outline" @click="loadWeather">
            <template #start>
              <ion-icon name="refresh" />
            </template>
            Refresh
          </ion-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { 
  IonSpinner,
  IonButton,
  IonIcon
} from '@ionic/vue';
import { fetchCurrentWeather } from '../services/weatherService';
import { getCurrentPosition } from '../services/geolocationService';
import type { WeatherData } from '../types/weather';

interface WeatherDisplayData {
  current: WeatherData;
  location: string;
}

const weatherData = ref<WeatherDisplayData | null>(null);
const locationName = ref<string>('');
const loading = ref(true);
const loadingMessage = ref('Memuat lokasi...');
const error = ref<string | null>(null);

const loadWeather = async () => {
  loading.value = true;
  error.value = null;
  loadingMessage.value = 'Memuat lokasi...';

  try {
    // Get user's current location using Capacitor Geolocation (native) or browser API (web)
    const position = await getCurrentPosition();

    loadingMessage.value = 'Memuat data cuaca...';

    // Fetch weather data
    const data = await fetchCurrentWeather(position.latitude, position.longitude);
    weatherData.value = data;
    locationName.value = data.location;
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Gagal memuat data cuaca. Silakan coba lagi.';
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const formatTime = (timeString: string): string => {
  const date = new Date(timeString);
  return date.toLocaleString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

onMounted(() => {
  loadWeather();
});
</script>

<style scoped>
.weather-display-container {
  min-height: calc(100vh - 120px);
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 16px;
}

.content-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100%;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  color: white;
}

.loading-container p {
  margin-top: 16px;
  font-size: 16px;
  text-align: center;
}

.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  color: white;
  text-align: center;
  padding: 20px;
}

.error-container ion-icon {
  margin-bottom: 16px;
  color: #ff6b6b;
}

.error-container p {
  margin-bottom: 20px;
  font-size: 16px;
}

.weather-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  padding: 32px;
  width: 100%;
  max-width: 400px;
  text-align: center;
  backdrop-filter: blur(10px);
}

.location-section {
  margin-bottom: 32px;
}

.location-section ion-icon {
  color: #667eea;
  margin-bottom: 8px;
}

.location-name {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0;
  text-transform: capitalize;
}

.temperature-section {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  margin-bottom: 24px;
  gap: 8px;
}

.temperature-value {
  font-size: 72px;
  font-weight: 700;
  color: #667eea;
  line-height: 1;
}

.temperature-unit {
  font-size: 32px;
  font-weight: 600;
  color: #667eea;
  margin-top: 8px;
}

.time-section {
  margin-bottom: 24px;
}

.last-updated {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.action-section {
  margin-top: 16px;
}

ion-spinner {
  --color: white;
}
</style>

