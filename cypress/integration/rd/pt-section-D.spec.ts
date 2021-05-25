/// <reference types="Cypress" />

import { tableInput, tableInput2 } from "../../support/lib/elements";

Cypress.Commands.add("addAsset", (params) => {
  cy.getDataTestId(
    tableInput.inputField("name", collectionEnum.GrossProceed)
  ).type(params.name);
  cy.getDataTestId(
    tableInput.inputField("amount", collectionEnum.GrossProceed)
  ).type(params.amount);
  cy.getDataTestId(tableInput.addBtn(collectionEnum.GrossProceed)).click();
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
  if (!params.skipAddBtn) {
    cy.getDataTestId(
      tableInput2.addBtn(`Participant-${params.venture ?? 0}`)
    ).click();
  }

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
        "participationDate",
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

enum collectionEnum {
  Revenue = "Revenue",
  CIA = "CIA",
  GrossProceed = "GrossProceed",
}

describe("PT Section D", () => {
  beforeEach(() => {
    cy.intercept("GET", "/rocbn/api/entities/rd/*", {
      fixture: "responses/entities",
    });

    cy.intercept("GET", "/rocbn/api/entities/search?entityType=*", {
      fixture: "responses/entitiesSearch",
    });

    cy.rdLogin();

    cy.viewport(1500, 900);
    cy.goTo("PTSectionD");
  });

  context("General", () => {
    it("should display section D", () => {
      cy.contains("Section D");
      cy.getDataTestId("noJointVenture").check({ force: true });
      cy.getDataTestId("jointVenture").check({ force: true });
      cy.getDataTestId("addJoinVentures").click();
    });

    it("should do quick test", () => {
      cy.getDataTestId("noJointVenture").check({ force: true });
      cy.getDataTestId("jointVenture").check({ force: true });
      cy.getDataTestId("addJoinVentures").click();
      cy.getDataTestId("grossProceed0").type("2344", { force: true });
      cy.getDataTestId("grossProceed1").type("3455", { force: true });
      cy.getDataTestId(
        tableInput.inputField("name", collectionEnum.GrossProceed)
      ).type("Asset", {
        force: true,
      });
      cy.getDataTestId(
        tableInput.inputField("amount", collectionEnum.GrossProceed)
      ).type("4536", {
        force: true,
      });
      cy.getDataTestId(tableInput.addBtn(collectionEnum.GrossProceed)).click({
        force: true,
      });
      cy.getDataTestId("ringFenced-radio0").within(() => {
        cy.contains("Yes").click();
      });
      cy.getDataTestId("agreementName0").type("Nameee", { force: true });
      cy.getDataTestId("filerShare0").type("60", { force: true });
      cy.getDataTestId(
        tableInput2.inputField("amount", 0, collectionEnum.Revenue)
      ).type("2345", {
        force: true,
      });
      cy.getDataTestId(
        tableInput2.inputField("amount", 1, collectionEnum.Revenue)
      ).type("2345", {
        force: true,
      });

      cy.getDataTestId("CIA-radio0").within(() => {
        cy.contains("Yes").click();
      });

      cy.getDataTestId("interest0").type("2341", { force: true });

      cy.getDataTestId(
        tableInput2.inputField("amount", 0, collectionEnum.CIA)
      ).type("3425", {
        force: true,
      });
      cy.getDataTestId(
        tableInput2.inputField("amount", 1, collectionEnum.CIA)
      ).type("3623", {
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

  context("No Joint Venture", () => {
    it("should display error message for D1 fields if empty on click Submit", () => {
      cy.getDataTestId("noJointVenture").check({ force: true });

      cy.getDataTestId("submitBtn").click();

      cy.contains("Amount is required");
    });

    it("should be able to add more D1 fields", () => {
      cy.getDataTestId("noJointVenture").check({ force: true });

      cy.addAsset({
        name: "New Asset",
        amount: 100,
      });

      cy.contains("D1 (iii)");
    });

    it("should be able to calculate total D1 fields", async () => {
      const assets = await cy.fixture("assets/assets");

      cy.getDataTestId("noJointVenture").check({ force: true });

      cy.getDataTestId("grossProceed0").type("432");
      cy.getDataTestId("grossProceed1").type("543");

      assets.forEach(({ name, amount }) => {
        cy.addAsset({
          name,
          amount,
        });
      });

      cy.getDataTestId("grossProceedsTotal").should("have.value", "1,444.00");
    });

    it("should be able to submit", () => {
      cy.fixture("assets/assets").then((assets) => {
        cy.getDataTestId("noJointVenture").check({ force: true });

        cy.getDataTestId("grossProceed0").type("432");
        cy.getDataTestId("grossProceed1").type("543");

        assets.forEach(({ name, amount }) => {
          cy.addAsset({
            name,
            amount,
          });
        });

        cy.getDataTestId("submitBtn").click({ force: true });

        const expectedGrossProceeds = [
          { name: "Crude Oil Sales", amount: 432 },
          { name: "Natural Gas Sales", amount: 543 },
          { name: "Asset 1", amount: 123 },
          { name: "Asset 2", amount: 312 },
          { name: "Asset 3", amount: 34 },
        ];

        cy.intercept("POST", "/taxform", (req) => {
          expect(req.body.sectionD).to.include({
            isNoJointVenture: true,
            isJointVenture: false,
            grossProceedsTotal: 1444,
            grandTotalRevenue: 1444,
          });

          req.body.sectionD.grossProceeds.forEach((grossProceed, index) => {
            expect(grossProceed).to.include(expectedGrossProceeds[index]);
          });

          expect(req.body.sectionD.ventures).to.deep.equal([]);

          req.reply("success");
        });
      });
    });
  });

  context("Joint Venture", () => {
    beforeEach(() => {
      cy.getDataTestId("jointVenture").check({ force: true });

      cy.getDataTestId("addJoinVentures").click();
    });

    context("Participants", () => {
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

        cy.getDataTestId("totalInterest0").should("have.value", "100.00");
      });
    });

    context("Revenue", () => {
      it("should display agreement name and filer name", () => {
        cy.getDataTestId("agreementName0").type("My Agreement", {
          force: true,
        });
        cy.getDataTestId("agreementNameShare0").should((name) => {
          expect(name).to.contain("My Agreement Share");
        });
        cy.getDataTestId("filerCompanyName0").should((name) => {
          expect(name).to.contain("Petronas Share");
        });
      });

      it("should display error message if share is not between 1 and 100", () => {
        cy.getDataTestId("filerShare0").type("101{enter}");
        cy.contains("Share must be between 1 and 100").should("be.visible");
      });

      it("should auto calculate filer share", () => {
        cy.getDataTestId("filerShare0").type("50");
        cy.getDataTestId(
          tableInput2.inputField("amount", 0, collectionEnum.Revenue)
        ).type("1000");
        cy.getDataTestId(
          tableInput2.inputField("share", 0, collectionEnum.Revenue)
        ).should("have.value", "500.00");
      });

      it("should be able to add more gross proceed and auto calculate total filer share", () => {
        cy.getDataTestId("filerShare0").type("50");
        cy.getDataTestId(
          tableInput2.inputField("amount", 0, collectionEnum.Revenue)
        ).type("1000");
        cy.getDataTestId(
          tableInput2.inputField("amount", 1, collectionEnum.Revenue)
        ).type("2000");

        cy.getDataTestId(tableInput2.addBtn(collectionEnum.Revenue)).click();
        cy.getDataTestId(
          tableInput2.inputField("name", 2, collectionEnum.Revenue)
        ).type("Soil Sales");
        cy.getDataTestId(
          tableInput2.inputField("amount", 2, collectionEnum.Revenue)
        ).type("3000");

        cy.getDataTestId("totalFilerShare0").should("have.value", "3,000.00");
      });
    });

    context("Carried Interest Arrangement", () => {
      it("should display table if yes is selected", () => {
        cy.getDataTestId("interest0").should("not.exist");

        cy.getDataTestId("CIA-radio0").within(() => {
          cy.contains("Yes").click();
        });

        cy.getDataTestId("interest0").should("be.visible");
      });

      it("should be able to add gross proceed and auto calculate total interest", () => {
        cy.getDataTestId("CIA-radio0").within(() => {
          cy.contains("Yes").click();
        });

        cy.getDataTestId(
          tableInput2.inputField("amount", 0, collectionEnum.CIA)
        ).type("1000");
        cy.getDataTestId(
          tableInput2.inputField("amount", 1, collectionEnum.CIA)
        ).type("2000");

        cy.getDataTestId(tableInput2.addBtn(collectionEnum.CIA)).click();
        cy.getDataTestId(
          tableInput2.inputField("name", 2, collectionEnum.CIA)
        ).type("Soil Sales");
        cy.getDataTestId(
          tableInput2.inputField("amount", 2, collectionEnum.CIA)
        ).type("3000");

        cy.getDataTestId("totalCIA0").should("have.value", "6,000.00");
      });
    });

    it("should be able to auto calculate venture total", () => {
      cy.getDataTestId("filerShare0").type("50");

      cy.getDataTestId(
        tableInput2.inputField("amount", 0, collectionEnum.Revenue)
      ).type("1000");
      cy.getDataTestId(
        tableInput2.inputField("amount", 1, collectionEnum.Revenue)
      ).type("2000");

      cy.getDataTestId(tableInput2.addBtn(collectionEnum.Revenue)).click();
      cy.getDataTestId(
        tableInput2.inputField("name", 2, collectionEnum.Revenue)
      ).type("Soil Sales");
      cy.getDataTestId(
        tableInput2.inputField("amount", 2, collectionEnum.Revenue)
      ).type("3000");

      cy.getDataTestId("CIA-radio0").within(() => {
        cy.contains("Yes").click();
      });

      cy.getDataTestId("interest0").type("50");

      cy.getDataTestId(
        tableInput2.inputField("amount", 0, collectionEnum.CIA)
      ).type("1000");
      cy.getDataTestId(
        tableInput2.inputField("amount", 1, collectionEnum.CIA)
      ).type("2000");

      cy.getDataTestId(tableInput2.addBtn(collectionEnum.CIA)).click();
      cy.getDataTestId(
        tableInput2.inputField("name", 2, collectionEnum.CIA)
      ).type("Soil Sales");
      cy.getDataTestId(
        tableInput2.inputField("amount", 2, collectionEnum.CIA)
      ).type("3000");

      cy.getDataTestId("ventureTotal").should("have.value", "9,000.00");
      cy.getDataTestId("grandTotal").should("have.value", "9,000.00");
    });

    it("should be able to submit", () => {
      cy.getDataTestId("agreementName0").type("My Agreement", { force: true });

      cy.contains("RC00000018");
      cy.addParticipant({
        row: 0,
        interest: 20,
        dateOfParticipation: "28-Apr-2021",
        isOperator: true,
        skipAddBtn: true,
      });

      cy.addParticipant({
        row: 1,
        registrationNumber: "RC00000005",
        contractingParty: "Company 5",
        interest: 80,
        dateOfParticipation: "28-Apr-2021",
      });

      cy.getDataTestId("filerShare0").type("50");

      cy.getDataTestId(
        tableInput2.inputField("amount", 0, collectionEnum.Revenue)
      ).type("1000");
      cy.getDataTestId(
        tableInput2.inputField("amount", 1, collectionEnum.Revenue)
      ).type("2000");

      cy.getDataTestId(tableInput2.addBtn(collectionEnum.Revenue)).click();
      cy.getDataTestId(
        tableInput2.inputField("name", 2, collectionEnum.Revenue)
      ).type("Soil Sales");
      cy.getDataTestId(
        tableInput2.inputField("amount", 2, collectionEnum.Revenue)
      ).type("3000");

      cy.getDataTestId("CIA-radio0").within(() => {
        cy.contains("Yes").click();
      });

      cy.getDataTestId("interest0").type("50");

      cy.getDataTestId(
        tableInput2.inputField("amount", 0, collectionEnum.CIA)
      ).type("1000");
      cy.getDataTestId(
        tableInput2.inputField("amount", 1, collectionEnum.CIA)
      ).type("2000");

      cy.getDataTestId(tableInput2.addBtn(collectionEnum.CIA)).click();
      cy.getDataTestId(
        tableInput2.inputField("name", 2, collectionEnum.CIA)
      ).type("Soil Sales");
      cy.getDataTestId(
        tableInput2.inputField("amount", 2, collectionEnum.CIA)
      ).type("3000");

      cy.getDataTestId("submitBtn").click({ force: true });

      cy.intercept("POST", "/taxform", (req) => {
        req.reply("success");
      });
    });
  });
});
