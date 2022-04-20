import {
  andIClickContinue,
  andIClickTheButtonContaining,
  thenTheUrlShouldContain,
} from "../selectors-and-assertions.spec";

export const andIHaveNoFurtherUses = (): void => {
  thenTheUrlShouldContain("/register-a-beacon/additional-beacon-use");
  andIClickContinue();
};

export const andIHaveAnotherUse = (): void => {
  andIClickTheButtonContaining("Add another");
  iShouldBeEditingAFreshUse();
};

export const whenIHaveAnotherUse = andIHaveAnotherUse;

const iShouldBeEditingAFreshUse = (): void => {
  cy.get('[type="radio"]').should("not.be.checked");
};
