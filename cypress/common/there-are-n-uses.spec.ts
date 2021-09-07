export const thereAreNUses = (n: number): void => {
  cy.get("main").get("dt:contains(About this use)").should("have.length", n);
};
