describe("Service start page", () => {
  const submissionCookieId = "submissionId";
  const acceptRejectCookieId = "acceptRejectId";

  it("Vists the service start page", () => {
    cy.visit("/");
    cy.contains("Maritime and Coastguard Agency: Register a beacon").click();
    cy.url().should("eq", "http://localhost:3000/");
  });

  it("Sets the cookie for the form submission", () => {
    cy.visit("/");
    cy.getCookie(submissionCookieId).should("exist");
  });

  it("Accepts the cookie policy if the user selects `Hide this message`", () => {
    cy.visit("/");
    cy.get("button").contains("Hide this message").click();
    cy.getCookie(acceptRejectCookieId).should("exist");
  });
});
