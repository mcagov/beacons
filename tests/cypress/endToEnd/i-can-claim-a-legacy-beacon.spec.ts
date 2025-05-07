import {
  givenIHaveFilledInBeaconInformationPage,
  iCanSeeMyAdditionalBeaconInformation,
} from "../common/i-can-enter-beacon-information.spec";
import {
  givenIHaveEnteredMyEmergencyContactDetails,
  givenIHaveEnteredMyPersonalDetails,
  givenIHaveEnteredMyUnitedKingdomAddressDetails,
  givenIHaveSelectedAUnitedKingdomAddress,
  iCanSeeMyEmergencyContactDetails,
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
  givenIHaveVisited,
  iCannotSee,
  iCanSeeAPageHeadingThatContains,
  iCanSeeNLinksContaining,
  iCanSeeText,
  iCanSeeTheBeaconHexIdThatIsAssociatedWithMyEmailAddress,
  ifIAmAskedForAccountHolderDetailsIProvideThem,
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
import { formatDateLong } from "../common/writing-style.spec";
import { legacyBeaconRequestFixture } from "../fixtures/legacyBeaconRequest.fixture";
import fixture from "../fixtures/singleBeaconRegistration.json";

describe("As an account holder", () => {
  it("I can view a new and legacy beacon linked to my account/email", () => {
    givenIHaveSignedIn();

    iHavePreviouslyRegisteredALegacyBeacon(legacyBeaconRequestFixture);
    iHavePreviouslyRegisteredABeacon(fixture);
    givenIHaveVisited("/account/your-beacon-registry-account");

    ifIAmAskedForAccountHolderDetailsIProvideThem();

    iCanSeeTheBeaconHexIdThatIsAssociatedWithMyEmailAddress(
      legacyBeaconRequestFixture.data.attributes.beacon.hexId
    );
    iCanSeeTheBeaconHexIdThatIsAssociatedWithMyEmailAddress(fixture.hexId);
  });

  it.only("I can claim a legacy beacon", () => {
    const legacyBeaconRequest = { ...legacyBeaconRequestFixture };
    legacyBeaconRequest.data.attributes.beacon.hexId = randomUkEncodedHexId();
    const { hexId, manufacturer, model } =
      legacyBeaconRequest.data.attributes.beacon;

    givenIHaveSignedIn();
    givenIHavePreviouslyRegisteredALegacyBeacon(legacyBeaconRequest);
    givenIHaveVisited("/account/your-beacon-registry-account");

    whenIHaveVisited("/account/your-beacon-registry-account");
    iCanSeeTheLegacyBeaconAssignedToMeInTheTable(hexId);

    whenIClickOnTheHexIdOfTheLegacyBeaconAssignedToMe(hexId);
    iCanSeeHighLevelInformationAboutTheLegacyBeacon(legacyBeaconRequest);

    whenIClickContinueWithNoOptionsSelected();
    thenIShouldSeeFormErrors("Select an option");

    whenISelect("#claim");
    andIClickContinue();
    thenTheUrlShouldContain("/register-a-beacon/check-beacon-details");

    // Back button from the Create flow goes back to claim/reject page.  User
    // cannot go use back button to edit hexId, manufacturer, model.
    whenIClickBack();
    iCanSeeHighLevelInformationAboutTheLegacyBeacon(legacyBeaconRequest);
    iAmGivenTheOptionToClaimOrRejectTheLegacyBeacon();

    whenISelect("#claim");
    andIClickContinue();
    andIClickContinue();
    givenIHaveFilledInBeaconInformationPage();
    givenIHaveEnteredMyMaritimeUse("PLEASURE");
    andIHaveNoFurtherUses();
    givenIHaveEnteredMyPersonalDetails();
    // HERE IS THE FAILURE
    givenIHaveSelectedAUnitedKingdomAddress();
    givenIHaveEnteredMyUnitedKingdomAddressDetails();
    givenIHaveEnteredMyEmergencyContactDetails();
    iCanSeeText(hexId);
    iCanSeeText(manufacturer);
    iCanSeeText(model);
    iCanSeeMyAdditionalBeaconInformation();
    iCanSeeMyMaritimeUse("PLEASURE");
    iCanSeeMyEmergencyContactDetails();

    iPerformOperationAndWaitForNewPageToLoad(() => {
      whenIClickTheButtonContaining("Accept and send");
    });
    iCanSeeAPageHeadingThatContains("Beacon registration complete");

    whenIClickTheButtonContaining("Return to your Beacon Registry Account");
    thereIsOnlyOneBeaconListedForHexId(hexId);
    theBeaconListedForHexIdIsNotALegacyBeacon(hexId);

    whenIClickTheActionLinkInATableRowContaining(hexId, /update/i);
    iCanSeeText(hexId);
    iCanSeeText(manufacturer);
    iCanSeeText(model);
    iCanSeeMyAdditionalBeaconInformation();
    iCanSeeMyMaritimeUse("PLEASURE");
    iCanSeeMyEmergencyContactDetails();
  });
});

const iCanSeeTheLegacyBeaconAssignedToMeInTheTable = (hexId: string) => {
  iCannotSee(`a[href*=${hexId}]`);
  iCanSeeText(hexId);
};

const thereIsOnlyOneBeaconListedForHexId = (hexId: string): void => {
  iCanSeeNLinksContaining(1, hexId);
};

const theBeaconListedForHexIdIsNotALegacyBeacon = (hexId: string) => {
  cy.get("th")
    .contains(hexId)
    .parent()
    .parent()
    .contains(/update/i);
};

const whenIClickContinueWithNoOptionsSelected = whenIClickContinue;

const iCanSeeHighLevelInformationAboutTheLegacyBeacon = (
  legacyBeaconRequest
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
  // TODO: Implement reject flow
  // iCanSeeText(/this is not my beacon/i);
};
