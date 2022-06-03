/// <reference types="Cypress" />
import { tableInput2 } from "../../support/lib/elements";
import { IShareholder, ShareholderEnum } from "../../support/lib/shareholder";
import { cloneDeep } from "lodash";

Cypress.Commands.add("enterShareholder", (params: IShareholder) => {
  cy.getDataTestId(
    tableInput2.inputField(ShareholderEnum.IdentityNumber, params.row)
  ).type(params.identityNumber);
  cy.getDataTestId(
    tableInput2.inputField(ShareholderEnum.FullName, params.row)
  ).type(params.fullName);
  if (params.isDirector)
    cy.getDataTestId(
      tableInput2.inputField(ShareholderEnum.IsDirector, params.row)
    ).check({ force: true });
  cy.getDataTestId(
    tableInput2.inputField(ShareholderEnum.SharePercentage, params.row)
  ).type(params.sharePercentage.toString());
  cy.getDataTestId(
    tableInput2.inputField(ShareholderEnum.Capital, params.row)
  ).type(params.capital.toString());
});

describe("PT - Section B", () => {
  beforeEach(() => {
    cy.rdLogin();

    cy.goTo(369, "PTSectionB");
    cy.viewport(1500, 900);
  });

  it("should be able to add shareholder and get correct total % of shares and total capital amount", () => {
    cy.getDataTestId(tableInput2.addBtn()).click();
    cy.enterShareholder({
      identityNumber: "01-010191",
      fullName: "Test Shareholder",
      isDirector: true,
      sharePercentage: 40,
      capital: 1000,
    });

    cy.getDataTestId(tableInput2.addBtn()).click();
    cy.enterShareholder({
      row: 1,
      identityNumber: "01-010191",
      fullName: "Test Shareholder",
      isDirector: true,
      sharePercentage: 50,
      capital: 1500,
    });

    cy.getDataTestId("totalCapitalAmount").should("have.value", "2,500.00");
    cy.getDataTestId("totalSharePercentage").should("have.value", "90.00");
  });

  it("should be able to delete shareholder and get correct total % of shares", () => {
    cy.getDataTestId(tableInput2.addBtn()).click();

    cy.enterShareholder({
      identityNumber: "01-010191",
      fullName: "Test Shareholder",
      isDirector: true,
      sharePercentage: 80,
      capital: 1000,
    });

    cy.getDataTestId(tableInput2.deleteBtn()).click();

    cy.getDataTestId("totalCapitalAmount").should("have.value", "0.00");
  });

  it("should show error message if input is missing value", () => {
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
      identityNumber: "01-010191",
      fullName: "Test Shareholder",
      isDirector: true,
      sharePercentage: 100,
      capital: 1000,
    });

    cy.getDataTestId("submitBtn").click();

    cy.contains("You must enter at least one").should("not.exist");
    cy.contains("The total % of shares must equal 100%").should("not.exist");
  });

  it("should populate shareholders details from IT form if use has submitted IT form for the same YOA as PT form", () => {
    cy.intercept("GET", "/rd/api/incometax/**/**/shareholders", {
      fixture: "responses/stakeholder/itStakeholders",
    });

    cy.getDataTestId(tableInput2.inputField(ShareholderEnum.FullName)).should(
      "have.value",
      "Stubbed Director (From PT)"
    );
  });

  it("should populate shareholder details from ROCBN during the business basis period if shareholders details is not available from IT form", () => {
    cy.intercept("GET", "/rd/api/incometax/**/**/shareholders", {
      fixture: "responses/stakeholder/noStakeholder",
    });
    cy.intercept("GET", "/rocbn/api/entities/rd/**/stakeholders", {
      fixture: "responses/stakeholder/stakeholders",
    });

    cy.getDataTestId(tableInput2.inputField(ShareholderEnum.FullName)).should(
      "have.value",
      "Stubbed Director"
    );
  });

  it("should leave the field empty, user to manually enter shareholder details if shareholders details is not available from ROCBN during the business basis period", () => {
    cy.intercept("GET", "/rocbn/api/entities/rd/**/stakeholders", {
      fixture: "responses/stakeholder/stakeholderWithMissingShare",
    });

    cy.getDataTestId(tableInput2.inputField(ShareholderEnum.SharePercentage))
      .should("be.empty")
      .should("not.have.attr", "disabled");

    cy.getDataTestId(tableInput2.inputField(ShareholderEnum.SharePercentage))
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

  it("should be able to submit", () => {
    cy.fixture("shareholders/getThreeShareholders").then((shareholders) => {
      shareholders.forEach((shareholder) => {
        cy.getDataTestId(tableInput2.addBtn()).click();

        cy.enterShareholder(shareholder);
      });

      cy.getDataTestId("submitBtn").click({ force: true });

      cy.intercept("POST", "/rd/api/petroleumtax/submit", (req) => {
        req.reply("success");
      }).as("submit");

      cy.wait("@submit").then((http) => {
        cy.get("@submit").its("request.body.sectionB").should("include", {
          totalCapital: 4700,
          totalSharePercentage: 100,
        });

        shareholders.forEach((shareholder) => {
          delete shareholder.row;
        });

        cy.get("@submit")
          .its(`request.body.sectionB.shareholderDetails`)
          .should("deep.equal", shareholders);
      });
    });
  });

  it("should be able to add multiple shareholders", () => {
    cy.task("randomShareholders", 5).then((getShareholders: IShareholder[]) => {
      const shareholders: IShareholder[] = getShareholders;

      shareholders.forEach((shareholder: IShareholder) => {
        cy.getDataTestId(tableInput2.addBtn()).click();

        cy.enterShareholder(shareholder);
      });

      let body;
      cy.intercept("POST", "taxform", (req) => {
        req.reply("success");
        body = req.body;
      }).as("submit");

      cy.getDataTestId("submitBtn").click({ force: true });

      cy.wait("@submit").then(() => {
        const totalCapital: number = +shareholders
          .reduce((acc, s) => acc + +s.capital, 0)
          .toFixed(2);

        cy.get("@submit").its("request.body.sectionB").should("include", {
          totalSharePercentage: 100,
          totalCapital: totalCapital,
        });

        shareholders.forEach((shareholder, index) => {
          delete shareholder.row;
          cy.get("@submit")
            .its("request.body.sectionB.shareholderDetails." + index)
            .should("include", shareholder);
        });
      });
    });
  });

  it("should be able to add multiple shareholders and delete some", () => {
    cy.task("randomShareholders", 5).then((getShareholders: IShareholder[]) => {
      cy.intercept("GET", "/rocbn/api/entities/rd/369/stakeholders", {
        fixture: "responses/stakeholder/noStakeholder",
      });

      const shareholders: IShareholder[] = getShareholders;

      shareholders.forEach((shareholder: IShareholder) => {
        cy.getDataTestId(tableInput2.addBtn()).click();

        cy.enterShareholder(shareholder);
      });

      cy.getDataTestId(tableInput2.deleteBtn(1)).click();

      cy.getDataTestId(
        tableInput2.inputField(ShareholderEnum.SharePercentage, 1)
      )
        .clear()
        .type("40");

      cy.getDataTestId("submitBtn").click({ force: true });

      let modifiedShareholders = cloneDeep(shareholders);
      modifiedShareholders.splice(1, 1);
      modifiedShareholders[1].sharePercentage = 40;

      modifiedShareholders.forEach((shareholder) => {
        delete shareholder.row;
        const ic = shareholder.identityNumber.split("");
        ic.splice(2, 0, "-");
        shareholder.identityNumber = ic.join("");
      });

      cy.intercept("POST", "/rd/api/petroleumtax/submit", (req) => {
        const totalCapital: number = +modifiedShareholders
          .reduce((acc, s) => acc + +s.capital, 0)
          .toFixed(2);

        expect(req.body.sectionB).to.include({
          totalCapital: totalCapital,
          totalSharePercentage: 100,
        });

        modifiedShareholders.forEach((shareholder, index) => {
          expect(req.body.sectionB.shareholderDetails[index]).to.include(
            shareholder
          );
        });

        req.reply("success");
      });
    });
  });

  it("should post correct view model", () => {
    cy.getDataTestId(tableInput2.addBtn()).click();
    cy.enterShareholder({
      row: 0,
      identityNumber: "01010191",
      fullName: "Shareholder A",
      isDirector: true,
      sharePercentage: 40,
      capital: 25000,
    });

    cy.getDataTestId(tableInput2.addBtn()).click();
    cy.enterShareholder({
      row: 1,
      identityNumber: "01010192",
      fullName: "Shareholder B",
      isDirector: true,
      sharePercentage: 60,
      capital: 45000,
    });

    cy.getDataTestId("submitBtn").click({ force: true });

    cy.intercept("POST", "/rd/api/petroleumtax/submit", (req) => {
      req.reply("success");
    }).as("submit");

    cy.wait("@submit").then((http) => {
      cy.get("@submit")
        .its("request.body.sectionB")
        .should("deep.include.all.keys", [
          "totalCapital",
          "totalSharePercentage",
        ]);
      cy.get("@submit")
        .its("request.body.sectionB.shareholderDetails[0]")
        .should("deep.include.all.keys", ["fullName"]);
    });
  });
});

