<template>
  <ion-app>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Aplikasi Cuaca</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-segment v-model="selectedTab" @ion-change="onTabChange">
        <ion-segment-button value="weather-display">
          <ion-label>Lokasi Saya</ion-label>
        </ion-segment-button>
        <ion-segment-button value="weather-list">
          <ion-label>Daftar Cuaca</ion-label>
        </ion-segment-button>
      </ion-segment>

      <div v-if="selectedTab === 'weather-display'">
        <WeatherDisplay />
      </div>
      <div v-else>
        <WeatherList />
      </div>
    </ion-content>
  </ion-app>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { 
  IonApp, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonSegment, 
  IonSegmentButton, 
  IonLabel 
} from '@ionic/vue';
import WeatherList from './components/WeatherList.vue';
import WeatherDisplay from './components/WeatherDisplay.vue';

const selectedTab = ref('weather-display');

const onTabChange = (event: CustomEvent) => {
  selectedTab.value = event.detail.value as string;
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, 
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

ion-segment {
  margin: 16px;
  border-radius: 8px;
}
</style>

