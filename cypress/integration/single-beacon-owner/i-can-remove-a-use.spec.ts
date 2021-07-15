import { Purpose } from "../../../src/lib/registration/types";
import { givenIHaveEnteredMyBeaconDetails } from "../common/i-can-enter-beacon-information.spec";
import {
  givenIHaveEnteredMyAviationUse,
  iCanSeeMyAviationUse,
} from "../common/i-can-enter-use-information/aviation.spec";
import { andIHaveAnotherUse } from "../common/i-can-enter-use-information/generic.spec";
import {
  givenIHaveEnteredMyLandUse,
  iCanEditMyAdditionalLandUseMoreDetails,
  iCanSeeMyLandUse,
} from "../common/i-can-enter-use-information/land.spec";
import {
  givenIHaveEnteredMyMaritimeUse,
  iCanSeeMyMaritimeUse,
} from "../common/i-can-enter-use-information/maritime.spec";
import {
  givenIHaveClickedTheButtonContaining,
  whenIClickBack,
} from "../common/selectors-and-assertions.spec";

describe("As a beacon owner with several uses", () => {
  it("I can safely remove a use from my draft registration", () => {
    givenIHaveThreeUses();
    andIGoToDeleteMyMainUse();
    iAmPromptedToConfirmDeletionOfMyMainUse();

    givenIHaveClickedTheButtonContaining("Cancel");
    iCanSeeMyThreeUses();
    andIGoToDeleteMySecondUse();
    iAmPromptedToConfirmDeletionOfMySecondUse();

    givenIHaveClickedTheButtonContaining("Yes");
    iCanSeeMyMainUse();
    iCannotSeeWhatWasMySecondUseBecauseItIsDeleted();
    myThirdUseIsNowMySecondUse();

    whenIClickBack();
    iAmEditingWhatIsNowMySecondUse();
  });
});

const iCanSeeMyMainUse = () => iCanSeeMyLandUse();

const myThirdUseIsNowMySecondUse = () =>
  cy.get("h2").contains(/third use/i && /aviation/i && /commercial/i);

const givenIHaveThreeUses = () => {
  givenIHaveEnteredMyBeaconDetails();
  givenIHaveEnteredMyLandUse();
  andIHaveAnotherUse();
  givenIHaveEnteredMyMaritimeUse(Purpose.PLEASURE);
  andIHaveAnotherUse();
  givenIHaveEnteredMyAviationUse(Purpose.COMMERCIAL);
};

const iCanSeeMyThreeUses = () => {
  iCanSeeMyLandUse();
  iCanSeeMyMaritimeUse(Purpose.PLEASURE);
  iCanSeeMyAviationUse(Purpose.COMMERCIAL);
};

const iCannotSeeWhatWasMySecondUseBecauseItIsDeleted = () =>
  cy
    .get("main")
    .contains(/maritime/i && /motor/i && /pleasure/i)
    .should("not.exist");

const andIGoToDeleteMyMainUse = () =>
  cy
    .get("h2")
    .contains(/main use/i)
    .siblings()
    .contains(/delete/i)
    .click();

const andIGoToDeleteMySecondUse = () =>
  cy
    .get("h2")
    .contains(/second use/i)
    .siblings()
    .contains(/delete/i)
    .click();

const iAmPromptedToConfirmDeletionOfMyMainUse = () =>
  cy.get("h1").contains(/are you sure/i && /land/i && /cycling/i);

const iAmPromptedToConfirmDeletionOfMySecondUse = () =>
  cy
    .get("h1")
    .contains(/are you sure/i && /maritime/i && /motor/i && /pleasure/i);

const iAmEditingWhatIsNowMySecondUse = iCanEditMyAdditionalLandUseMoreDetails;
