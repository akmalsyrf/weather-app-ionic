<template>
  <ion-app>
    <WeatherList />
  </ion-app>
</template>

<script setup lang="ts">
import { IonApp } from '@ionic/vue';
import WeatherList from './components/WeatherList.vue';
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
</style>

