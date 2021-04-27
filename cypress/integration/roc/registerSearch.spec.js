let url = "https://qa.ocp.mofe.gov.bn/";
let icNumber = "01047431";
let password = "!Password1";
let registerType = {
  COMPANIES: "Companies",
  BUSINESS_NAME: "Business Name",
};
let entityType = {
  SOLE_PROPRIETOR: "Sole Proprietor",
  PARTNERSHIP: "Partnership",
  PRIVATE: "Private",
  PUBLIC: "Public",
  FOREIGN: "Foreign",
};
let system = {
  businessName: {
    E_REGISTRY: "P0",
    ROCBN: "P2",
    OCP: "P3",
  },
  company: {
    private: {
      E_REGISTRY: null,
      ROCBN: "RC2",
      OCP: "RC3",
    },
    public: {
      E_REGISTRY: null,
      ROCBN: "RC2",
      OCP: "RC3",
    },
    foreign: {
      E_REGISTRY: null,
      ROCBN: "RFC2",
      OCP: "RFC3",
    },
  },
};

context("Register Search", () => {
  beforeEach(() => {
    cy.OCPLogin({ url, icNumber, password });
  });
  it("search request information for BN from eRegistry", () => {
    cy.searchEntity({
      number: system.businessName.E_REGISTRY,
      registerType: registerType.BUSINESS_NAME,
      type: entityType.SOLE_PROPRIETOR,
    });
  });
  it("search request information for BN from ROCBN", () => {
    cy.searchEntity({
      number: system.businessName.ROCBN,
      registerType: registerType.BUSINESS_NAME,
      type: entityType.SOLE_PROPRIETOR,
    });
  });
  it("search request information for BN from OCP", () => {
    cy.searchEntity({
      number: system.businessName.OCP,
      registerType: registerType.BUSINESS_NAME,
      type: entityType.SOLE_PROPRIETOR,
    });
  });
  it("search request information for BN from eRegistry", () => {
    cy.searchEntity({
      number: system.businessName.E_REGISTRY,
      registerType: registerType.BUSINESS_NAME,
      type: entityType.PARTNERSHIP,
    });
  });
  it("search request information for BN from ROCBN", () => {
    cy.searchEntity({
      number: system.businessName.ROCBN,
      registerType: registerType.BUSINESS_NAME,
      type: entityType.PARTNERSHIP,
    });
  });
  it("search request information for BN from OCP", () => {
    cy.searchEntity({
      number: system.businessName.OCP,
      registerType: registerType.BUSINESS_NAME,
      type: entityType.PARTNERSHIP,
    });
  });
  it("Search RC1 public company", () => {
    cy.searchEntity({
      number: system.company.public.ROCBN,
      registerType: registerType.COMPANIES,
      type: entityType.PUBLIC,
    });
  });
  it("Search RC1 public company", () => {
    cy.searchEntity({
      number: system.company.public.OCP,
      registerType: registerType.COMPANIES,
      type: entityType.PUBLIC,
    });
  });
  it("Search RC1 private company", () => {
    cy.searchEntity({
      number: system.company.public.ROCBN,
      registerType: registerType.COMPANIES,
      type: entityType.PRIVATE,
    });
  });
  it("Search RC1 private company", () => {
    cy.searchEntity({
      number: system.company.public.OCP,
      registerType: registerType.COMPANIES,
      type: entityType.PRIVATE,
    });
  });
  it("Search RC1 foreign company", () => {
    cy.searchEntity({
      number: system.company.public.ROCBN,
      registerType: registerType.COMPANIES,
      type: entityType.FOREIGN,
    });
  });
  it("Search RC1 foreign company", () => {
    cy.searchEntity({
      number: system.company.public.OCP,
      registerType: registerType.COMPANIES,
      type: entityType.FOREIGN,
    });
  });
});
