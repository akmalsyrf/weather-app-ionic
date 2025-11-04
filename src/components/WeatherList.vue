<template>
  <div class="weather-container">
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Prakiraan Cuaca Jakarta</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>

      <div class="content-wrapper">
        <div v-if="loading" class="loading-container">
          <ion-spinner name="crescent"></ion-spinner>
          <p>Memuat data cuaca...</p>
        </div>

        <div v-else-if="error" class="error-container">
          <ion-icon name="alert-circle" size="large"></ion-icon>
          <p>{{ error }}</p>
          <ion-button @click="loadWeatherData" color="primary">
            Coba Lagi
          </ion-button>
        </div>

        <div v-else class="weather-list">
          <ion-list>
            <ion-item 
              v-for="(weather, index) in weatherData" 
              :key="index"
              class="weather-item"
            >
              <ion-label>
                <h2>{{ formatTime(weather.time) }}</h2>
                <p class="temperature">{{ weather.temperature_2m }}°C</p>
              </ion-label>
            </ion-item>
          </ion-list>
        </div>
      </div>
    </ion-content>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { 
  IonContent, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonList, 
  IonItem, 
  IonLabel,
  IonSpinner,
  IonButton,
  IonIcon
} from '@ionic/vue';
import { fetchWeatherData } from '../services/weatherService';
import type { WeatherData } from '../types/weather';

const weatherData = ref<WeatherData[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

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

const loadWeatherData = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    const data = await fetchWeatherData();
    weatherData.value = data;
  } catch (err) {
    error.value = 'Gagal memuat data cuaca. Silakan coba lagi.';
    console.error(err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadWeatherData();
});
</script>

<style scoped>
.weather-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.content-wrapper {
  padding: 16px;
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

.weather-list {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-top: 16px;
}

.weather-item {
  border-bottom: 1px solid #f0f0f0;
}

.weather-item:last-child {
  border-bottom: none;
}

.weather-item ion-label h2 {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
}

.temperature {
  font-size: 24px;
  font-weight: bold;
  color: #667eea;
  margin: 0;
}

ion-spinner {
  --color: white;
}
</style>

