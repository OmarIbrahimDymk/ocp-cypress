/// <reference types="Cypress" />

import { tableInput, tableInput2 } from "../../support/lib/elements";

Cypress.Commands.add("addAsset", (params) => {
  cy.getDataTestId(tableInput.inputField("description", "Assets")).type(
    params.description
  );
  cy.getDataTestId(tableInput.inputField("amount", "Assets")).type(
    params.amount
  );
  cy.getDataTestId(tableInput.addBtn("Assets")).click();
});

Cypress.Commands.add("typeRegistrationNumber", (text, row = 1) => {
  cy.getDataTestId(
    tableInput2.inputField("registrationNumber", row, "Participant-0")
  ).within(() => {
    cy.get("input").type(text, { force: true });
  });
});

Cypress.Commands.add("selectRegistrationNumber", (text) => {
  cy.contains(text, { timeout: 15000 }).click({ force: true });
  cy.get(
    "[data-testid=tableInput2Field-registrationNumber1-Participant-0] > .multiselect__content-wrapper > .multiselect__content > :nth-child(2) > .multiselect__option"
  ).click({ force: true });
});

Cypress.Commands.add("addParticipant", (params) => {
  cy.getDataTestId(
    tableInput2.addBtn(`Participant-${params.venture ?? 0}`)
  ).click();

  if (params.registrationNumber) {
    cy.typeRegistrationNumber(params.registrationNumber);
    cy.selectRegistrationNumber(params.registrationNumber);
  }

  if (params.contractingParty) {
    cy.getDataTestId(
      tableInput2.inputField(
        "contractingParty",
        params.row,
        `Participant-${params.venture ?? 0}`
      )
    )
      .should("be.empty")
      .should("not.have.attr", "disabled");
    cy.getDataTestId(
      tableInput2.inputField(
        "contractingParty",
        params.row,
        `Participant-${params.venture ?? 0}`
      )
    ).type(params.contractingParty, { force: true });
  }

  if (params.interest) {
    cy.getDataTestId(
      tableInput2.inputField(
        "interest",
        params.row,
        `Participant-${params.venture ?? 0}`
      )
    ).type(params.interest, { force: true });
  }

  if (params.dateOfParticipation) {
    cy.getDataTestId(
      tableInput2.inputField(
        "dateOfParticipation",
        params.row,
        `Participant-${params.venture ?? 0}`
      )
    ).within(() => {
      cy.get("input").type(params.dateOfParticipation + "{enter}", {
        force: true,
      });
    });
  }

  if (params.isOperator)
    cy.getDataTestId(
      tableInput2.inputField(
        "isOperator",
        params.row,
        `Participant-${params.venture ?? 0}`
      )
    ).check({ force: true });
});

