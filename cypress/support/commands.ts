// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

import "cypress-file-upload";

Cypress.Commands.add("qaSetToken", (user: string) => {
  localStorage.setItem(
    "oidc.user:https://accounts.qa.ocp.mofe.gov.bn:eservice_portal_qa_onprem_env",
    JSON.stringify(user)
  );
});

Cypress.Commands.add("searchEntity", (entity) => {
  // enter entity number
  cy.get("#__BVID__33").select("StartsWith");
  cy.get("#__BVID__38").type(entity.number);
  // select companies
  cy.get("#__BVID__42").select(entity.registerType);
  // click advanced search
  cy.get(".col > .btn").click();
  // select public
  cy.get("#__BVID__48").select(entity.type);
  // click search button
  cy.get(".offset-md-3 > .btn-primary").click();
  cy.get(
    ":nth-child(1) > :nth-child(1) > .card-address-wrapper > :nth-child(3) > .text-right > .btn"
  ).click();
  // cy.screenshot(entity.number);
  cy.get("tr > :nth-child(3) > .btn").should("exist");
});

Cypress.Commands.add("rdLogin", (user) => {
  localStorage.setItem(
    "oidc.user:http://localhost:5081:eservice_portal_development",
    JSON.stringify(user)
  );
});

Cypress.Commands.add("goTo", (...sections) => {
  cy.visit("http://localhost:5082/playground/369");
  cy.get(".multiselect__tags").click();
  sections.forEach((section) => {
    cy.contains(section).click({ force: true });
  });
  cy.get(".multiselect__select").click({ force: true });
});

Cypress.Commands.add("getDataTestId", (testId) =>
  cy.get(`[data-testid=${testId}]`, { timeout: 15000 })
);

// Set CYPRESS_COMMAND_DELAY above zero for demoing to stakeholders,
// E.g. CYPRESS_COMMAND_DELAY=1000 node_modules/.bin/cypress open
const COMMAND_DELAY = Cypress.env("COMMAND_DELAY") || 0;
if (COMMAND_DELAY > 0) {
  for (const command of [
    "visit",
    "click",
    "trigger",
    "type",
    "clear",
    "reload",
    "contains",
  ]) {
    Cypress.Commands.overwrite(command, (originalFn, ...args) => {
      const origVal = originalFn(...args);

      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(origVal);
        }, COMMAND_DELAY);
      });
    });
  }
}
