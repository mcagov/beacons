import {
  andIClickContinue,
  andIClickTheButtonContaining,
  iCanSeeAButtonContaining,
  iCanSeeNLinksContaining,
  iHaveClickedOnAGivenLink,
  thenTheUrlShouldContain,
  whenIClickContinue,
} from "../selectors-and-assertions.spec";

export const iCanEditMyEnvironment = (environment: string): void => {
  cy.get(`input[value="${environment}"]`).should("be.checked");
};

export const andIHaveNoFurtherUses = (): void => {
  thenTheUrlShouldContain("/register-a-beacon/additional-beacon-use");
  andIClickContinue();
};

export const andIHaveAnotherUse = (): void => {
  andIClickTheButtonContaining("Add another");
  iShouldBeEditingAFreshUse();
};

export const givenIHaveAnotherUse = andIHaveAnotherUse;

export const whenIHaveAnotherUse = andIHaveAnotherUse;

const iShouldBeEditingAFreshUse = (): void => {
  cy.get('[type="radio"]').should("not.be.checked");
};

export const iCanEditMyNUses = (n: number): void => {
  iCanSeeNLinksContaining(n, "Change");
  iCanSeeNLinksContaining(n, "Delete");
  iCanSeeAButtonContaining("Continue");
  iCanSeeAButtonContaining("Add another");
};

export const whenIGoToEditTheUseNumber = (useNumber: number): void => {
  iHaveClickedOnAGivenLink(`/register-a-beacon/beacon-use?useId=${useNumber}`);
  whenIClickContinue();
};

export const iAmOnTheLandBranchForUseNumber = (useNumber: number): void => {
  thenTheUrlShouldContain(`/register-a-beacon/activity?useId=${useNumber}`);
};

export const iAmOnTheMaritimeOrAviationBranchForUseNumber = (
  useNumber: number
): void => {
  thenTheUrlShouldContain(`/register-a-beacon/purpose?useId=${useNumber}`);
};