describe("PT Section D", () => {
  beforeEach(() => {
    cy.fixture("tokens/local.json").then((user) => {
      cy.viewport(1500, 900);
      cy.rdLogin(user);
      cy.goTo("PTSectionD");
    });
  });

  describe("General", () => {
    it("should display section D", () => {
      cy.contains("Section D");
      cy.getDataTestId("noJointVenture").check({ force: true });
      cy.getDataTestId("jointVenture").check({ force: true });
      cy.getDataTestId("addJoinVentures").click();
    });

    it.only("should do quick test", () => {
      cy.getDataTestId("noJointVenture").check({ force: true });
      cy.getDataTestId("jointVenture").check({ force: true });
      cy.getDataTestId("addJoinVentures").click();
      cy.get("#__BVID__462").type("2344", { force: true });
      cy.get("#__BVID__469").type("3455", { force: true });
      cy.get("[data-testid=tableInputField-description-Assets]").type("Asset", {
        force: true,
      });
      cy.get("[data-testid=tableInputField-amount-Assets]").type("4536", {
        force: true,
      });
      cy.get("[data-testid=tableInputAddBtn-Assets]").click({ force: true });
      cy.get("[data-testid=nameOfAgreement0]").type("Nameee", { force: true });
      cy.get("#__BVID__539").type("60", { force: true });
      cy.get("[data-testid=tableInput2Field-amount0-Revenue]").type("2345", {
        force: true,
      });
      cy.get("[data-testid=tableInput2Field-amount1-Revenue]").type("2345", {
        force: true,
      });

      cy.get(
        "#__BVID__546 > :nth-child(1) > .custom-control-label > span"
      ).click({ force: true });

      cy.get("#__BVID__595").type("2341", { force: true });

      cy.get("[data-testid=tableInput2Field-amount0-CIA]").type("3425", {
        force: true,
      });
      cy.get("[data-testid=tableInput2Field-amount1-CIA]").type("3623", {
        force: true,
      });
    });

    it("should display error on submit if user does not check either No Joint Venture or Joint Venture", () => {
      cy.getDataTestId("submitBtn").click();

      cy.contains("Please select and fill in either D1 or D2, or both.");
    });

    it("should enable D1 if No Joint Venture is selected and hide error", () => {
      cy.getDataTestId("noJointVenture").check({ force: true });

      cy.contains("D1");
      cy.contains("Please select and fill in either D1 or D2, or both.").should(
        "not.be.visible"
      );
    });

    it("should enable D2 if Joint Venture is selected and hide error", () => {
      cy.getDataTestId("jointVenture").check({ force: true });

      cy.contains("D2");
      cy.contains("Please select and fill in either D1 or D2, or both.").should(
        "not.be.visible"
      );
    });

    it.skip("should display error message if user does not upload Production Sharing Operation Attachment", () => {});
  });

  describe("No Joint Venture", () => {
    it("should display error message for D1 fields if empty on click Submit", () => {
      cy.getDataTestId("noJointVenture").check({ force: true });

      cy.getDataTestId("submitBtn").click();

      cy.contains("Amount is required");
    });

    it("should be able to add more D1 fields", () => {
      cy.getDataTestId("noJointVenture").check({ force: true });

      cy.addAsset({
        description: "New Asset",
        amount: 100,
      });

      cy.contains("D1 (iii)");
    });

    it("should be able to calculate total D1 fields", async () => {
      const assets = await cy.fixture("assets/assets");

      cy.getDataTestId("noJointVenture").check({ force: true });

      cy.get("#__BVID__314").type("432");
      cy.get("#__BVID__321").type("543");

      assets.forEach(({ description, amount }) => {
        cy.addAsset({
          description,
          amount,
        });
      });

      cy.get("#__BVID__308").should("have.value", 1444);
    });
  });

  describe("Joint Venture", () => {
    beforeEach(() => {
      cy.getDataTestId("jointVenture").check({ force: true });

      cy.getDataTestId("addJoinVentures").click();

      cy.intercept(
        {
          method: "GET",
          url: "/rocbn/api/entities/rd/",
        },
        {
          body: {
            registrationNo: "RC00000018",
            name: "Petronas",
            addresses: [
              {
                address1: "1",
                address2: "2",
                address3: "3",
                district: { name: "Brunei Muara" },
                postalCode: "BE1234",
                country: { name: "Brunei Darussalam" },
              },
            ],
          },
        }
      );
    });

    it("should auto populate filer company registration number and name in every first row", () => {
      cy.getDataTestId(
        tableInput2.inputField("registrationNumber", 0, "Participant-0")
      ).within(() => {
        cy.get(".multiselect__single").should("have.text", "RC00000018");
      });
      cy.getDataTestId(
        tableInput2.inputField("contractingParty", 0, "Participant-0")
      ).should("have.value", "Petronas");

      cy.getDataTestId("addJoinVentures").click({ force: true });

      cy.getDataTestId(
        tableInput2.inputField("registrationNumber", 0, "Participant-1")
      ).within(() => {
        cy.get(".multiselect__single").should("have.text", "RC00000018");
      });
      cy.getDataTestId(
        tableInput2.inputField("contractingParty", 0, "Participant-1")
      ).should("have.value", "Petronas");
    });

    it("should display error message on submit if total participant is less than 2", () => {});

    it("should auto suggest participant registration number if exist in DB and auto populate participant name", () => {
      cy.contains("Yes").click({ force: true });

      cy.getDataTestId(tableInput2.addBtn("Participant-0")).click();

      cy.typeRegistrationNumber("1");

      cy.intercept(
        { method: "GET", url: "/rocbn/api/entities/search?entityType=" },
        {
          body: {
            lists: [
              { registrationNumber: "RC00000001", name: "Stubbed Company 1" },
              { registrationNumber: "RC00000002", name: "Stubbed Company 2" },
              { registrationNumber: "RC00000003", name: "Stubbed Company 3" },
              { registrationNumber: "RC00000004", name: "Stubbed Company 4" },
            ],
          },
        }
      );

      cy.selectRegistrationNumber("RC00000001");

      cy.getDataTestId(
        tableInput2.inputField("contractingParty", 1, "Participant-0")
      ).should("have.value", "Stubbed Company 1");
    });

    it("should let user enter registration manually if entered registration number is not exist in DB", () => {
      cy.getDataTestId(tableInput2.addBtn("Participant-0")).click();

      cy.typeRegistrationNumber("RC00000005");
      cy.selectRegistrationNumber("RC00000005");

      cy.getDataTestId(
        tableInput2.inputField("contractingParty", 1, "Participant-0")
      )
        .should("be.empty")
        .should("not.have.attr", "disabled");
      cy.getDataTestId(
        tableInput2.inputField("contractingParty", 1, "Participant-0")
      ).type("Company 5", { force: true });
    });

    it("should display error message if date of participation is a future date", () => {
      cy.addParticipant({
        row: 0,
        dateOfParticipation: "28-Apr-2022",
      });

      cy.contains("must not be set in the future");
    });

    it("should show error if more than 1 operator is selected", () => {
      cy.addParticipant({
        row: 0,
        interest: 20,
        dateOfParticipation: "28-Apr-2021",
        isOperator: true,
      });

      cy.addParticipant({
        row: 1,
        registrationNumber: "RC00000005",
        contractingParty: "Company 5",
        interest: 80,
        dateOfParticipation: "28-Apr-2021",
        isOperator: true,
      });

      cy.contains("Exactly one operator is allowed.").should("be.visible");
    });

    it("should calculate total participant interest", () => {
      cy.contains("RC00000018");
      cy.addParticipant({
        row: 0,
        interest: 20,
        dateOfParticipation: "28-Apr-2021",
      });

      cy.addParticipant({
        row: 1,
        registrationNumber: "RC00000005",
        contractingParty: "Company 5",
        interest: 80,
        dateOfParticipation: "28-Apr-2021",
      });

      cy.get("#__BVID__486").should("have.value", 100);
    });
  });
});
