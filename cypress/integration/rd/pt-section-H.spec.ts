/// <reference types="Cypress" />
import { tableInput, tableInput2 } from "../../support/lib/elements";

import { IFillH1, IPaidTaxDetails } from "../../support/lib/sectionH";

Cypress.Commands.add("fillH1", (params: IFillH1 = {}) => {
  cy.wait("@getEntities", { timeout: 10000 });
  cy.get("#__BVID__493").select(params.currency ?? "BND", { force: true });
  cy.getDataTestId("noJointVenture").check({ force: true });
  cy.getDataTestId("grossProceed0").type(params.d3 ?? "1500", {
    force: true,
  });

  cy.get(".table-gen > :nth-child(3) > :nth-child(5)").within(() => {
    cy.get("input").type(params.g2 ?? "1000", { force: true });
  });
});

Cypress.Commands.add("enterPaidTax", (params: IPaidTaxDetails) => {
  cy.getDataTestId(tableInput2.addBtn("h5")).click({ force: true });
  cy.getDataTestId(
    tableInput2.inputField("paymentDate", params.row, "h5")
  ).within(() => {
    cy.get("input").type(params.paymentDate + "{enter}", { force: true });
  });
  cy.getDataTestId(
    tableInput2.inputField("paymentMethod", params.row, "h5")
  ).type(params.paymentMethod, {
    force: true,
  });
  cy.getDataTestId(tableInput2.inputField("bankName", params.row, "h5")).type(
    params.bankName,
    {
      force: true,
    }
  );
  cy.getDataTestId(tableInput2.inputField("amount", params.row, "h5")).type(
    params.amount,
    {
      force: true,
    }
  );
  cy.getDataTestId(
    tableInput2.inputField("currencyType", params.row, "h5")
  ).type(params.currencyType, {
    force: true,
  });
  cy.getDataTestId(
    tableInput2.inputField("exchangeRate", params.row, "h5")
  ).type(params.exchangeRate, {
    force: true,
  });
  cy.getDataTestId(tableInput2.inputField("amountBND", params.row, "h5")).type(
    params.amountBND,
    {
      force: true,
    }
  );
});

