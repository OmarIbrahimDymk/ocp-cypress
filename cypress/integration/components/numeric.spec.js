/// <reference types="Cypress" />

const baseComponent = "base-component";

["numeric", "numericVal"].forEach((numeric) => {
  describe(numeric + " component", () => {
    beforeEach(() => {
      cy.fixture("tokens/local.json").then((user) => {
        cy.rdLogin(user);
        cy.selectBaseComponent(numeric);
        cy.intercept("/.well-known/openid-configuration", "success");
      });
    });

    it("should display placeholder equal to 0.00", () => {
      cy.getDataTestId(baseComponent).should(
        "have.attr",
        "placeholder",
        "0.00"
      );
    });

    it("should auto format to currency on blur", () => {
      cy.getDataTestId(baseComponent)
        .type("0.1")
        .blur()
        .should("have.value", "0.10")
        .clear()
        .type("1")
        .blur()
        .should("have.value", "1.00")
        .clear()
        .type("12")
        .blur()
        .should("have.value", "12.00")
        .clear()
        .type("123")
        .blur()
        .should("have.value", "123.00")
        .clear()
        .type("1234")
        .blur()
        .should("have.value", "1,234.00")
        .clear()
        .type("1234567")
        .blur()
        .should("have.value", "1,234,567.00");
    });

    it("should remove currency format on focus", () => {
      cy.getDataTestId(baseComponent).type(1000).blur();
      cy.getDataTestId(baseComponent).focus().should("have.value", "1000");
    });

    it("should allow numeric character only", () => {
      cy.getDataTestId(baseComponent)
        .type("123dsf@#$456")
        .blur()
        .should("have.value", "123,456.00");
    });

    it("should round to 2 decimal places on input blurred", () => {
      cy.getDataTestId(baseComponent)
        .type("1.234")
        .blur()
        .invoke("val")
        .should("match", /\d+\.\d\d$/g);

      cy.getDataTestId(baseComponent)
        .should("have.value", "1.23")
        .clear()
        .type("1.235")
        .blur()
        .should("have.value", "1.24");
    });

    it("should not allow user to enter . as the first character", () => {
      cy.getDataTestId(baseComponent)
        .clear()
        .type(".")
        .should("have.value", "");
    });

    it("should only allow 1 period character", () => {
      cy.getDataTestId(baseComponent)
        .type("123.123.123")
        .should("have.value", "123.123123");
    });

    it("should not allow user to enter multiple . consecutively", () => {
      cy.getDataTestId(baseComponent)
        .type("123....45")
        .should("have.value", "123.45");
    });
  });
});