describe("PT - Section B - Backend Validation", () => {
  let request: any = {};
  const requestObj: any = {
    method: "POST",
    url: "http://localhost:5885/api/PetroleumTax",
    failOnStatusCode: false,
  };

  beforeEach(() => {
    cy.rdLogin();
    cy.fixture("requests/petroleum-tax/PetroleumTaxMain").then((req) => {
      request.main = req;
    });
    cy.fixture("requests/petroleum-tax/PetroleumTaxSectionB").then((req) => {
      request.sectionB = req;
    });
  });

  context("Shareholder lists", () => {
    it("Should return error when no shareholder is listed", () => {
      // Arrange
      let body = { ...request.main, ...request.sectionB };
      body.sectionB.shareholderDetails = [];

      // Act
      cy.request({
        ...requestObj,
        body,
      }).then((res) => {
        // Assert
        expect(res.status).to.equal(400);
        expect(res.body.errors["SectionB.ShareholderDetails"]).to.include(
          "Shareholder must be at least 1"
        );
      });
    });

    it("Should return success when at least 1 shareholder is listed", () => {
      // Arrange
      let body = { ...request.main, ...request.sectionB };

      // Act
      cy.request({
        ...requestObj,
        body,
      }).then((res) => {
        // Assert
        cy.log(JSON.stringify(res));
        expect(res.status).to.equal(200);
      });
    });

    it("Should return error when all required fields are empty", () => {
      // Arrange
      let body = { ...request.main, ...request.sectionB };
      body.sectionB.shareholderDetails[0].identityNumber = "";
      body.sectionB.shareholderDetails[0].fullName = "";

      // Act
      cy.request({
        ...requestObj,
        body,
      }).then((req) => {
        // Assert
        expect(req.status).to.equal(400);
        expect(
          req.body.errors["SectionB.ShareholderDetails[0].IdentityNumber"]
        ).to.include("'Registration Number' must not be empty.");
        expect(
          req.body.errors["SectionB.ShareholderDetails[0].FullName"]
        ).to.include("'Name of Shareholder' must not be empty.");
      });
    });

    it("Should return error when all required fields are null", () => {
      // Arrange
      let body = { ...request.main, ...request.sectionB };
      body.sectionB.shareholderDetails[0].isDirector = null;
      body.sectionB.shareholderDetails[0].sharePercentage = null;
      body.sectionB.shareholderDetails[0].capital = null;

      // Act
      cy.request({
        ...requestObj,
        body,
      }).then((req) => {
        // Assert
        expect(req.status).to.equal(400);
      });
    });

    it("Should return error when all numeric fields are in wrong format (X{1:11}.X{1:2})", () => {
      // Arrange
      let body = { ...request.main, ...request.sectionB };
      body.sectionB.shareholderDetails[0].sharePercentage = 1.123;
      body.sectionB.shareholderDetails[0].capital = 123456789012.12;

      // Act
      cy.request({
        ...requestObj,
        body,
      }).then((req) => {
        // Assert
        expect(req.status).to.equal(400);
        expect(
          req.body.errors["SectionB.ShareholderDetails[0].SharePercentage"]
        ).to.include("% of Share must have X{1:11}.X{1:2} format.");
        expect(
          req.body.errors["SectionB.ShareholderDetails[0].Capital"]
        ).to.include("Capital must have X{1:11}.X{1:2} format.");
      });
    });
  });

  context("Total Share percentage", () => {
    it("should return error, when total shares percentage is not equal to 100", () => {
      // Arrange
      let body = { ...request.main, ...request.sectionB };
      body.sectionB.totalSharePercentage = 10;

      // Act
      cy.request({
        ...requestObj,
        body,
      }).then((res) => {
        // Assert
        expect(res.status).to.equal(400);
        expect(res.body.errors["SectionB"]).to.include(
          "Total percentage of Shares must equal to 100%"
        );
      });
    });

    it("should return error, when individual sum of share does not sum up to 100 even total share is 100", () => {
      // Arrange
      let body = { ...request.main, ...request.sectionB };
      body.sectionB.totalSharePercentage = 100;
      body.sectionB.shareholderDetails = [
        {
          id: 1,
          petroleumTaxShareholderId: 0,
          isIndividual: true,
          isResident: true,
          identityNumber: "string",
          fullName: "string",
          isDirector: true,
          sharePercentage: 40,
          capital: 30000,
        },
        {
          id: 2,
          petroleumTaxShareholderId: 0,
          isIndividual: true,
          isResident: true,
          identityNumber: "string",
          fullName: "string",
          isDirector: true,
          sharePercentage: 30,
          capital: 30000,
        },
      ];

      // Act
      cy.request({
        ...requestObj,
        body,
      }).then((res) => {
        // Assert
        expect(res.status).to.equal(400);
        expect(res.body.errors["SectionB"]).to.include(
          "Total percentage of Shares must equal to 100%"
        );
      });
    });

    it("should return error, when total shares percentage is equal to null", () => {
      // Arrange
      let body = { ...request.main, ...request.sectionB };
      body.sectionB.totalSharePercentage = null;

      // Act
      cy.request({
        ...requestObj,
        body,
      }).then((res) => {
        // Assert
        expect(res.status).to.equal(400);
        expect(res.body.errors["SectionB"]).to.include(
          "Total percentage of Shares must equal to 100%"
        );
      });
    });

    it("should return success, when total shares percentage is equal to 100", () => {
      // Arrange
      let body = { ...request.main, ...request.sectionB };
      body.sectionB.totalSharePercentage = 100;

      // Act
      cy.request({
        ...requestObj,
        body,
      }).then((res) => {
        // Assert
        expect(res.status).to.equal(200);
        // expect(res.body).not.to.include("errors");
      });
    });
  });
});
