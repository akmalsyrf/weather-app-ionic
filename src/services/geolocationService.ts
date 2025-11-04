import { Geolocation } from '@capacitor/geolocation';
import { Capacitor } from '@capacitor/core';

export interface Position {
  latitude: number;
  longitude: number;
}

/**
 * Get current position using Capacitor Geolocation on native platforms
 * or fallback to browser Geolocation API on web
 */
export async function getCurrentPosition(): Promise<Position> {
  const isNative = Capacitor.isNativePlatform();

  if (isNative) {
    try {
      // Request permissions first
      const permissionStatus = await Geolocation.checkPermissions();
      
      if (permissionStatus.location !== 'granted') {
        const requestResult = await Geolocation.requestPermissions();
        
        if (requestResult.location !== 'granted') {
          throw new Error('Akses lokasi ditolak. Silakan izinkan akses lokasi di pengaturan aplikasi.');
        }
      }

      // Get current position using Capacitor
      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000
      });

      return {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      };
    } catch (error: unknown) {
      // Handle Capacitor geolocation errors
      if (error instanceof Error && error.message) {
        throw error;
      }
      throw new Error('Gagal mendapatkan lokasi. Pastikan GPS aktif dan akses lokasi diizinkan.');
    }
  } else {
    // Fallback to browser Geolocation API for web
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation tidak didukung oleh browser Anda'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (err) => {
          let errorMessage = 'Gagal mendapatkan lokasi.';
          switch (err.code) {
          case err.PERMISSION_DENIED:
            errorMessage = 'Akses lokasi ditolak. Silakan izinkan akses lokasi di pengaturan browser.';
            break;
          case err.POSITION_UNAVAILABLE:
            errorMessage = 'Informasi lokasi tidak tersedia.';
            break;
          case err.TIMEOUT:
            errorMessage = 'Waktu permintaan lokasi habis.';
            break;
          }
          reject(new Error(errorMessage));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    });
  }
}

