/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    qaSetToken(): Chainable<Element>;

    /**
     * Custom command to login for RD module.
     * @example cy.rdLogin(user)
     */
    rdLogin(user: {
      id_token: string;
      session_state: string;
      access_token: string;
      token_type: string;
      scope: string;
      profile: Object;
    }): Chainable<Element>;

    /**
     * Custom command to go to specific section(s).
     * @example cy.goTo("PTSectionB")
     */
    goTo(...section: string[]): Chainable<Element>;
    goTo(selectBaseComponent: string): Chainable<Element>;

    /**
     * Custom command to get data-testid attribute.
     * @example cy.getDataTestId("username")
     */
    getDataTestId(testId: string): Chainable<Element>;

    /**
     * Custom command to enter shareholder field.
     * @example cy.enterShareholder("PTSectionB")
     */
    enterShareholder(params: {
      row?: number;
      identityNumber: string;
      fullName: string;
      isDirector: boolean;
      sharePercentage: number;
      capital: number;
    }): Chainable<Element>;

    typeRegistrationNumber(registrationNumber: string);

    selectRegistrationNumber(registrationNumber: string);

    addAsset(asset: { name: string; amount: number });

    addParticipant(asset: {
      row?: number;
      registrationNumber?: string;
      contractingParty?: string;
      interest?: number;
      dateOfParticipation?: string;
      isOperator?: boolean;
      skipAddBtn?: boolean;
    });

    fixture(file: string);

    fillH1(params?: { currency?: "BND" | "USD"; d3?: string; g2?: string });
    enterPaidTax(params: {
      row: number;
      paymentDate: string;
      paymentMethod: "Card" | "Cash";
      bankName: "BIBD" | "Baiduri";
      amount: string;
      currencyType: "BND" | "USD";
      exchangeRate: string;
      amountBND: string;
    });
  }
}
