import { ILegacyBeaconRequest } from "../../src/gateways/interfaces/LegacyBeaconRequest";
import { Purpose } from "../../src/lib/deprecatedRegistration/types";
import {
  AccountPageURLs,
  CreateRegistrationPageURLs,
} from "../../src/lib/urls";
import { formatDateLong } from "../../src/lib/writingStyle";
import {
  givenIHaveFilledInBeaconInformationPage,
  iCanSeeMyAdditionalBeaconInformation,
} from "../common/i-can-enter-beacon-information.spec";
import {
  givenIHaveEnteredMyAddressDetails,
  givenIHaveEnteredMyEmergencyContactDetails,
  givenIHaveEnteredMyPersonalDetails,
  iCanSeeMyAddressDetails,
  iCanSeeMyEmergencyContactDetails,
  iCanSeeMyPersonalDetails,
} from "../common/i-can-enter-owner-information.spec";
import { andIHaveNoFurtherUses } from "../common/i-can-enter-use-information/generic.spec";
import {
  givenIHaveEnteredMyMaritimeUse,
  iCanSeeMyMaritimeUse,
} from "../common/i-can-enter-use-information/maritime.spec";
import {
  givenIHavePreviouslyRegisteredALegacyBeacon,
  iHavePreviouslyRegisteredALegacyBeacon,
} from "../common/i-have-a-legacy-beacon.spec";
import {
  iHavePreviouslyRegisteredABeacon,
  randomUkEncodedHexId,
} from "../common/i-have-previously-registered-a-beacon.spec";
import {
  andIClickContinue,
  givenIHaveSignedIn,
  iCannotSee,
  iCanSeeAPageHeadingThatContains,
  iCanSeeNLinksContaining,
  iCanSeeText,
  iCanSeeTheBeaconHexIdThatIsAssociatedWithMyEmailAddress,
  iPerformOperationAndWaitForNewPageToLoad,
  thenIShouldSeeFormErrors,
  thenTheUrlShouldContain,
  whenIClickBack,
  whenIClickContinue,
  whenIClickTheActionLinkInATableRowContaining,
  whenIClickTheButtonContaining,
  whenIHaveVisited,
  whenISelect,
} from "../common/selectors-and-assertions.spec";
import { legacyBeaconRequestFixture } from "../fixtures/legacyBeaconRequest.fixture";
import { singleBeaconRegistration } from "../fixtures/singleBeaconRegistration";

