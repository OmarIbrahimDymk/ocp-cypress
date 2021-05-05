/// <reference types="Cypress" />

import { tableInput, tableInput2 } from "../../support/lib/elements";

context("PT Section H", () => {
  before(() => {
    cy.fixture("tokens/local.json").then((user) => {
      cy.rdLogin(user);
      cy.goTo("PTSectionH");
    });
  });

  it.only("should display section H", () => {
    cy.viewport(1500, 900);
    cy.contains("Section H");
  });
  it("should display 0 if H1 is less than 0", () => {});
  it("should display error message if user enter H3 while H2 fields are empty", () => {});
  it("should display H3 max amount where H3 max amount must be the less amount from either H2(i) or H2(ii)", () => {});
});
