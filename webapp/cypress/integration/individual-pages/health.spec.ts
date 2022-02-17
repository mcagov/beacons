describe("Health check endpoint", () => {
  it("Returns a response status of 200", () => {
    cy.request("/api/health").then((response) => {
      expect(response.status).to.eq(200);
    });
  });
});
