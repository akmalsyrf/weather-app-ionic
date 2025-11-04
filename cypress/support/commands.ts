/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to wait for weather data to load
       * @example cy.waitForWeatherData()
       */
      waitForWeatherData(): Chainable<void>
    }
  }
}

Cypress.Commands.add('waitForWeatherData', () => {
  // Wait for loading spinner to disappear (if it exists)
  cy.get('body').then(($body) => {
    if ($body.find('ion-spinner').length > 0) {
      cy.get('ion-spinner', { timeout: 20000 }).should('not.exist')
    }
  })
  // Wait for weather list or error container to exist
  cy.get('.weather-list, .error-container', { timeout: 20000 }).should('exist')
  // Scroll into view if needed
  cy.get('.weather-list, .error-container').first().scrollIntoView()
  // Wait for it to be visible
  cy.get('.weather-list, .error-container', { timeout: 5000 }).should('be.visible')
  // If weather list is visible, ensure it has content
  cy.get('body').then(($body) => {
    if ($body.find('.weather-list').length > 0) {
      cy.get('ion-item.weather-item', { timeout: 5000 }).should('have.length.greaterThan', 0)
    }
  })
})

export {}

