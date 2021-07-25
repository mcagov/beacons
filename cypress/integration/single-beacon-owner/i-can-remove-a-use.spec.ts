import { Purpose } from "../../../src/lib/registration/types";
import { givenIHaveEnteredMyBeaconDetails } from "../common/i-can-enter-beacon-information.spec";
import {
  andIHaveEnteredMyAviationUse,
  iCanSeeMyAviationUse,
} from "../common/i-can-enter-use-information/aviation.spec";
import {
  andIHaveAnotherUse,
  whenIHaveAnotherUse,
} from "../common/i-can-enter-use-information/generic.spec";
import {
  givenIHaveEnteredMyLandUse,
  iCanSeeMyLandUse,
} from "../common/i-can-enter-use-information/land.spec";
import {
  givenIHaveEnteredMyMaritimeUse,
  iCanSeeMyMaritimeUse,
} from "../common/i-can-enter-use-information/maritime.spec";
import {
  andIClickTheButtonContaining,
  whenIClickTheButtonContaining,
} from "../common/selectors-and-assertions.spec";

describe("As a beacon owner with several uses", () => {
  it("I can safely remove a use from my draft registration", () => {
    givenIHaveEnteredMyBeaconDetails();
    givenIHaveEnteredMyLandUse();
    andIHaveAnotherUse();
    givenIHaveEnteredMyMaritimeUse(Purpose.PLEASURE);
    thereAreNUses(2);

    whenIGoToDeleteMyMainUse();
    thenIAmPromptedToConfirmDeletionOfMyLandUse();

    whenIClickTheButtonContaining("Cancel");
    thereAreNUses(2);
    iCanSeeMyLandUse();
    iCanSeeMyMaritimeUse(Purpose.PLEASURE);

    whenIGoToDeleteMySecondUse();
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

    whenIGoToDeleteMyMainUse();
    andIClickTheButtonContaining("Yes");
    thereAreNUses(1);
    myAviationCommercialUseIsNowMyMainUse();

    whenIGoToDeleteMyMainUse();
    whenIClickTheButtonContaining("Yes");
    thereAreNUses(0);
  });
});

const myAviationCommercialUseIsNowMyMainUse = () =>
  cy.get("h2").contains(/(?=.*main use)(?=.*aviation)(?=.*commercial)/i);

const thereAreNUses = (n: number) =>
  cy.get(".govuk-summary-list").should("have.length", n);

const iCannotSeeMyMaritimePleasureUseBecauseItIsDeleted = () =>
  cy
    .get("main")
    .contains(/(?=.*maritime)(?=.*motor)(?=.*pleasure)/i)
    .should("not.exist");

const whenIGoToDeleteMyMainUse = () =>
  cy
    .get("h2")
    .contains(/main use/i)
    .siblings()
    .contains(/delete/i)
    .click();

const whenIGoToDeleteMySecondUse = () =>
  cy
    .get("h2")
    .contains(/second use/i)
    .siblings()
    .contains(/delete/i)
    .click();

const thenIAmPromptedToConfirmDeletionOfMyLandUse = () =>
  cy.get("h1").contains(/(?=.*are you sure)(?=.*land)(?=.*cycling)/i);

const iAmPromptedToConfirmDeletionOfMyMaritimeMotorPleasureUse = () =>
  cy
    .get("h1")
    .contains(/(?=.*are you sure)(?=.*maritime)(?=.*motor)(?=.*pleasure)/i);
