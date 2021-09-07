export const whenIGoToDeleteMy = (selector: string | RegExp): void => {
  cy.get("h2")
    .contains(selector)
    .siblings()
    .contains(/delete/i)
    .click();
};
