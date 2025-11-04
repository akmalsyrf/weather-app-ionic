import type { WeatherResponse, WeatherData } from '../types/weather';

const API_URL = 'https://api.open-meteo.com/v1/forecast?latitude=-6.2&longitude=106.8&hourly=temperature_2m';

export async function fetchWeatherData(): Promise<WeatherData[]> {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error('Failed to fetch weather data');
    }
    
    const data: WeatherResponse = await response.json();
    
    // Transform API response to WeatherData array
    const weatherData: WeatherData[] = data.hourly.time.map((time, index) => ({
      time,
      temperature_2m: data.hourly.temperature_2m[index]
    }));
    
    return weatherData;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
}

