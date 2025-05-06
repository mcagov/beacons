export const iCanSeeMyExistingRegistrationMainUse = (
  mainUseName: string
): void => {
  cy.get("main").contains(mainUseName);
};
