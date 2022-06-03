/// <reference types="Cypress" />

describe("RD Dashboard", () => {
  beforeEach(() => {
    cy.rdLogin();

    cy.intercept("GET", "/rocbn/api/dashboard/notifications", {
      fixture: "responses/notifications",
    });
  });

  it("should display rd dashboard", () => {
    cy.visit("http://localhost:5082/");
  });
});
