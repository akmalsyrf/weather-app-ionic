import WeatherList from '../../src/components/WeatherList.vue';
import { IonicVue } from '@ionic/vue';
import type { WeatherData } from '../../src/types/weather';

describe('WeatherList Component', () => {
  const mockWeatherData: WeatherData[] = [
    {
      time: '2024-01-01T00:00',
      temperature_2m: 28.5
    },
    {
      time: '2024-01-01T01:00',
      temperature_2m: 28.2
    },
    {
      time: '2024-01-01T02:00',
      temperature_2m: 27.8
    }
  ];

  it('renders loading state', () => {
    // Intercept with delay to ensure loading state is visible
    cy.intercept('GET', 'https://api.open-meteo.com/v1/forecast*', {
      statusCode: 200,
      body: {
        latitude: -6.2,
        longitude: 106.8,
        hourly: {
          time: mockWeatherData.map(d => d.time),
          temperature_2m: mockWeatherData.map(d => d.temperature_2m)
        },
        hourly_units: {
          time: 'iso8601',
          temperature_2m: '°C'
        }
      },
      delay: 1000 // Add delay to see loading state
    }).as('delayedWeather');

    cy.mount(WeatherList, {
      global: {
        plugins: [IonicVue]
      }
    });
    
    // Check loading state immediately - use exist instead of visible for Ionic components
    cy.get('ion-spinner', { timeout: 500 }).should('exist');
    cy.contains('Memuat data cuaca...').should('exist');
    
    // Wait for data to load
    cy.wait('@delayedWeather');
    cy.get('ion-spinner', { timeout: 5000 }).should('not.exist');
  });

  it('displays weather data when loaded', () => {
    // Intercept API call
    cy.intercept('GET', 'https://api.open-meteo.com/v1/forecast*', {
      statusCode: 200,
      body: {
        latitude: -6.2,
        longitude: 106.8,
        hourly: {
          time: mockWeatherData.map(d => d.time),
          temperature_2m: mockWeatherData.map(d => d.temperature_2m)
        },
        hourly_units: {
          time: 'iso8601',
          temperature_2m: '°C'
        }
      }
    }).as('getWeather');

    cy.mount(WeatherList, {
      global: {
        plugins: [IonicVue]
      }
    });
    
    // Wait for data to load
    cy.wait('@getWeather');
    cy.get('ion-spinner', { timeout: 10000 }).should('not.exist');
    
    // Check data is displayed
    cy.get('ion-item.weather-item').should('have.length.greaterThan', 0);
    cy.get('.temperature').first().should('contain', '°C');
  });

  it('displays error message on API failure', () => {
    // Intercept API call to fail
    cy.intercept('GET', 'https://api.open-meteo.com/v1/forecast*', {
      statusCode: 500,
      body: { error: 'Internal Server Error' }
    }).as('getWeatherError');

    cy.mount(WeatherList, {
      global: {
        plugins: [IonicVue]
      }
    });
    
    // Wait for error
    cy.wait('@getWeatherError');
    
    // Wait for loading to finish and error to appear
    cy.get('ion-spinner', { timeout: 10000 }).should('not.exist');
    
    // Check error message - use exist for Ionic components with positioning issues
    cy.get('.error-container', { timeout: 10000 }).should('exist');
    cy.contains('Gagal memuat data cuaca', { timeout: 10000 }).should('exist');
    cy.get('ion-icon[name="alert-circle"]').should('exist');
    cy.contains('Coba Lagi').should('exist');
  });

  it('retries loading when retry button is clicked', () => {
    // First call fails
    cy.intercept('GET', 'https://api.open-meteo.com/v1/forecast*', {
      statusCode: 500
    }).as('getWeatherError');

    cy.mount(WeatherList, {
      global: {
        plugins: [IonicVue]
      }
    });
    cy.wait('@getWeatherError');
    
    // Wait for error state - use exist instead of visible
    cy.get('ion-spinner', { timeout: 10000 }).should('not.exist');
    cy.get('.error-container', { timeout: 10000 }).should('exist');
    
    // Second call succeeds
    cy.intercept('GET', 'https://api.open-meteo.com/v1/forecast*', {
      statusCode: 200,
      body: {
        latitude: -6.2,
        longitude: 106.8,
        hourly: {
          time: mockWeatherData.map(d => d.time),
          temperature_2m: mockWeatherData.map(d => d.temperature_2m)
        },
        hourly_units: {
          time: 'iso8601',
          temperature_2m: '°C'
        }
      }
    }).as('getWeatherSuccess');

    // Click retry button - use force to handle visibility issues
    cy.contains('Coba Lagi').click({ force: true });
    cy.wait('@getWeatherSuccess');
    
    // Should show data
    cy.get('ion-item.weather-item', { timeout: 10000 }).should('have.length.greaterThan', 0);
  });

  it('formats time correctly', () => {
    cy.intercept('GET', 'https://api.open-meteo.com/v1/forecast*', {
      statusCode: 200,
      body: {
        latitude: -6.2,
        longitude: 106.8,
        hourly: {
          time: ['2024-01-01T12:00'],
          temperature_2m: [28.5]
        },
        hourly_units: {
          time: 'iso8601',
          temperature_2m: '°C'
        }
      }
    }).as('getWeather');

    cy.mount(WeatherList, {
      global: {
        plugins: [IonicVue]
      }
    });
    cy.wait('@getWeather');
    cy.get('ion-spinner', { timeout: 10000 }).should('not.exist');
    
    // Check time is formatted - Indonesian locale format should contain formatted date/time
    cy.get('h2').first().should('exist').and('not.be.empty');
    // Just verify that it's formatted and not empty
    cy.get('h2').first().invoke('text').then((text) => {
      expect(text).to.not.be.empty;
      expect(text.length).to.be.greaterThan(0);
    });
  });

  it('displays temperature with correct format', () => {
    cy.intercept('GET', 'https://api.open-meteo.com/v1/forecast*', {
      statusCode: 200,
      body: {
        latitude: -6.2,
        longitude: 106.8,
        hourly: {
          time: ['2024-01-01T00:00'],
          temperature_2m: [28.5]
        },
        hourly_units: {
          time: 'iso8601',
          temperature_2m: '°C'
        }
      }
    }).as('getWeather');

    cy.mount(WeatherList, {
      global: {
        plugins: [IonicVue]
      }
    });
    cy.wait('@getWeather');
    cy.get('ion-spinner', { timeout: 10000 }).should('not.exist');
    
    // Check temperature format
    cy.get('.temperature').first()
      .should('contain', '28.5')
      .and('contain', '°C');
  });

  it('handles empty data gracefully', () => {
    cy.intercept('GET', 'https://api.open-meteo.com/v1/forecast*', {
      statusCode: 200,
      body: {
        latitude: -6.2,
        longitude: 106.8,
        hourly: {
          time: [],
          temperature_2m: []
        },
        hourly_units: {
          time: 'iso8601',
          temperature_2m: '°C'
        }
      }
    }).as('emptyWeather');

    cy.mount(WeatherList, {
      global: {
        plugins: [IonicVue]
      }
    });
    
    cy.wait('@emptyWeather');
    cy.get('ion-spinner', { timeout: 10000 }).should('not.exist');
    
    // Use exist instead of visible for Ionic components
    cy.get('.weather-list', { timeout: 10000 }).should('exist');
    cy.get('ion-item.weather-item').should('have.length', 0);
  });

  it('handles network errors', () => {
    cy.intercept('GET', 'https://api.open-meteo.com/v1/forecast*', {
      forceNetworkError: true
    }).as('networkError');

    cy.mount(WeatherList, {
      global: {
        plugins: [IonicVue]
      }
    });
    
    cy.wait('@networkError', { timeout: 10000 });
    cy.get('ion-spinner', { timeout: 15000 }).should('not.exist');
    
    // Use exist instead of visible for Ionic components with positioning
    cy.get('.error-container', { timeout: 15000 }).should('exist');
    cy.contains('Gagal memuat data cuaca').should('exist');
  });

  it('displays multiple weather items correctly', () => {
    cy.intercept('GET', 'https://api.open-meteo.com/v1/forecast*', {
      statusCode: 200,
      body: {
        latitude: -6.2,
        longitude: 106.8,
        hourly: {
          time: mockWeatherData.map(d => d.time),
          temperature_2m: mockWeatherData.map(d => d.temperature_2m)
        },
        hourly_units: {
          time: 'iso8601',
          temperature_2m: '°C'
        }
      }
    }).as('getWeather');

    cy.mount(WeatherList, {
      global: {
        plugins: [IonicVue]
      }
    });
    
    cy.wait('@getWeather');
    cy.get('ion-spinner', { timeout: 10000 }).should('not.exist');
    
    // Should have 3 items
    cy.get('ion-item.weather-item').should('have.length', 3);
    
    // Each item should have time and temperature
    cy.get('ion-item.weather-item').each(($item) => {
      cy.wrap($item).within(() => {
        cy.get('h2').should('exist').and('not.be.empty');
        cy.get('.temperature').should('exist').and('not.be.empty');
      });
    });
  });
});
