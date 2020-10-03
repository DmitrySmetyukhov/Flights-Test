describe('Main page', () => {
  it('Should display search form', () => {
    cy.visit('/');
    cy.contains('Flights');
    cy.get('#submit-btn').should('be.disabled')
  });

  it('Should show connections field', () => {
    cy.get('#direct-check').click().then(() => {
      cy.get('#connections-field').should('be.visible');
    })
  });

  it('Should set form valid state', () => {
    cy.visit(`http://127.0.0.1:4200/flights?origin=Berlin&destination=Paris&startDate=2020-10-03&endDate=2020-10-03&direct=false&connections=2`);
    cy.get('#submit-btn').should('be.enabled')
  });

  it('Should set form invalid state', () => {
    cy.visit(`http://127.0.0.1:4200/flights?origin=test&destination=test&startDate=2020-10-03&endDate=2020-10-03&direct=false&connections=2`);
    cy.get('#submit-btn').should('be.disabled')
  });

  it('Should correctly show loading spinner', () => {
    cy.visit(`http://127.0.0.1:4200/flights?origin=Berlin&destination=Paris&startDate=2020-10-03&endDate=2020-10-03&direct=false&connections=2`);
    cy.get('.spinner-block').should('not.exist');
    cy.get('#submit-btn').click();
    cy.get('.spinner-block').should('be.visible');
  });
});