describe("PT Section H", () => {
  beforeEach(() => {
    cy.intercept("GET", "/rocbn/api/entities/rd/*", {
      fixture: "responses/entities",
    });

    cy.rdLogin();

    cy.goTo("PTSectionA", "PTSectionD", "PTSectionG", "PTSectionH");
  });

  it.skip("should display section H", () => {
    cy.viewport(1500, 900);
    cy.goTo("PTSectionH");
  });

  context("h1", () => {
    it("should display G5 x 0.55 if D3 is greater than 0", () => {
      cy.fillH1();

      cy.getDataTestId("h1").should("have.value", "550.00");
    });

    it("should display 0 if D3 id less than 0", () => {
      cy.fillH1({ d3: "-1500" });

      cy.getDataTestId("h1").should("have.value", "0.00");
    });
  });

  context("h2", () => {
    it("should auto calculate H2 (i)", () => {
      cy.getDataTestId("h2").type("100", { force: true }).blur();
      cy.getDataTestId("h2i").should("have.value", "55.00");
    });
  });

  context("h3", () => {
    it("should display error message if user enter H3 while H2 fields are empty", () => {
      cy.getDataTestId("h3").type("500", { force: true });
      cy.contains(
        "If you are claiming Double Taxation Agreement or Commonwealth Tax Reductions & Credits you must declare your foreign income"
      ).should("be.visible");
    });

    it("should display H3 max amount where H3 max amount must be the less amount from either H2(i) or H2(ii)", () => {
      cy.getDataTestId("h2").type("100", { force: true });
      cy.getDataTestId("h2ii").type("30", { force: true });
      cy.getDataTestId("h3").type("60", { force: true });
      cy.contains(
        "H3 max amount must be the less amount from either H2(i) or H2(ii)"
      ).should("be.visible");
    });
  });

  context("h4", () => {
    it("should auto some h1 + h2 + h3", () => {
      cy.fillH1();
      cy.getDataTestId("h2").type("1000", { force: true });
      cy.getDataTestId("h2ii").type("100", { force: true });
      cy.getDataTestId("h3").type("50", { force: true });
      cy.getDataTestId("h4").should("have.value", "1,600.00");
    });
    it("should equal 0 if h1 is 0", () => {
      cy.fillH1({ d3: "-1500" });
      cy.getDataTestId("h2").type("1000", { force: true });
      cy.getDataTestId("h2ii").type("100", { force: true });
      cy.getDataTestId("h3").type("50", { force: true });
      cy.getDataTestId("h4").should("have.value", "0.00");
    });
  });

  context("h5", () => {
    it("should editable if USD is selected", () => {
      cy.fillH1({ currency: "USD" });
      cy.getDataTestId("h5").as("h5");
      cy.get("@h5").should("not.have.attr", "disabled");
      cy.get("@h5").type("5000", { force: true }).blur();
      cy.get("@h5").should("have.value", "5,000.00");
    });

    it("should be disabled if BND is selected", () => {
      cy.fillH1({ currency: "BND" });
      cy.getDataTestId("h5").as("h5");
      cy.get("@h5").should("have.attr", "disabled");
    });

    it("should auto sum sub BND amount if BND is selected", () => {
      cy.fillH1({ currency: "BND" });
      cy.contains("Yes").click({ force: true });

      cy.enterPaidTax({
        row: 0,
        paymentDate: "28-Apr-2021",
        paymentMethod: "Card",
        bankName: "BIBD",
        amount: "1000",
        currencyType: "BND",
        exchangeRate: "1.20",
        amountBND: "1400",
      });

      cy.enterPaidTax({
        row: 1,
        paymentDate: "24-Apr-2021",
        paymentMethod: "Cash",
        bankName: "Baiduri",
        amount: "1000",
        currencyType: "BND",
        exchangeRate: "1.20",
        amountBND: "4000",
      });

      cy.getDataTestId("h5").should("have.value", "5,400.00");
    });
  });

  context("h6", () => {
    it("should auto sum h4 + h5", () => {
      cy.fillH1();
      cy.getDataTestId("h2").type("1000", { force: true });
      cy.getDataTestId("h2ii").type("100", { force: true });
      cy.getDataTestId("h3").type("50", { force: true });
      cy.getDataTestId("h4").should("have.value", "1,600.00");

      cy.contains("Yes").click({ force: true });

      cy.enterPaidTax({
        row: 0,
        paymentDate: "28-Apr-2021",
        paymentMethod: "Card",
        bankName: "BIBD",
        amount: "1000",
        currencyType: "BND",
        exchangeRate: "1.20",
        amountBND: "1400",
      });

      cy.enterPaidTax({
        row: 1,
        paymentDate: "24-Apr-2021",
        paymentMethod: "Cash",
        bankName: "Baiduri",
        amount: "1000",
        currencyType: "BND",
        exchangeRate: "1.20",
        amountBND: "4000",
      });

      cy.getDataTestId("h5").should("have.value", "5,400.00");

      cy.getDataTestId("h6").should("have.value", "7,000.00");
    });
  });

  context("h7", () => {
    it("should auto sum sub h7 items", () => {
      cy.fillH1();
      cy.getDataTestId(tableInput2.addBtn("h7")).click({ force: true });
      cy.getDataTestId(tableInput2.inputField("name", 0, "h7")).type(
        "Other Due tax 1",
        { force: true }
      );
      cy.getDataTestId(tableInput2.inputField("amount", 0, "h7")).type("1500", {
        force: true,
      });

      cy.getDataTestId(tableInput2.addBtn("h7")).click({ force: true });
      cy.getDataTestId(tableInput2.inputField("name", 1, "h7")).type(
        "Other Due tax 2",
        { force: true }
      );
      cy.getDataTestId(tableInput2.inputField("amount", 1, "h7")).type("500", {
        force: true,
      });

      cy.getDataTestId("h7").should("have.value", "2,000.00");
    });
  });

  context("h8 - h19", () => {
    it("should", () => {
      cy.fillH1();
      cy.getDataTestId("h2").type("1000", { force: true });
      cy.getDataTestId("h2ii").type("100", { force: true });
      cy.getDataTestId("h3").type("50", { force: true });
      cy.getDataTestId("h4").should("have.value", "1,600.00");

      cy.contains("Yes").click({ force: true });

      cy.enterPaidTax({
        row: 0,
        paymentDate: "28-Apr-2021",
        paymentMethod: "Card",
        bankName: "BIBD",
        amount: "1000",
        currencyType: "BND",
        exchangeRate: "1.20",
        amountBND: "1400",
      });

      cy.enterPaidTax({
        row: 1,
        paymentDate: "24-Apr-2021",
        paymentMethod: "Cash",
        bankName: "Baiduri",
        amount: "1000",
        currencyType: "BND",
        exchangeRate: "1.20",
        amountBND: "4000",
      });

      cy.getDataTestId("h5").should("have.value", "5,400.00");

      cy.getDataTestId("h6").should("have.value", "7,000.00");

      cy.getDataTestId(tableInput2.addBtn("h7")).click({ force: true });
      cy.getDataTestId(tableInput2.inputField("name", 0, "h7")).type(
        "Other Due tax 1",
        { force: true }
      );
      cy.getDataTestId(tableInput2.inputField("amount", 0, "h7")).type("1500", {
        force: true,
      });

      cy.getDataTestId(tableInput2.addBtn("h7")).click({ force: true });
      cy.getDataTestId(tableInput2.inputField("name", 1, "h7")).type(
        "Other Due tax 2",
        { force: true }
      );
      cy.getDataTestId(tableInput2.inputField("amount", 1, "h7")).type("500", {
        force: true,
      });

      cy.getDataTestId("h7").should("have.value", "2,000.00");

      cy.getDataTestId("h8").type("500", { force: true });

      // Assertion
      cy.getDataTestId("h9").should("have.value", "2,500.00");

      cy.getDataTestId("h10i").should("have.value", "BND");
      cy.getDataTestId("h10ii").should("have.value", "1.00");
      cy.getDataTestId("h11").should("have.value", "550.00");
      cy.getDataTestId("h12").should("have.value", "1,000.00");
      cy.getDataTestId("h12i").should("have.value", "550.00");
      cy.getDataTestId("h12ii").should("have.value", "100.00");
      cy.getDataTestId("h13").should("have.value", "50.00");
      cy.getDataTestId("h14").should("have.value", "1,600.00");
      cy.getDataTestId("h15").should("have.value", "5,400.00");
      cy.getDataTestId("h16").should("have.value", "7,000.00");
      cy.getDataTestId("h17").should("have.value", "2,000.00");
      cy.getDataTestId("h18").should("have.value", "500.00");
      cy.getDataTestId("h19").should("have.value", "2,500.00");
    });
  });

  context("currency", () => {
    it("should display correct value for h10i and h10ii if BND is selected", () => {
      cy.fillH1();
      cy.getDataTestId("h10i").should("have.value", "BND");
      cy.getDataTestId("h10ii").should("have.value", "1.00");
    });
    it("should display correct value for h10i and h10ii if USD is selected", () => {
      cy.fillH1({ currency: "USD" });
      cy.getDataTestId("h10i").should("have.value", "USD");
      cy.getDataTestId("h10ii").should((exchangeRate) => {
        console.log(exchangeRate[0].value);
        expect(+exchangeRate[0].value).to.be.greaterThan(1);
      });
    });
  });
});
