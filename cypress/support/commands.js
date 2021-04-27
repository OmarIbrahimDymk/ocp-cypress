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

Cypress.Commands.add("login", () => {
  cy.request({
    method: "POST",
    url: "",
    body: {
      user: {
        email: "",
        password: "",
      },
    },
  }).then((resp) => {
    window.localStorage.setItem("id_token", resp.body.user.token);
  });
});

Cypress.Commands.add("OCPLogin", ({ url, icNumber, password }) => {
  cy.visit(url);
  cy.get("button").contains("Login").click();
  cy.get("#Username").type(icNumber);
  cy.get("#Password").type(`${password}{enter}`);
  cy.get(":nth-child(1) > .nav-link").click();
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
  // cy.request("POST", "api/url", user)
  //   .its("body.data.access_token")
  //   .should("exist")
  //   .then((token) => {
  //     localStorage.setItem("auth._token.local", `Bearer ${token}`)
  //   })
  localStorage.setItem(
    "oidc.user:http://localhost:5081:eservice_portal_development",
    JSON.stringify(user)
  );
});

Cypress.Commands.add("goTo", (section) => {
  cy.visit("http://localhost:5082/playground/369");
  cy.get(".multiselect__tags").click();
  cy.contains(section).click();
  cy.get(".multiselect__select").click();
});

Cypress.Commands.add("getDataTestId", (testId) =>
  cy.get(`[data-testid=${testId}]`, { timeout: 15000 })
);
