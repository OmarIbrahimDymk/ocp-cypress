describe("Shakedown Testing", () => {
  let currentDate = "18-Nov-2020";
  beforeEach(() => {
    cy.fixture('tokens/qa.json').then((user) => {
      cy.qaSetToken(user)
      cy.visit("https://eservices.qa.ocp.mofe.gov.bn/");
    })
  });

  describe('User', () => {
    beforeEach(() => {
      cy.visit('https://eservices.qa.ocp.mofe.gov.bn/entities/1/0/registration/businessname')
    });
    it('should be able to upload file', () => {
      cy.contains('Owner Details').click()

      cy.get(':nth-child(6) > .col-12 > .panel-general > :nth-child(2)').within(async () => {
        const file = await cy.fixture("image/Capture.png");
        cy.get('input[type="file"]').attachFile({
          fileContent: file.toString(),
          fileName: "Capture.png",
          mimeType: "image/png",
        });
      })
    });
  });

  it.skip("should test Change company name of public company", () => {
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
