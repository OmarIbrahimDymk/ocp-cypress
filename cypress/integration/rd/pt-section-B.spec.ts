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
    cy.fixture("tokens/local.json").then((user) => {
      cy.rdLogin(user);
      cy.goTo("PTSectionB");
      cy.intercept("/.well-known/openid-configuration", "success");
    });
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

    cy.getDataTestId("totalCapitalAmount").should("have.value", "2500");
    cy.getDataTestId("totalSharePercentage").should("have.value", "90");
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

    cy.getDataTestId("totalCapitalAmount").should("have.value", "0");
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
              fullName: "Stubbed Director",
              isDirector: true,
              sharePercentage: 40,
              shareCapital: 2000,
            },
          ],
        },
      }
    );
    cy.getDataTestId(tableInput2.inputField(ShareholderEnum.FullName)).should(
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
              fullName: "Stubbed Director",
              isDirector: true,
              sharePercentage: 40,
              shareCapital: 2000,
            },
          ],
        },
      }
    );

    cy.getDataTestId(tableInput2.inputField(ShareholderEnum.FullName)).should(
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
              fullName: "Stubbed Director",
              isDirector: true,
              shareCapital: 2000,
            },
          ],
        },
      }
    );

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

  it("should be able to submit", async () => {
    const shareholders = await cy.fixture("shareholders/getThreeShareholders");

    shareholders.forEach((shareholder) => {
      cy.getDataTestId(tableInput2.addBtn()).click();

      cy.enterShareholder(shareholder);
    });

    cy.getDataTestId("submitBtn").click({ force: true });

    cy.intercept("POST", "/taxform", (req) => {
      expect(req.body.sectionB).to.include({
        totalCapital: 4700,
        totalSharePercentage: 100,
      });

      shareholders.forEach((shareholder, index) => {
        delete shareholder.row;
        expect(req.body.sectionB.shareholders[index]).to.include(shareholder);
      });

      req.reply("success");
    });
  });

  it("should be able to add multiple shareholders", () => {
    cy.task("randomShareholders", 5).then((getShareholders: IShareholder[]) => {
      const shareholders: IShareholder[] = getShareholders;

      shareholders.forEach((shareholder: IShareholder) => {
        cy.getDataTestId(tableInput2.addBtn()).click();

        cy.enterShareholder(shareholder);
      });

      cy.getDataTestId("submitBtn").click({ force: true });

      cy.intercept("POST", "/taxform", (req) => {
        const totalCapital: number = +shareholders
          .reduce((acc, s) => acc + +s.capital, 0)
          .toFixed(2);

        expect(req.body.sectionB).to.include({
          totalCapital: totalCapital,
          totalSharePercentage: 100,
        });

        shareholders.forEach((shareholder, index) => {
          delete shareholder.row;
          const ic = shareholder.identityNumber.split("");
          ic.splice(2, 0, "-");
          shareholder.identityNumber = ic.join("");
          expect(req.body.sectionB.shareholders[index]).to.include(shareholder);
        });

        req.reply("success");
      });
    });
  });

  it("should be able to add multiple shareholders and delete some", () => {
    cy.task("randomShareholders", 5).then((getShareholders: IShareholder[]) => {
      cy.intercept(
        {
          method: "GET",
          url: "/rocbn/api/entities/rd/369/stakeholders",
        },
        {
          body: {
            lists: [],
          },
        }
      );

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

      cy.intercept("POST", "/taxform", (req) => {
        const totalCapital: number = +modifiedShareholders
          .reduce((acc, s) => acc + +s.capital, 0)
          .toFixed(2);

        expect(req.body.sectionB).to.include({
          totalCapital: totalCapital,
          totalSharePercentage: 100,
        });

        modifiedShareholders.forEach((shareholder, index) => {
          expect(req.body.sectionB.shareholders[index]).to.include(shareholder);
        });

        req.reply("success");
      });
    });
  });
});
