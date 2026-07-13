// = PRUEBAS E2E con Cypress: simulan a un usuario real usando la app =
describe('PetControl App (pruebas E2E con Cypress)', () => {

  it('debería abrir la app y mostrar la marca PetControl', () => {
    cy.visit('/');
    cy.get('h1').should('contain.text', 'PetControl');
  });

  it('debería mostrar el botón para iniciar sesión', () => {
    cy.visit('/login');
    cy.get('ion-button[type="submit"]').should('exist');
  });

  it('debería proteger la ruta home y redirigir al login sin sesión', () => {
    cy.visit('/home');
    cy.url().should('include', 'login');
  });

  it('debería iniciar sesión con las credenciales correctas', () => {
    cy.visit('/login');
    cy.get('input[type="email"]').type('demo@petcontrol.cl');
    cy.get('input[type="password"]').type('123456');
    cy.get('ion-button[type="submit"]').click();
    cy.url().should('include', 'home');
  });
});