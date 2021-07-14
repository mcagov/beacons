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
    // [ ] when I choose to Cancel I can see all my uses again
    // [ ] I can choose to delete another use
    // [ ] iAmPromptedToConfirmDeletion();
    // [ ] I can confirm my deletion choice
    // [ ] I can see my uses without the deleted use
    // End
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
  // [ ] I can see a short title for the use so I know which one I am deleting
  // [ ] There is a 'cancel' choice reverse my decision
  // [ ] There is a 'confirm' choice to carry out the action
};
