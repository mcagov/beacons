export const iCanSeeMyExistingRegistrationHexId = (hexId: string): void => {
  cy.get("main").contains(hexId);
};
