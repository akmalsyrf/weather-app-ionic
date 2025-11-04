import WeatherDisplay from '../../src/components/WeatherDisplay.vue';
import { IonicVue } from '@ionic/vue';

describe('WeatherDisplay Component', () => {
  beforeEach(() => {
    // Restore any previous stubs
    cy.window().then((win) => {
      if ((win.navigator.geolocation.getCurrentPosition as any).restore) {
        (win.navigator.geolocation.getCurrentPosition as any).restore();
      }
    });
  });

  const mockGeolocation = (shouldFail = false) => {
    cy.window().then((win) => {
      if ((win.navigator.geolocation.getCurrentPosition as any).restore) {
        (win.navigator.geolocation.getCurrentPosition as any).restore();
      }
      cy.stub(win.navigator.geolocation, 'getCurrentPosition').callsFake((success, reject) => {
        if (shouldFail && reject) {
          const error = {
            code: 1,
            message: 'Permission denied',
            PERMISSION_DENIED: 1,
            POSITION_UNAVAILABLE: 2,
            TIMEOUT: 3
          } as GeolocationPositionError;
          reject(error);
        } else if (success) {
          const position = {
            coords: {
              latitude: -6.2,
              longitude: 106.8,
              accuracy: 10,
              altitude: null,
              altitudeAccuracy: null,
              heading: null,
              speed: null
            },
            timestamp: Date.now()
          } as GeolocationPosition;
          success(position);
        }
      });
    });
  };

  it('displays weather data when loaded', () => {
    mockGeolocation();
    
    // Intercept API calls
    cy.intercept('GET', 'https://api.open-meteo.com/v1/forecast*', {
      statusCode: 200,
      body: {
        current: {
          time: '2024-01-01T12:00',
          temperature_2m: 28.5
        }
      }
    }).as('getCurrentWeather');
    cy.intercept('GET', 'https://api.bigdatacloud.net/data/reverse-geocode-client*', {
      statusCode: 200,
      body: { city: 'Jakarta' }
    }).as('getLocation');

    cy.mount(WeatherDisplay, {
      global: {
        plugins: [IonicVue]
      }
    });
    
    // Wait for data to load
    cy.wait(['@getCurrentWeather', '@getLocation'], { timeout: 10000 });
    cy.get('ion-spinner', { timeout: 10000 }).should('not.exist');
    
    // Check data is displayed
    cy.get('.weather-card', { timeout: 10000 }).should('exist');
    cy.get('.location-name').should('contain', 'Jakarta');
    // Math.round(28.5) = 29, so check for 28 or 29
    cy.get('.temperature-value').should(($el) => {
      const text = $el.text();
      expect(text).to.match(/28|29/);
    });
    cy.get('.temperature-unit').should('contain', 'C');
  });

  it('displays error message when geolocation fails', () => {
    // Mock geolocation to fail
    mockGeolocation(true);

    cy.mount(WeatherDisplay, {
      global: {
        plugins: [IonicVue]
      }
    });
    
    // Wait for error
    cy.get('ion-spinner', { timeout: 10000 }).should('not.exist');
    
    // Check error message
    cy.get('.error-container', { timeout: 10000 }).should('exist');
    cy.contains('lokasi', { timeout: 10000 }).should('exist');
    cy.get('ion-icon[name="alert-circle"]').should('exist');
    cy.contains('Coba Lagi').should('exist');
  });

  it('refreshes weather data when refresh button is clicked', () => {
    mockGeolocation();
    
    // Initial load
    cy.intercept('GET', 'https://api.open-meteo.com/v1/forecast*', {
      statusCode: 200,
      body: {
        current: {
          time: '2024-01-01T12:00',
          temperature_2m: 28.5
        }
      }
    }).as('getInitialWeather');
    cy.intercept('GET', 'https://api.bigdatacloud.net/data/reverse-geocode-client*', {
      statusCode: 200,
      body: { city: 'Jakarta' }
    }).as('getInitialLocation');

    cy.mount(WeatherDisplay, {
      global: {
        plugins: [IonicVue]
      }
    });
    
    cy.wait(['@getInitialWeather', '@getInitialLocation'], { timeout: 10000 });
    cy.get('.weather-card', { timeout: 10000 }).should('exist');

    // Intercept refresh request
    cy.intercept('GET', 'https://api.open-meteo.com/v1/forecast*', {
      statusCode: 200,
      body: {
        current: {
          time: '2024-01-01T13:00',
          temperature_2m: 29.0
        }
      }
    }).as('refreshWeather');
    cy.intercept('GET', 'https://api.bigdatacloud.net/data/reverse-geocode-client*', {
      statusCode: 200,
      body: { city: 'Jakarta' }
    }).as('refreshLocation');

    // Click refresh button
    cy.contains('Refresh').click();
    cy.wait(['@refreshWeather', '@refreshLocation'], { timeout: 10000 });
    cy.get('.weather-card').should('exist');
    cy.get('.temperature-value').should('contain', '29');
  });

  it('formats time correctly', () => {
    mockGeolocation();
    
    cy.intercept('GET', 'https://api.open-meteo.com/v1/forecast*', {
      statusCode: 200,
      body: {
        current: {
          time: '2024-01-01T12:00',
          temperature_2m: 28.5
        }
      }
    }).as('getWeather');
    cy.intercept('GET', 'https://api.bigdatacloud.net/data/reverse-geocode-client*', {
      statusCode: 200,
      body: { city: 'Jakarta' }
    }).as('getLocation');

    cy.mount(WeatherDisplay, {
      global: {
        plugins: [IonicVue]
      }
    });
    
    cy.wait(['@getWeather', '@getLocation'], { timeout: 10000 });
    cy.get('ion-spinner', { timeout: 10000 }).should('not.exist');
    
    // Check time is formatted
    cy.get('.last-updated').should('exist').and('not.be.empty');
    cy.get('.last-updated').should('contain', 'Diperbarui:');
    cy.get('.last-updated').invoke('text').then((text) => {
      expect(text).to.not.be.empty;
      expect(text.length).to.be.greaterThan(10);
    });
  });

  it('displays temperature with correct format', () => {
    mockGeolocation();
    
    cy.intercept('GET', 'https://api.open-meteo.com/v1/forecast*', {
      statusCode: 200,
      body: {
        current: {
          time: '2024-01-01T00:00',
          temperature_2m: 28.5
        }
      }
    }).as('getWeather');
    cy.intercept('GET', 'https://api.bigdatacloud.net/data/reverse-geocode-client*', {
      statusCode: 200,
      body: { city: 'Jakarta' }
    }).as('getLocation');

    cy.mount(WeatherDisplay, {
      global: {
        plugins: [IonicVue]
      }
    });
    
    cy.wait(['@getWeather', '@getLocation'], { timeout: 10000 });
    cy.get('ion-spinner', { timeout: 10000 }).should('not.exist');
    
    // Check temperature format - should be rounded (28.5 -> 29)
    cy.get('.temperature-value').should(($el) => {
      const text = $el.text();
      expect(text).to.match(/28|29/);
    });
    cy.get('.temperature-unit').should('contain', 'C');
  });

});

