xcontext("Shakedown Testing", () => {
  let currentDate = "18-Nov-2020";
  beforeEach(() => {
    cy.visit("https://qa.ocp.mofe.gov.bn/");
    cy.get("button").contains("Login").click();
    cy.get("#Username").type("01047431");
    cy.get("#Password").type("!Password1{enter}");
    cy.get(
      ".wrapper-entity-list-table > :nth-child(1) > .text-center > .btn"
    ).click();
    cy.get(':nth-child(8) > [aria-colindex="3"]').click();
    cy.get("#__BVID__156__BV_toggle_").click();
  });
  it("should test Change company name of public company", () => {
    // Select change company name application
    cy.get(
      "#__BVID__156 > .dropdown-menu > .row > :nth-child(2) > :nth-child(5) > .dropdown-item"
    ).click();

    cy.get(
      "#__BVID__270 > .bv-no-focus-ring > .mx-datepicker > .mx-input-wrapper > .mx-input"
    ).type(`${currentDate}`);

    // dummy click
    cy.get(":nth-child(4) > :nth-child(1) > .label").click();

    // Resolution Date
    cy.get(
      "#__BVID__279 > .bv-no-focus-ring > .mx-datepicker > .mx-input-wrapper > .mx-input"
    ).type(currentDate);

    // dummy click
    cy.get(":nth-child(4) > :nth-child(1) > .label").click();

    // upload resolution
    cy.get(
      ":nth-child(2) > .table-gen > tr > :nth-child(2) > :nth-child(1) > div > .btn"
    ).click();
  });
});
