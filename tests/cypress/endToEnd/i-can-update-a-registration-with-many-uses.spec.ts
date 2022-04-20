import { iAmPromptedToConfirm } from "../common/i-am-prompted-to-confirm.spec";
import {
  andIHaveEnteredMyAviationUse,
  givenIHaveEnteredInformationAboutMyAircraft,
  givenIHaveEnteredMyAircraftCommunicationDetails,
  iCanSeeMyAviationUse,
} from "../common/i-can-enter-use-information/aviation.spec";
import { whenIHaveAnotherUse } from "../common/i-can-enter-use-information/generic.spec";
import {
  andIHaveEnteredMyLandUse,
  givenIHaveEnteredMyLandCommunicationDetails,
  iCanSeeMyLandUse,
} from "../common/i-can-enter-use-information/land.spec";
import {
  givenIHaveEnteredInformationAboutMyVessel,
  givenIHaveEnteredMyVesselCommunicationDetails,
} from "../common/i-can-enter-use-information/maritime.spec";
import {
  iHavePreviouslyRegisteredABeacon,
  randomUkEncodedHexId,
} from "../common/i-have-previously-registered-a-beacon.spec";
import {
  andIClickContinue,
  givenIHaveSelected,
  givenIHaveSignedIn,
  iCanSeeAPageHeadingThatContains,
  iPerformOperationAndWaitForNewPageToLoad,
  theBackLinkContains,
  thenTheUrlShouldContain,
  whenIClickBack,
  whenIClickContinue,
  whenIClickTheButtonContaining,
  whenIHaveVisited,
} from "../common/selectors-and-assertions.spec";
import { theNumberOfUsesIs } from "../common/there-are-n-uses.spec";
import { whenIGoToDeleteMy } from "../common/when-i-go-to-delete-my.spec";
import { makeEnumValueUserFriendly } from "../common/writing-style.spec";
import { singleBeaconRegistration } from "../fixtures/singleBeaconRegistration";

describe("As an account holder", () => {
  it("I can add many uses to one of my registrations", () => {
    givenIHaveSignedIn();
    andIHavePreviouslyRegisteredABeacon(testRegistration);

    whenIHaveVisited("/account/your-beacon-registry-account");
    whenIClickTheHexIdOfTheRegistrationIWantToUpdate(testRegistration.hexId);

    whenIClickTheChangeLinkForTheSectionWithHeading("How this beacon is used");
    iCanSeeUseInformation(testRegistration);

    whenIGoToDeleteMy(/main use/i);
    thenIAmPromptedToConfirmDeletionOfMyUse(testRegistration.uses[0]);

    whenIClickTheButtonContaining("Cancel");
    theNumberOfUsesIs(1);
    iCanSeeMyUse(testRegistration.uses[0]);

    whenIHaveAnotherUse();
    andIHaveEnteredMyAviationUse("COMMERCIAL");
    theNumberOfUsesIs(2);
    iCanSeeMyUse(testRegistration.uses[0]);
    iCanSeeMyAviationUse("COMMERCIAL");

    whenIHaveAnotherUse();
    andIHaveEnteredMyLandUse();
    theNumberOfUsesIs(3);
    iCanSeeMyUse(testRegistration.uses[0]);
    iCanSeeMyAviationUse("COMMERCIAL");
    iCanSeeMyLandUse();

    whenIGoToDeleteMy(/second use/i);
    iAmPromptedToConfirm("AVIATION", "GLIDER", "COMMERCIAL");
    whenIClickTheButtonContaining("Yes");
    theNumberOfUsesIs(2);
    iCanSeeMyUse(testRegistration.uses[0]);
    iCanSeeMyLandUse();

    whenIClickContinue();
    iCanSeeMyUse(testRegistration.uses[0]);
    iCanSeeMyLandUse();

    iPerformOperationAndWaitForNewPageToLoad(() =>
      whenIClickTheButtonContaining("Accept and send")
    );
    iCanSeeAPageHeadingThatContains(
      "Your beacon registration has been updated"
    );

    whenIClickTheButtonContaining("Return to your Beacon Registry Account");
    thenTheUrlShouldContain("/account/your-beacon-registry-account");

    whenIClickTheHexIdOfTheRegistrationIJustUpdated(testRegistration.hexId);
    iCanSeeMyUse(testRegistration.uses[0]);
    iCanSeeMyLandUse();

    iCanUseTheBackLinksAndContinueButtonsToNavigateMyMaritimeUse();
    iCanUseTheBackLinksAndContinueButtonsToNavigateMyAviationUse();
    iCanUseTheBackLinksAndContinueButtonsToNavigateMyLandUse();
  });
});

const hexId = randomUkEncodedHexId();

const testRegistration = {
  ...singleBeaconRegistration,
  hexId,
};

const andIHavePreviouslyRegisteredABeacon = iHavePreviouslyRegisteredABeacon;

const whenIClickTheHexIdOfTheRegistrationIWantToUpdate = (hexId: string) => {
  cy.get("a").contains(hexId).click();
};

