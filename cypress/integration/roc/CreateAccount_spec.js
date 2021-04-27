const link =
  "https://id.stage.onecommonportal.com/Account/Login?ReturnUrl=%2Fconnect%2Fauthorize%2Fcallback%3Fclient_id%3DdnphgXcg0zeYBOCWwnRW8Xhq8Oif9A06%26redirect_uri%3Dhttps%253A%252F%252Fes.stage.onecommonportal.com%252Fcallback%26response_type%3Dcode%26scope%3Dopenid%2520profile%2520email%2520role%2520rocbn.scope%26state%3Dc49906ab6c60462c8a6047b98b0ad205%26code_challenge%3DBdllo1GdW9EXFXUeWzKvCLTGZWIo5Xq-d5-s2RtecV0%26code_challenge_method%3DS256%26response_mode%3Dquery";
const erroMsg = "nvalid Identification Document Number";
xcontext("External user create new accoutt", () => {
  it("should create new account", () => {
    cy.visit(link);

    cy.contains("Create Account").click();
    cy.get('[type="radio"]').check("BruneiIC");
    cy.get("#IdentifierNumber").type("1234567889");
    cy.get("#DOB").click();
    cy.get("select.ui-datepicker-year").select("1990");
    cy.get("a").contains("1").click();
    cy.contains(erroMsg).should("be.visible");
  });
});
