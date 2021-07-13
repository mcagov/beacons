import { Purpose } from "../../../src/lib/registration/types";
import { givenIHaveEnteredMyBeaconDetails } from "../common/i-can-enter-beacon-information.spec";
import { andIHaveAnotherUse } from "../common/i-can-enter-use-information/generic.spec";
import { givenIHaveEnteredMyLandUse } from "../common/i-can-enter-use-information/land.spec";
import { givenIHaveEnteredMyMaritimeUse } from "../common/i-can-enter-use-information/maritime.spec";

describe("As a beacon owner with several uses", () => {
  it("I can safely remove a use from my draft registration", () => {
    givenIHaveTwoUses();
    andIDeleteMyMainUse();
    iAmPromptedToConfirmDeletion();
  });
});

const givenIHaveTwoUses = () => {
  givenIHaveEnteredMyBeaconDetails();
  givenIHaveEnteredMyLandUse();
  andIHaveAnotherUse();
  givenIHaveEnteredMyMaritimeUse(Purpose.PLEASURE);
};

const andIDeleteMyMainUse = () => {
  cy.get("h2")
    .contains(/main use/i)
    .siblings()
    .contains(/delete/i)
    .click();
};

const iAmPromptedToConfirmDeletion = () => {
  cy.get("h1").contains(/are you sure/i);
};
