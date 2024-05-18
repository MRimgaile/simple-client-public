import * as IDs from '../front-end-ids/loginIDs';

Cypress.Commands.add('login', () => {
  cy.intercept('POST', '**/v1/accounts:lookup*').as('login');
  cy.get(IDs.usernameInput).type(Cypress.env('USER_EMAIL'));
  cy.get(IDs.passwordInput).type(Cypress.env('USER_PASSWORD'));
  cy.get(IDs.logInButton).click();
  cy.wait('@login').then(() => {
    cy.get(IDs.desktopMenu, { timeout: 10000 }).should('be.visible');
  });
});

Cypress.Commands.add('logout', () => {
  cy.get(IDs.desktopMenu).click();
  cy.get(IDs.logoutButton).click();
});
