describe('Weather App', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  describe('Initial Load & App Structure', () => {
    it('should display the app title in header', () => {
      cy.contains('Aplikasi Cuaca').should('be.visible');
      cy.get('ion-header').should('be.visible');
      cy.get('ion-toolbar[color="primary"]').should('be.visible');
      cy.get('ion-title').should('contain', 'Aplikasi Cuaca');
    });

    it('should have proper app structure with ion-app', () => {
      cy.get('ion-app').should('exist');
      cy.get('ion-content').should('exist');
    });

    it('should display segment navigation', () => {
      cy.get('ion-segment').should('exist');
      cy.get('ion-segment-button[value="weather-display"]').should('exist');
      cy.get('ion-segment-button[value="weather-list"]').should('exist');
      cy.contains('Lokasi Saya').should('be.visible');
      cy.contains('Daftar Cuaca').should('be.visible');
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
      cy.get('ion-segment').should('be.visible');
    });

    it('should be responsive on desktop viewport', () => {
      cy.viewport(1280, 720);
      cy.get('ion-header').should('be.visible');
      cy.get('ion-segment').should('be.visible');
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