const whenIClickTheHexIdOfTheRegistrationIJustUpdated =
  whenIClickTheHexIdOfTheRegistrationIWantToUpdate;

const thenIAmPromptedToConfirmDeletionOfMyUse = (use) =>
  cy
    .get("h1")
    .contains(
      new RegExp(
        `(?=.*are you sure)(?=.*${use.environment})(?=.*${use.activity})`,
        "i"
      )
    );

const iCanSeeMyUse = (use): void => {
  cy.get("main").contains(makeEnumValueUserFriendly(use.environment));
  cy.get("main").contains(makeEnumValueUserFriendly(use.activity));
  if (use.environment !== "LAND")
    cy.get("main").contains(makeEnumValueUserFriendly(use.purpose));
};

const iCanSeeUseInformation = (draftRegistration) => {
  draftRegistration.uses.forEach((use) => {
    cy.get("main").contains(new RegExp(use.environment, "i"));
    cy.get("main").contains(new RegExp(use.activity, "i"));
    if (use.environment !== "LAND") {
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

const iCanUseTheBackLinksAndContinueButtonsToNavigateMyMaritimeUse = () => {
  whenIClickTheChangeLinkForTheSectionWithHeading("How this beacon is used");
  theBackLinkContains("manage-my-registrations", "update", "");
  whenIHaveAnotherUse();

  theBackLinkContains("manage-my-registrations", "update", "use", "");

  givenIHaveSelected("#maritime");
  andIClickContinue();

  theBackLinkContains(
    "manage-my-registrations",
    "update",
    "use",
    "/2/",
    "environment"
  );

  givenIHaveSelected("#commercial");
  andIClickContinue();

  theBackLinkContains(
    "manage-my-registrations",
    "update",
    "use",
    "/2/",
    "purpose"
  );

  givenIHaveSelected("#motor-vessel");
  andIClickContinue();

  theBackLinkContains(
    "manage-my-registrations",
    "update",
    "use",
    "/2/",
    "activity"
  );

  givenIHaveEnteredInformationAboutMyVessel();
  andIClickContinue();

  theBackLinkContains(
    "manage-my-registrations",
    "update",
    "use",
    "/2/",
    "about-the-vessel"
  );

  givenIHaveEnteredMyVesselCommunicationDetails();
  andIClickContinue();

  theBackLinkContains(
    "manage-my-registrations",
    "update",
    "use",
    "/2/",
    "vessel-communications"
  );

  whenIClickBack();
  whenIClickBack();
  whenIClickBack();
  whenIClickBack();
  whenIClickBack();
  whenIClickBack();
};

const iCanUseTheBackLinksAndContinueButtonsToNavigateMyAviationUse = () => {
  theBackLinkContains("manage-my-registrations", "update", "");
  whenIHaveAnotherUse();

  theBackLinkContains("manage-my-registrations", "update", "use", "");

  givenIHaveSelected("#aviation");
  andIClickContinue();

  theBackLinkContains(
    "manage-my-registrations",
    "update",
    "use",
    "/3/",
    "environment"
  );

  givenIHaveSelected("#pleasure");
  andIClickContinue();

  theBackLinkContains(
    "manage-my-registrations",
    "update",
    "use",
    "/3/",
    "purpose"
  );

  givenIHaveSelected("#glider");
  andIClickContinue();

  theBackLinkContains(
    "manage-my-registrations",
    "update",
    "use",
    "/3/",
    "activity"
  );

  givenIHaveEnteredInformationAboutMyAircraft();
  andIClickContinue();

  theBackLinkContains(
    "manage-my-registrations",
    "update",
    "use",
    "/3/",
    "about-the-aircraft"
  );

  givenIHaveEnteredMyAircraftCommunicationDetails();
  andIClickContinue();

  theBackLinkContains(
    "manage-my-registrations",
    "update",
    "use",
    "/3/",
    "aircraft-communications"
  );

  whenIClickBack();
  whenIClickBack();
  whenIClickBack();
  whenIClickBack();
  whenIClickBack();
  whenIClickBack();
};

const iCanUseTheBackLinksAndContinueButtonsToNavigateMyLandUse = () => {
  theBackLinkContains("manage-my-registrations", "update", "");
  whenIHaveAnotherUse();

  theBackLinkContains("manage-my-registrations", "update", "use", "");

  givenIHaveSelected("#land");
  andIClickContinue();

  theBackLinkContains(
    "manage-my-registrations",
    "update",
    "use",
    "/4/",
    "environment"
  );

  givenIHaveSelected("#driving");
  andIClickContinue();

  theBackLinkContains(
    "manage-my-registrations",
    "update",
    "use",
    "/4/",
    "activity"
  );

  givenIHaveEnteredMyLandCommunicationDetails();
  andIClickContinue();

  theBackLinkContains(
    "manage-my-registrations",
    "update",
    "use",
    "/4/",
    "land-communications"
  );

  whenIClickBack();
  whenIClickBack();
  whenIClickBack();
  whenIClickBack();
  whenIClickBack();
  whenIClickBack();
};
