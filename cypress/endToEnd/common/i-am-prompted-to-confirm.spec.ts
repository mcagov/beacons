export const iAmPromptedToConfirm = (...playedBackText: string[]): void => {
  const pattern = new RegExp(
    "/(?=.*are you sure)" +
      playedBackText.map((text) => `(?=.*${text})`).join("") +
      "/i"
  );
  cy.get("h1").contains(pattern);
};
