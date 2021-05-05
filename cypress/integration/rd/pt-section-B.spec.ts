/// <reference types="Cypress" />

import { tableInput2 } from "../../support/lib/elements";

const fields = {
  icNumber: "identityNumber",
  name: "fullName",
  isDirector: "isDirector",
  sharePercentage: "sharePercentage",
  capitalAmount: "capital",
};

Cypress.Commands.add("enterShareholder", (params) => {
  cy.getDataTestId(tableInput2.inputField(fields.icNumber, params.row)).type(
    params.icNumber
  );
  cy.getDataTestId(tableInput2.inputField(fields.name, params.row)).type(
    params.name
  );
  if (params.check)
    cy.getDataTestId(
      tableInput2.inputField(fields.isDirector, params.row)
    ).check({ force: true });
  cy.getDataTestId(
    tableInput2.inputField(fields.sharePercentage, params.row)
  ).type(params.sharePercentage);
  cy.getDataTestId(
    tableInput2.inputField(fields.capitalAmount, params.row)
  ).type(params.capitalAmount);
});

describe("PT - Section B", () => {
  beforeEach(() => {
    cy.fixture("tokens/local.json").then((user) => {
      cy.rdLogin(user);
      cy.goTo("PTSectionB");
    });
  });

  it("should be able to add shareholder and get correct total % of shares and total capital amount", () => {
    cy.getDataTestId(tableInput2.addBtn()).click();
    cy.enterShareholder({
      icNumber: "01-010191",
      name: "Test Shareholder",
      check: true,
      sharePercentage: 40,
      capitalAmount: 1000,
    });

    cy.getDataTestId(tableInput2.addBtn()).click();
    cy.enterShareholder({
      row: 1,
      icNumber: "01-010191",
      name: "Test Shareholder",
      check: true,
      sharePercentage: 50,
      capitalAmount: 1500,
    });

    cy.getDataTestId("totalCapitalAmount").should("have.value", "2500");
    cy.getDataTestId("totalSharePercentage").should("have.value", "90");
  });

  it("should be able to delete shareholder and get correct total % of shares", () => {
    cy.getDataTestId(tableInput2.addBtn()).click();

    cy.enterShareholder({
      icNumber: "01-010191",
      name: "Test Shareholder",
      check: true,
      sharePercentage: 80,
      capitalAmount: 1000,
    });

    cy.getDataTestId(tableInput2.deleteBtn()).click();

    cy.getDataTestId("totalCapitalAmount").should("have.value", "0");
  });

  it.only("should show error message if input is missing value", () => {
    cy.getDataTestId(tableInput2.addBtn()).click();

    cy.getDataTestId("submitBtn").click();

    cy.contains("Identity Number is required");
    cy.contains("Full Name is required");
    cy.contains("% of shares is required");
    cy.contains("Capital is required");
  });

  it("should hide summary message if at least 1 shareholder is added and total % of share is equal 100", () => {
    cy.getDataTestId(tableInput2.addBtn()).click();

    cy.enterShareholder({
      icNumber: "01-010191",
      name: "Test Shareholder",
      check: true,
      sharePercentage: 100,
      capitalAmount: 1000,
    });

    cy.getDataTestId("submitBtn").click();

    cy.contains("You must enter at least one").should("not.exist");
    cy.contains("The total % of shares must equal 100%").should("not.exist");
  });

  it("should populate shareholders details from IT form if use has submitted IT form for the same YOA as PT form", () => {
    cy.intercept(
      {
        method: "GET",
        url: "/rocbn/api/entities/rd/369/stakeholders",
      },
      {
        body: {
          lists: [
            {
              identifierNumber: "N/A",
              name: "Stubbed Director",
              isDirector: true,
              sharePercentage: 40,
              shareCapital: 2000,
            },
          ],
        },
      }
    );
    cy.getDataTestId(tableInput2.inputField(fields.name)).should(
      "have.value",
      "Stubbed Director"
    );
  });

  it("should populate shareholder details from ROCBN during the business basis period if shareholders details is not available from IT form", () => {
    cy.intercept(
      {
        method: "GET",
        url: "/rocbn/api/entities/rd/369/stakeholders",
      },
      {
        body: {
          lists: [
            {
              identifierNumber: "N/A",
              name: "Stubbed Director",
              isDirector: true,
              sharePercentage: 40,
              shareCapital: 2000,
            },
          ],
        },
      }
    );

    cy.getDataTestId(tableInput2.inputField(fields.name)).should(
      "have.value",
      "Stubbed Director"
    );
  });

  it("should leave the field empty, user to manually enter shareholder details if shareholders details is not available from ROCBN during the business basis period", () => {
    cy.intercept(
      {
        method: "GET",
        url: "/rocbn/api/entities/rd/369/stakeholders",
      },
      {
        body: {
          lists: [
            {
              identifierNumber: "N/A",
              name: "Stubbed Director",
              isDirector: true,
              shareCapital: 2000,
            },
          ],
        },
      }
    );

    cy.getDataTestId(tableInput2.inputField(fields.sharePercentage))
      .should("be.empty")
      .should("not.have.attr", "disabled");

    cy.getDataTestId(tableInput2.inputField(fields.sharePercentage))
      .type("40")
      .should("have.value", "40");
  });

  it("should display error message if user does not enter at least one shareholder", () => {
    cy.getDataTestId("submitBtn").click();

    cy.contains("You must enter at least one");
  });

  it("should display error message if Total % of share is not equal 100%", () => {
    cy.getDataTestId("submitBtn").click();

    cy.contains("The total % of shares must equal 100%");
  });
});
