/// <reference types="Cypress" />

enum OCP_URL {
  MASTER_DATA = "/rd/api/MasterData",
  ENTITIES = "/rocbn/api/entities/rd/369",
  ENTITIES_SEARCH = "/rocbn/api/entities/search?entityType=*",
  STAKEHOLDERS = "/rocbn/api/entities/rd/369/stakeholders",
}

describe("Petroleum Tax", () => {
  beforeEach(() => {
    cy.rdLogin();

    cy.intercept("GET", OCP_URL.MASTER_DATA, {
      fixture: "responses/masterdata",
    });

    cy.intercept("GET", OCP_URL.STAKEHOLDERS, {
      fixture: "responses/stakeholder/stakeholders",
    });

    cy.intercept("GET", OCP_URL.ENTITIES, {
      fixture: "responses/entities",
    });

    cy.intercept("GET", OCP_URL.ENTITIES_SEARCH, {
      fixture: "responses/entitiesSearch",
    });

    cy.viewport(1500, 900);
  });

  it("should display petroleum tax form", () => {
    cy.visit("http://localhost:5082/petroleum-taxform/369");
  });

  it.only("should display all section", () => {
    cy.goTo(
      369,
      "PTSectionA",
      "PTSectionB",
      "PTSectionC",
      "PTSectionD",
      "PTSectionE",
      "PTSectionF",
      "PTSectionG",
      "PTSectionH",
      "PTSectionI"
    );
  });

  it("should display section B", () => {
    cy.goTo(369, "PTSectionB");
  });

  it("should display section D", () => {
    cy.goTo(369, "PTSectionD");
  });

  it("should display section H", () => {
    cy.goTo(369, "PTSectionA", "PTSectionH");
  });
});
