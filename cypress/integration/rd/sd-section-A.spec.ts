/// <reference types="Cypress" />

describe("SD - Section A", () => {
  beforeEach(() => {
    cy.rdLogin();

    cy.intercept("GET", "/rd/api/MasterData/*", {
      fixture: "responses/masterdata",
    });

    cy.goTo("SDSectionA");
    cy.viewport(1500, 900);
  });

  it("should display SD", () => {
    cy.log("helloo");
  });
});
