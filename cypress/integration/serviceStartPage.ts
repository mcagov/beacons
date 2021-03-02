describe("Service start page", () => {
  it("Vists the service start page", () => {
    cy.visit("http://localhost:3000/");
    cy.contains("Maritime and Coastguard Agency: Register a beacon").click();
    cy.url().should("eq", "http://localhost:3000/");
  });
});
