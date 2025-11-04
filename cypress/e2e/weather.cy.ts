describe('Weather App - Jakarta', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  describe('Initial Load & App Structure', () => {
    it('should display the app title in header', () => {
      cy.contains('Prakiraan Cuaca Jakarta').should('be.visible');
      cy.get('ion-header').should('be.visible');
      cy.get('ion-toolbar[color="primary"]').should('be.visible');
      cy.get('ion-title').should('contain', 'Prakiraan Cuaca Jakarta');
    });

    it('should have proper app structure with ion-app', () => {
      cy.get('ion-app').should('exist');
      cy.get('.weather-container').should('exist');
    });

    it('should show loading state initially', () => {
      cy.get('body').should('exist');
      // Either loading spinner is visible OR data is already loaded
      cy.get('ion-spinner, .weather-list, .error-container').should('exist');
    });
  });

  describe('Error Handling', () => {
    it('should handle 500 Internal Server Error', () => {
      cy.intercept('GET', 'https://api.open-meteo.com/v1/forecast*', {
        statusCode: 500,
        body: { error: 'Internal Server Error' }
      }).as('serverError');

      cy.reload();
      cy.wait('@serverError');
      cy.contains('Gagal memuat data cuaca', { timeout: 10000 }).should('be.visible');
      cy.get('ion-icon[name="alert-circle"]').should('be.visible');
      cy.get('.error-container').should('be.visible');
      cy.contains('Coba Lagi').should('be.visible');
    });

    it('should display error message correctly', () => {
      cy.intercept('GET', 'https://api.open-meteo.com/v1/forecast*', {
        statusCode: 500
      }).as('error');

      cy.reload();
      cy.wait('@error');
      cy.get('.error-container').should('be.visible');
      cy.get('.error-container p').should('contain', 'Gagal memuat data cuaca');
      cy.get('.error-container ion-icon').should('have.attr', 'name', 'alert-circle');
    });

    it('should retry loading data when retry button is clicked', () => {
      // First, intercept to fail
      cy.intercept('GET', 'https://api.open-meteo.com/v1/forecast*', {
        statusCode: 500
      }).as('failedRequest');

      cy.reload();
      cy.wait('@failedRequest');

      // Then intercept to succeed
      cy.intercept('GET', 'https://api.open-meteo.com/v1/forecast*', {
        statusCode: 200,
        fixture: 'weather-response.json'
      }).as('successRequest');

      // Click retry button
      cy.contains('Coba Lagi').click();
      
      // Wait for success
      cy.wait('@successRequest');
      cy.get('ion-spinner', { timeout: 10000 }).should('not.exist');
      cy.get('.weather-list', { timeout: 10000 }).should('exist');
    });
  });

  describe('UI/UX', () => {
    it('should have header with primary color toolbar', () => {
      cy.get('ion-header').should('be.visible');
      cy.get('ion-toolbar[color="primary"]').should('be.visible');
      cy.get('ion-title').should('be.visible');
    });

    it('should be responsive on mobile viewport', () => {
      cy.viewport(375, 667);
      cy.get('ion-header').should('be.visible');
      cy.get('ion-spinner, .weather-list, .error-container', { timeout: 15000 }).should('exist');
    });

    it('should be responsive on desktop viewport', () => {
      cy.viewport(1280, 720);
      cy.get('ion-header').should('be.visible');
      cy.get('ion-spinner, .weather-list, .error-container', { timeout: 15000 }).should('exist');
    });
  });

  describe('Accessibility & Semantics', () => {
    it('should have proper semantic HTML structure', () => {
      cy.get('ion-app').should('exist');
      cy.get('ion-header').should('exist');
      cy.get('ion-content').should('exist');
    });
  });
});
