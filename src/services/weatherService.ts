import type { WeatherResponse, WeatherData } from '../types/weather';

const API_BASE_URL = 'https://api.open-meteo.com/v1/forecast';

export async function fetchWeatherData(
  latitude: number = -6.2,
  longitude: number = 106.8
): Promise<WeatherData[]> {
  try {
    const url = `${API_BASE_URL}?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m`;
    const response = await fetch(url);
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

export async function fetchCurrentWeather(
  latitude: number,
  longitude: number
): Promise<{ current: WeatherData; location: string }> {
  try {
    const url = `${API_BASE_URL}?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch current weather data');
    }
    
    const data = await response.json() as {
      current: {
        time: string;
        temperature_2m: number;
        relative_humidity_2m?: number;
        weather_code?: number;
        wind_speed_10m?: number;
      };
    };
    
    const currentWeather: WeatherData = {
      time: data.current.time,
      temperature_2m: data.current.temperature_2m
    };
    
    // Get location name using reverse geocoding (simple approach)
    const locationName = await getLocationName(latitude, longitude);
    
    return {
      current: currentWeather,
      location: locationName
    };
  } catch (error) {
    console.error('Error fetching current weather data:', error);
    throw error;
  }
}

async function getLocationName(latitude: number, longitude: number): Promise<string> {
  try {
    const response = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
    );
    if (!response.ok) {
      return `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`;
    }
    const data = await response.json();
    return data.city || data.locality || `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`;
  } catch (error) {
    return `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`;
  }
}