describe("As an account holder", () => {
  it("I can view a new and legacy beacon linked to my account/email", () => {
    givenIHaveSignedIn();
    iHavePreviouslyRegisteredALegacyBeacon(legacyBeaconRequestFixture);
    iHavePreviouslyRegisteredABeacon(singleBeaconRegistration);
    cy.visit("/account/your-beacon-registry-account");
    iCanSeeTheBeaconHexIdThatIsAssociatedWithMyEmailAddress(
      legacyBeaconRequestFixture.data.attributes.beacon.hexId
    );
    iCanSeeTheBeaconHexIdThatIsAssociatedWithMyEmailAddress(
      singleBeaconRegistration.hexId
    );
  });

  it.only("I can claim a legacy beacon", () => {
    const legacyBeaconRequest = { ...legacyBeaconRequestFixture };
    legacyBeaconRequest.data.attributes.beacon.hexId = randomUkEncodedHexId();
    const { hexId, manufacturer, model } =
      legacyBeaconRequest.data.attributes.beacon;

    givenIHavePreviouslyRegisteredALegacyBeacon(legacyBeaconRequest);
    givenIHaveSignedIn();

    whenIHaveVisited(AccountPageURLs.accountHome);
    iCanSeeTheLegacyBeaconAssignedToMeInTheTable(hexId);

    whenIClickOnTheHexIdOfTheLegacyBeaconAssignedToMe(hexId);
    iCanSeeHighLevelInformationAboutTheLegacyBeacon(legacyBeaconRequest);

    whenIClickContinueWithNoOptionsSelected();
    thenIShouldSeeFormErrors("Select an option");

    whenISelect("#claim");
    andIClickContinue();
    thenTheUrlShouldContain(CreateRegistrationPageURLs.beaconInformation);

    // Back button from the Create flow goes back to claim/reject page.  User
    // cannot go use back button to edit hexId, manufacturer, model.
    whenIClickBack();
    iCanSeeHighLevelInformationAboutTheLegacyBeacon(legacyBeaconRequest);
    iAmGivenTheOptionToClaimOrRejectTheLegacyBeacon();

    whenISelect("#claim");
    andIClickContinue();
    givenIHaveFilledInBeaconInformationPage();
    givenIHaveEnteredMyMaritimeUse(Purpose.PLEASURE);
    andIHaveNoFurtherUses();
    givenIHaveEnteredMyPersonalDetails();
    givenIHaveEnteredMyAddressDetails();
    givenIHaveEnteredMyEmergencyContactDetails();
    iCanSeeText(hexId);
    iCanSeeText(manufacturer);
    iCanSeeText(model);
    iCanSeeMyAdditionalBeaconInformation();
    iCanSeeMyMaritimeUse(Purpose.PLEASURE);
    iCanSeeMyPersonalDetails();
    iCanSeeMyAddressDetails();
    iCanSeeMyEmergencyContactDetails();

    iPerformOperationAndWaitForNewPageToLoad(() => {
      whenIClickTheButtonContaining("Accept and send");
    });
    iCanSeeAPageHeadingThatContains("Application Complete");

    whenIClickTheButtonContaining("Return to your Account");
    iCanSeeTheClaimedBeaconAsANormalRegistration(hexId);

    whenIClickTheActionLinkInATableRowContaining(hexId, /update/i);
    iCanSeeText(hexId);
    iCanSeeText(manufacturer);
    iCanSeeText(model);
    iCanSeeMyAdditionalBeaconInformation();
    iCanSeeMyMaritimeUse(Purpose.PLEASURE);
    iCanSeeMyPersonalDetails();
    iCanSeeMyAddressDetails();
    iCanSeeMyEmergencyContactDetails();
  });
});

const iCanSeeTheLegacyBeaconAssignedToMeInTheTable = (hexId: string) => {
  iCannotSee(`a[href*=${hexId}]`);
  iCanSeeText(hexId);
};

const iCanSeeTheClaimedBeaconAsANormalRegistration = (hexId: string) => {
  iCanSeeNLinksContaining(1, hexId);
  cy.get("main")
    .contains(hexId)
    .parent()
    .parent()
    .contains(/update/i)
    .click();

  cy.get("main")
    .contains(hexId)
    .parent()
    .parent()
    .contains(/update/i)
    .click();
};

const whenIClickContinueWithNoOptionsSelected = whenIClickContinue;

const iCanSeeHighLevelInformationAboutTheLegacyBeacon = (
  legacyBeaconRequest: ILegacyBeaconRequest
) => {
  cy.contains(
    formatDateLong(
      legacyBeaconRequest.data.attributes.beacon.firstRegistrationDate
    )
  );
  cy.contains(
    formatDateLong(legacyBeaconRequest.data.attributes.beacon.lastModifiedDate)
  );
  cy.contains(legacyBeaconRequest.data.attributes.beacon.hexId);
  cy.contains(legacyBeaconRequest.data.attributes.beacon.manufacturer);
  cy.contains(legacyBeaconRequest.data.attributes.beacon.model);
};

const whenIClickOnTheHexIdOfTheLegacyBeaconAssignedToMe = (hexId: string) => {
  cy.get("main")
    .contains(hexId)
    .parent()
    .contains(/Claim this beacon/i)
    .click();
};

const iAmGivenTheOptionToClaimOrRejectTheLegacyBeacon = () => {
  iCanSeeAPageHeadingThatContains("Is this beacon yours?");
  iCanSeeText(/this is my beacon/i);
  iCanSeeText(/this is not my beacon/i);
};
