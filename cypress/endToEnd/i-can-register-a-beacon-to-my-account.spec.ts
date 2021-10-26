import {
  AccountPageURLs,
  CreateRegistrationPageURLs,
} from "../../src/lib/urls";
import { sentenceCase } from "../../src/lib/writingStyle";
import {
  testBeaconAndOwnerData,
  testLandUseData,
} from "../common/happy-path-test-data.spec";
import { givenIHaveEnteredMyBeaconDetails } from "../common/i-can-enter-beacon-information.spec";
import {
  givenIHaveEnteredMyEmergencyContactDetails,
  givenIHaveEnteredMyPersonalDetails,
  givenIHaveEnteredMyUnitedKingdomAddressDetails,
  givenIHaveSelectedAUnitedKingdomAddress,
} from "../common/i-can-enter-owner-information.spec";
import { andIHaveNoFurtherUses } from "../common/i-can-enter-use-information/generic.spec";
import { givenIHaveEnteredMyLandUse } from "../common/i-can-enter-use-information/land.spec";
import {
  givenIHaveClicked,
  givenIHaveClickedTheButtonContaining,
  givenIHaveSignedIn,
  givenIHaveVisited,
  iCanSeeTextInSummaryListRowWithHeading,
  ifIAmAskedForAccountHolderDetailsIProvideThem,
  iPerformOperationAndWaitForNewPageToLoad,
  thenTheUrlShouldContain,
} from "../common/selectors-and-assertions.spec";

describe("As user with an account", () => {
  it("I register a beacon with a single use and see it in my Account page and I can click to start to create another beacon", () => {
    givenIHaveSignedIn();
    givenIHaveVisited(AccountPageURLs.accountHome);
    ifIAmAskedForAccountHolderDetailsIProvideThem();

    givenIHaveClickedToCreateANewBeacon();
    givenIHaveEnteredMyBeaconDetails();
    givenIHaveEnteredMyLandUse();
    andIHaveNoFurtherUses();
    givenIHaveEnteredMyPersonalDetails();
    givenIHaveSelectedAUnitedKingdomAddress();
    givenIHaveEnteredMyUnitedKingdomAddressDetails();
    givenIHaveEnteredMyEmergencyContactDetails();
    iPerformOperationAndWaitForNewPageToLoad(() =>
      givenIHaveClickedTheButtonContaining("Accept and send")
    );
    thenTheUrlShouldContain(CreateRegistrationPageURLs.applicationComplete);

    givenIHaveClickedToGoBackToMyAccount();
    thenTheUrlShouldContain(AccountPageURLs.accountHome);
    iCanSeeTheBeaconListWithMyInformation();

    whenIClickOnTheBeaconIHaveJustRegistered();
    iCanSeeAllTheDataIEntered();

    givenIHaveVisited(AccountPageURLs.accountHome);
    givenIHaveClickedToCreateANewBeacon();
    thenTheUrlShouldContain(CreateRegistrationPageURLs.checkBeaconDetails);
  });
});

const iCanSeeTheBeaconListWithMyInformation = (): void => {
  cy.contains(testBeaconAndOwnerData.beaconDetails.hexId);
  cy.contains(testBeaconAndOwnerData.ownerDetails.fullName);
  cy.contains(sentenceCase(testLandUseData.type.activity));
};

const givenIHaveClickedToCreateANewBeacon = () =>
  givenIHaveClicked(".govuk-button");

const givenIHaveClickedToGoBackToMyAccount = () => {
  givenIHaveClicked(".govuk-button");
};

const whenIClickOnTheBeaconIHaveJustRegistered = () => {
  cy.get("a").contains(testBeaconAndOwnerData.beaconDetails.hexId).click();
};

const iCanSeeAllTheDataIEntered = () => {
  iCanSeeDataInSummaryListRowWithHeading(
    Object.values(testBeaconAndOwnerData.beaconDetails),
    "Beacon information"
  );

  iCanSeeTextInSummaryListRowWithHeading(
    testBeaconAndOwnerData.additionalBeaconInformation.serialNumber,
    "Additional beacon information"
  );
  iCanSeeTextInSummaryListRowWithHeading(
    testBeaconAndOwnerData.additionalBeaconInformation.chkCode,
    "Additional beacon information"
  );
  iCanSeeTextInSummaryListRowWithHeading(
    testBeaconAndOwnerData.additionalBeaconInformation.csta,
    "Additional beacon information"
  );

  iCanSeeDataInSummaryListRowWithHeading(
    Object.values(testBeaconAndOwnerData.ownerDetails),
    "Owner details"
  );

  iCanSeeDataInSummaryListRowWithHeading(
    [...Object.values(testBeaconAndOwnerData.ownerAddress), "United Kingdom"],
    "Address"
  );

  iCanSeeDataInSummaryListRowWithHeading(
    Object.values(testBeaconAndOwnerData.emergencyContacts).slice(0, 3),
    "Contact 1"
  );

  iCanSeeDataInSummaryListRowWithHeading(
    Object.values(testBeaconAndOwnerData.emergencyContacts).slice(3, 6),
    "Contact 2"
  );

  iCanSeeDataInSummaryListRowWithHeading(
    Object.values(testBeaconAndOwnerData.emergencyContacts).slice(6, 9),
    "Contact 3"
  );
};

const iCanSeeDataInSummaryListRowWithHeading = (
  data: string[],
  heading: string
): void => {
  data.forEach((data) => {
    iCanSeeTextInSummaryListRowWithHeading(data, heading);
  });
};
