import * as IDs from '../support/front-end-ids/evaluationListIDs';

before(() => {
  cy.visit('/logout').then(() => {
    cy.login().then(() => {
      cy.visit('/start');
    });
  });
});

describe('Evaluations creation for a user', () => {
  it('Starts a new evaluation', () => {
    cy.get(IDs.startNewEvaluation).click();
    const userId = 1; // or any user id that you want to create the evaluation for
    cy.get(IDs.evaluationName).type(`Evaluation for user ${userId}`);
    cy.get(IDs.evaluationUser).click()
    //select(`Option for User ${userId}`); // replace the `Option for User ${userId}` according to your application
    cy.get('#continue-button').click();

    // Perform an assertion
    cy.get('#evaluation-list') // replace with actual selector
      .should('contain', `Evaluation for user ${userId}`);
  });
});
