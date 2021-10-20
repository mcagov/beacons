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
