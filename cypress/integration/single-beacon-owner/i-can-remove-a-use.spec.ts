import { Purpose } from "../../../src/lib/deprecatedRegistration/types";
import { givenIHaveEnteredMyBeaconDetails } from "../../common/i-can-enter-beacon-information.spec";
import {
  andIHaveEnteredMyAviationUse,
  iCanSeeMyAviationUse,
} from "../../common/i-can-enter-use-information/aviation.spec";
import {
  andIHaveAnotherUse,
  whenIHaveAnotherUse,
} from "../../common/i-can-enter-use-information/generic.spec";
import {
  givenIHaveEnteredMyLandUse,
  iCanSeeMyLandUse,
} from "../../common/i-can-enter-use-information/land.spec";
import {
  givenIHaveEnteredMyMaritimeUse,
  iCanSeeMyMaritimeUse,
} from "../../common/i-can-enter-use-information/maritime.spec";
import {
  andIClickTheButtonContaining,
  givenIHaveSignedIn,
  whenIClickTheButtonContaining,
} from "../../common/selectors-and-assertions.spec";
import { thereAreNUses } from "../../common/there-are-n-uses.spec";
import { whenIGoToDeleteMy } from "../../common/when-i-go-to-delete-my.spec";

describe("As a beacon owner with several uses", () => {
  it("I can safely remove a use from my draft registration", () => {
    givenIHaveSignedIn();
    givenIHaveEnteredMyBeaconDetails();
    givenIHaveEnteredMyLandUse();
    andIHaveAnotherUse();
    givenIHaveEnteredMyMaritimeUse(Purpose.PLEASURE);
    thereAreNUses(2);

    whenIGoToDeleteMy(/main use/i);
    thenIAmPromptedToConfirmDeletionOfMyLandUse();

    whenIClickTheButtonContaining("Cancel");
    thereAreNUses(2);
    iCanSeeMyLandUse();
    iCanSeeMyMaritimeUse(Purpose.PLEASURE);

    whenIGoToDeleteMy(/second use/i);
    iAmPromptedToConfirmDeletionOfMyMaritimeMotorPleasureUse();
    whenIClickTheButtonContaining("Yes");
    thereAreNUses(1);
    iCanSeeMyLandUse();
    iCannotSeeMyMaritimePleasureUseBecauseItIsDeleted();

    whenIHaveAnotherUse();
    andIHaveEnteredMyAviationUse(Purpose.COMMERCIAL);
    thereAreNUses(2);
    iCanSeeMyLandUse();
    iCanSeeMyAviationUse(Purpose.COMMERCIAL);

    whenIGoToDeleteMy(/main use/i);
    andIClickTheButtonContaining("Yes");
    thereAreNUses(1);
    myAviationCommercialUseIsNowMyMainUse();

    whenIGoToDeleteMy(/main use/i);
    whenIClickTheButtonContaining("Yes");
    thereAreNUses(0);
  });
});

const myAviationCommercialUseIsNowMyMainUse = () =>
  cy.get("h2").contains(/(?=.*main use)(?=.*aviation)(?=.*commercial)/i);

const iCannotSeeMyMaritimePleasureUseBecauseItIsDeleted = () =>
  cy
    .get("main")
    .contains(/(?=.*maritime)(?=.*motor)(?=.*pleasure)/i)
    .should("not.exist");

const thenIAmPromptedToConfirmDeletionOfMyLandUse = () =>
  cy.get("h1").contains(/(?=.*are you sure)(?=.*land)(?=.*cycling)/i);

const iAmPromptedToConfirmDeletionOfMyMaritimeMotorPleasureUse = () =>
  cy
    .get("h1")
    .contains(/(?=.*are you sure)(?=.*maritime)(?=.*motor)(?=.*pleasure)/i);
