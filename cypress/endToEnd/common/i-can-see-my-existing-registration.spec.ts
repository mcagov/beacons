export const iCanSeeMyExistingRegistration = (hexId: string): void => {
  cy.get("main").contains(hexId);
};
