import { BeaconUse } from "../../src/entities/BeaconUse";
import { DraftRegistration } from "../../src/entities/DraftRegistration";
import { Registration } from "../../src/entities/Registration";
import {
  Activity,
  Environment,
  Purpose,
} from "../../src/lib/deprecatedRegistration/types";
import { AccountPageURLs } from "../../src/lib/urls";
import { makeEnumValueUserFriendly } from "../../src/lib/writingStyle";
import { iAmPromptedToConfirm } from "../common/i-am-prompted-to-confirm.spec";
import {
  andIHaveEnteredMyAviationUse,
  iCanSeeMyAviationUse,
} from "../common/i-can-enter-use-information/aviation.spec";
import { whenIHaveAnotherUse } from "../common/i-can-enter-use-information/generic.spec";
import {
  andIHaveEnteredMyLandUse,
  iCanSeeMyLandUse,
} from "../common/i-can-enter-use-information/land.spec";
import {
  iHavePreviouslyRegisteredABeacon,
  randomUkEncodedHexId,
} from "../common/i-have-previously-registered-a-beacon.spec";
import {
  givenIHaveSignedIn,
  givenIHaveWaitedForBeaconsApi,
  iCanSeeAPageHeadingThatContains,
  thenTheUrlShouldContain,
  whenIClickContinue,
  whenIClickTheButtonContaining,
  whenIHaveVisited,
} from "../common/selectors-and-assertions.spec";
import { theNumberOfUsesIs } from "../common/there-are-n-uses.spec";
import { whenIGoToDeleteMy } from "../common/when-i-go-to-delete-my.spec";
import { singleBeaconRegistration } from "../fixtures/singleBeaconRegistration";

describe("As an account holder", () => {
  it("I can add many uses to one of my registrations", () => {
    givenIHaveSignedIn();
    andIHavePreviouslyRegisteredABeacon(testRegistration);

    whenIHaveVisited(AccountPageURLs.accountHome);
    whenIClickTheHexIdOfTheRegistrationIWantToUpdate(testRegistration.hexId);
    iCanAddANewUse(testRegistration);
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

const iCanAddANewUse = (registration: Registration) => {
  whenIClickTheChangeLinkForTheSectionWithHeading("How this beacon is used");
  iCanSeeUseInformation(registration);

  whenIGoToDeleteMy(/main use/i);
  thenIAmPromptedToConfirmDeletionOfMyUse(registration.uses[0]);

  whenIClickTheButtonContaining("Cancel");
  theNumberOfUsesIs(1);
  iCanSeeMyUse(registration.uses[0]);

  whenIHaveAnotherUse();
  andIHaveEnteredMyAviationUse(Purpose.COMMERCIAL);
  theNumberOfUsesIs(2);
  iCanSeeMyUse(registration.uses[0]);
  iCanSeeMyAviationUse(Purpose.COMMERCIAL);

  whenIHaveAnotherUse();
  andIHaveEnteredMyLandUse();
  theNumberOfUsesIs(3);
  iCanSeeMyUse(registration.uses[0]);
  iCanSeeMyAviationUse(Purpose.COMMERCIAL);
  iCanSeeMyLandUse();

  whenIGoToDeleteMy(/second use/i);
  iAmPromptedToConfirm(
    Environment.AVIATION,
    Activity.GLIDER,
    Purpose.COMMERCIAL
  );
  whenIClickTheButtonContaining("Yes");
  theNumberOfUsesIs(2);
  iCanSeeMyUse(registration.uses[0]);
  iCanSeeMyLandUse();

  whenIClickContinue();
  iCanSeeMyUse(registration.uses[0]);
  iCanSeeMyLandUse();

  whenIClickTheButtonContaining("Accept and send");
  givenIHaveWaitedForBeaconsApi(10000);
  iCanSeeAPageHeadingThatContains("Your beacon registration has been updated");

  whenIClickTheButtonContaining("Return to your Account");
  thenTheUrlShouldContain(AccountPageURLs.accountHome);

  whenIClickTheHexIdOfTheRegistrationIJustUpdated(testRegistration.hexId);
  iCanSeeMyUse(registration.uses[0]);
  iCanSeeMyLandUse();
};

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
