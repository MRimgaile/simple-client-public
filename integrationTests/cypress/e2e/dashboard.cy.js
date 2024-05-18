import * as IDs from '../support/front-end-ids/evaluationListIDs';

before(() => {
  cy.visit('/logout').then(() => {
    cy.login().then(() => {
      cy.visit('/start');
    });
  });
});

describe('Evaluations list', () => {
  it('Adding evaluation', () => {
    cy.get(IDs.startNewEvaluation).click();
  });
});
