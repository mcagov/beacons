import { BeaconUse } from "../../src/entities/BeaconUse";
import { DraftRegistration } from "../../src/entities/DraftRegistration";
import { Registration } from "../../src/entities/Registration";
import { Environment } from "../../src/lib/deprecatedRegistration/types";
import { AccountPageURLs } from "../../src/lib/urls";
import { Actions } from "../../src/lib/URLs/Actions";
import { Pages } from "../../src/lib/URLs/Pages";
import { Resources } from "../../src/lib/URLs/Resources";
import { UsePages } from "../../src/lib/URLs/UsePages";
import { makeEnumValueUserFriendly } from "../../src/lib/writingStyle";
import { whenIHaveAnotherUse } from "../common/i-can-enter-use-information/generic.spec";
import {
  iHavePreviouslyRegisteredABeacon,
  randomUkEncodedHexId,
} from "../common/i-have-previously-registered-a-beacon.spec";
import {
  andIClickContinue,
  givenIHaveSelected,
  givenIHaveSignedIn,
  theBackLinkContains,
  whenIHaveVisited,
} from "../common/selectors-and-assertions.spec";
import { singleBeaconRegistration } from "../fixtures/singleBeaconRegistration";

describe("As an account holder", () => {
  it("I can add many uses to one of my registrations", () => {
    givenIHaveSignedIn();
    andIHavePreviouslyRegisteredABeacon(testRegistration);

    whenIHaveVisited(AccountPageURLs.accountHome);
    whenIClickTheHexIdOfTheRegistrationIWantToUpdate(testRegistration.hexId);

    whenIClickTheChangeLinkForTheSectionWithHeading("How this beacon is used");
    iCanUseTheBackLinksAndContinueButtonsToNavigateMyUses();

    // iCanSeeUseInformation(testRegistration);
    //
    // whenIGoToDeleteMy(/main use/i);
    // thenIAmPromptedToConfirmDeletionOfMyUse(testRegistration.uses[0]);
    //
    // whenIClickTheButtonContaining("Cancel");
    // theNumberOfUsesIs(1);
    // iCanSeeMyUse(testRegistration.uses[0]);
    //
    // whenIHaveAnotherUse();
    // andIHaveEnteredMyAviationUse(Purpose.COMMERCIAL);
    // theNumberOfUsesIs(2);
    // iCanSeeMyUse(testRegistration.uses[0]);
    // iCanSeeMyAviationUse(Purpose.COMMERCIAL);
    //
    // whenIHaveAnotherUse();
    // andIHaveEnteredMyLandUse();
    // theNumberOfUsesIs(3);
    // iCanSeeMyUse(testRegistration.uses[0]);
    // iCanSeeMyAviationUse(Purpose.COMMERCIAL);
    // iCanSeeMyLandUse();
    //
    // whenIGoToDeleteMy(/second use/i);
    // iAmPromptedToConfirm(
    //   Environment.AVIATION,
    //   Activity.GLIDER,
    //   Purpose.COMMERCIAL
    // );
    // whenIClickTheButtonContaining("Yes");
    // theNumberOfUsesIs(2);
    // iCanSeeMyUse(testRegistration.uses[0]);
    // iCanSeeMyLandUse();
    //
    // whenIClickContinue();
    // iCanSeeMyUse(testRegistration.uses[0]);
    // iCanSeeMyLandUse();
    //
    // whenIClickTheButtonContaining("Accept and send");
    // givenIHaveWaitedForBeaconsApi(10000);
    // iCanSeeAPageHeadingThatContains(
    //   "Your beacon registration has been updated"
    // );
    //
    // whenIClickTheButtonContaining("Return to your Account");
    // thenTheUrlShouldContain(AccountPageURLs.accountHome);
    //
    // whenIClickTheHexIdOfTheRegistrationIJustUpdated(testRegistration.hexId);
    // iCanSeeMyUse(testRegistration.uses[0]);
    // iCanSeeMyLandUse();
    //
    // iCanUseTheBackLinksAndContinueButtonsToNavigateMyUses();
  });
});

const hexId = randomUkEncodedHexId();

const testRegistration: Registration = {
  ...singleBeaconRegistration,
  hexId,
};

const andIHavePreviouslyRegisteredABeacon = iHavePreviouslyRegisteredABeacon;

const whenIClickTheHexIdOfTheRegistrationIWantToUpdate = (hexId: string) => {
  cy.get("a").contains(hexId).click();
};

const whenIClickTheHexIdOfTheRegistrationIJustUpdated =
  whenIClickTheHexIdOfTheRegistrationIWantToUpdate;

const thenIAmPromptedToConfirmDeletionOfMyUse = (use: BeaconUse) =>
  cy
    .get("h1")
    .contains(
      new RegExp(
        `(?=.*are you sure)(?=.*${use.environment})(?=.*${use.activity})`,
        "i"
      )
    );

const iCanSeeMyUse = (use: BeaconUse): void => {
  cy.get("main").contains(makeEnumValueUserFriendly(use.environment));
  cy.get("main").contains(makeEnumValueUserFriendly(use.activity));
  if (use.environment !== Environment.LAND)
    cy.get("main").contains(makeEnumValueUserFriendly(use.purpose));
};

const iCanSeeUseInformation = (draftRegistration: DraftRegistration) => {
  draftRegistration.uses.forEach((use) => {
    cy.get("main").contains(new RegExp(use.environment, "i"));
    cy.get("main").contains(new RegExp(use.activity, "i"));
    if (use.environment !== Environment.LAND) {
      cy.get("main").contains(new RegExp(use.purpose, "i"));
    }

    cy.get("main").contains("About this use");
    cy.get("main").contains("Communications");
    cy.get("main").contains("More details");
  });
};

const whenIClickTheChangeLinkForTheSectionWithHeading = (heading: string) => {
  cy.get("h2")
    .contains(heading)
    .parent()
    .contains(/change/i)
    .click();
};

const iCanUseTheBackLinksAndContinueButtonsToNavigateMyUses = () => {
  // whenIClickTheChangeLinkForTheSectionWithHeading("How this beacon is used");
  theBackLinkContains(Resources.registration, Actions.update, Pages.summary);
  whenIHaveAnotherUse();

  theBackLinkContains(
    Resources.registration,
    Actions.update,
    Resources.use,
    UsePages.summary
  );

  givenIHaveSelected("#maritime");
  andIClickContinue();

  theBackLinkContains(
    Resources.registration,
    Actions.update,
    Resources.use,
    "/1/",
    UsePages.environment
  );

  givenIHaveSelected("#commercial");
  andIClickContinue();

  theBackLinkContains(
    Resources.registration,
    Actions.update,
    Resources.use,
    "/1/",
    UsePages.purpose
  );
};
