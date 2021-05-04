/// <reference types="Cypress" />

import { tableInput2 } from "../../support/lib/elements";

const user = {
  id_token:
    "eyJhbGciOiJSUzI1NiIsImtpZCI6IjdFMkI0RjhGRURERDg2QjU3NTQxMzA2M0RBQTdBRkYyIiwidHlwIjoiSldUIn0.eyJuYmYiOjE2MTY5OTk0NDYsImV4cCI6MTYxNzAwMzA0NiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo1MDgxIiwiYXVkIjoiZXNlcnZpY2VfcG9ydGFsX2RldmVsb3BtZW50IiwiaWF0IjoxNjE2OTk5NDQ2LCJhdF9oYXNoIjoiTl9mb1FYNmZtMW9qcXI2WGNkcUdBdyIsInNfaGFzaCI6IlgzWlIteUY5aXZVUHNqQ1hka0g4cnciLCJzaWQiOiJBNTYxQkEyMjJDNzAwRDlBNjlDRDUxNTk2MUFCODg4RCIsInN1YiI6ImVkZDRlYmM0LTE3ODQtNDZmYi04YjE3LWRhNDQ4NzI3ZjQ1NCIsImF1dGhfdGltZSI6MTYxNjk5OTQ0MywiaWRwIjoibG9jYWwiLCJhbXIiOlsicHdkIl19.q_Xael5u0xhc4N9HgXVHZ5oaSUd_RpVPjUOJ2mr3eBsML78pfRDMiNTvX4F7LGrPgW2Y_HQzUksM33rSRbMFmxcmY-J8Hqx5iaf1czbf2n7B1rKQt6Emqryqqle_g7jReXPhJPKj2PPNUF_LHmFtYHZM184WaTGNJnlwOLWXw3Kw-sfr1pCbeduj65a4IQ0fHhZ_MwgXnM_enFx9e38zlND9-Hv2e62YXhTYAFu0plAKxlhErqNFOCu4_WdOQKgfMNNXOC7SxvHDi6AWn533c8inT6VzPyomHnxkKlu7WiWZqxqjT6CniuGGRVows2uNLdIN0oxuEYn3wCti9QCY0Q",
  session_state:
    "Vly1m77ARdT-yQ4my4HUgMEL4kBkCVfgloSR5KtyrJU.72C97355B6F1F235EBBFE18584FFAD85",
  access_token:
    "eyJhbGciOiJSUzI1NiIsImtpZCI6IjdFMkI0RjhGRURERDg2QjU3NTQxMzA2M0RBQTdBRkYyIiwidHlwIjoiYXQrand0In0.eyJuYmYiOjE2MTY5OTk0NDYsImV4cCI6MTYxNzAwMzA0NiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo1MDgxIiwiY2xpZW50X2lkIjoiZXNlcnZpY2VfcG9ydGFsX2RldmVsb3BtZW50Iiwic3ViIjoiZWRkNGViYzQtMTc4NC00NmZiLThiMTctZGE0NDg3MjdmNDU0IiwiYXV0aF90aW1lIjoxNjE2OTk5NDQzLCJpZHAiOiJsb2NhbCIsImdpdmVuX25hbWUiOiJMb3JkIFNheXVyIiwiZW1haWwiOiJvbWFyLmR5bmFtaWsrMDEwMTAxOTFAZ21haWwuY29tIiwiaWQiOiJlZGQ0ZWJjNC0xNzg0LTQ2ZmItOGIxNy1kYTQ0ODcyN2Y0NTQiLCJJc1Byb2ZpbGVVcGRhdGUiOiIxIiwiQWRkcmVzczEiOiIiLCJBZGRyZXNzMiI6IiIsIkFkZHJlc3MzIjoiIiwiQ291bnRyeUNvZGUiOiIiLCJEaXN0cmljdCI6IiIsIk11a2ltIjoiIiwiVmlsbGFnZSI6IiIsIlBvc3RhbENvZGUiOiIiLCJOYXRpb25hbGl0eUNvZGUiOiJCTiIsIlRlbGVwaG9uZUNvdW50cnlDb2RlIjoiIiwiVGVsZXBob25lTnVtYmVyIjoiIiwiSWRlbnRpdHlUeXBlIjoiQnJ1bmVpSUMiLCJHZW5kZXIiOiJNYWxlIiwiRGF0ZU9mQmlydGgiOiIxLzEvMTk5MSIsIklDVHlwZSI6IkMiLCJJZGVudGlmaWVyTnVtYmVyIjoiMDEwMTAxOTEiLCJ1c2VyVHlwZSI6IkVTZXJ2aWNlVXNlciIsInVzZXJFbWFpbCI6Im9tYXIuZHluYW1payswMTAxMDE5MUBnbWFpbC5jb20iLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJlcnNlcnZpY2VfdXNlciIsImp0aSI6IjcyOUIzMzc2Qzc5N0NFMzY5ODE1MkJBN0M5Rjg4M0I4Iiwic2lkIjoiQTU2MUJBMjIyQzcwMEQ5QTY5Q0Q1MTU5NjFBQjg4OEQiLCJpYXQiOjE2MTY5OTk0NDYsInNjb3BlIjpbIm9wZW5pZCIsInByb2ZpbGUiLCJlbWFpbCIsInJvbGUiLCJyb2Nibi5zY29wZSJdLCJhbXIiOlsicHdkIl19.mYCd-CzANkK_QHz5tNYNtkuTcSVawZl3YZPBkIwlOHa0dzgeZBoelfglDDn2crXVRcuoXAFUYkCvJK2y8Uy5iBAbJF6fLhPAh8-6dAELVCg2ZG9XUHCLX9Xa1y1cestuOzDtuWabHQ2KEC_r9H9YcRz9yOnf-ILSfyL4joYVv_Lekep8rW_yQidXNAA4my0HELJy7564K3EYYdQD7H6vZJnq6WVKOtQwRsRp4a2tmYsNXK3FtWBpMzZFdWcuvvjL_jdFEb_TZfyGpo6cWkehZs4CFWZflr-1I_AMJJroEJR8n6iBZbT40X5nuVCPENvIj8PbS7R-5ECBY1kOyVvXzA",
  token_type: "Bearer",
  scope: "openid profile email role rocbn.scope",
  profile: {
    s_hash: "X3ZR-yF9ivUPsjCXdkH8rw",
    sid: "A561BA222C700D9A69CD515961AB888D",
    sub: "edd4ebc4-1784-46fb-8b17-da448727f454",
    auth_time: 1616999443,
    idp: "local",
    amr: ["pwd"],
    name: "Lord Sayur",
    email: "omar.dynamik+01010191@gmail.com",
    role: "erservice_user",
    preferred_username: "01010191",
    email_verified: true,
    given_name: "Lord Sayur",
    id: "edd4ebc4-1784-46fb-8b17-da448727f454",
    IsProfileUpdate: "1",
    Address1: "",
    Address2: "",
    Address3: "",
    CountryCode: "",
    District: "",
    Mukim: "",
    Village: "",
    PostalCode: "",
    NationalityCode: "BN",
    TelephoneCountryCode: "",
    TelephoneNumber: "",
    IdentityType: "BruneiIC",
    Gender: "Male",
    DateOfBirth: "1/1/1991",
    ICType: "C",
    IdentifierNumber: "01010191",
    userType: "EServiceUser",
    userEmail: "omar.dynamik+01010191@gmail.com",
    "http://schemas.microsoft.com/ws/2008/06/identity/claims/role":
      "erservice_user",
  },
  expires_at: 1617003046,
};

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
    cy.rdLogin(user);
    cy.goTo("PTSectionB");
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
