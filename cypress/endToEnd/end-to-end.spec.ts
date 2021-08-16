import { PageURLs } from "../../src/lib/urls";
import { sentenceCase } from "../../src/lib/writingStyle";
import {
  testBeaconAndOwnerData,
  testLandUseData,
} from "../integration/common/happy-path-test-data.spec";
import {
  givenIHaveFilledInUpdateAccountDetailsPage,
  iCanSeeMyAccountDetails,
} from "../integration/common/i-can-enter-account-details.spec";
import { givenIHaveEnteredMyBeaconDetails } from "../integration/common/i-can-enter-beacon-information.spec";
import {
  givenIHaveEnteredMyAddressDetails,
  givenIHaveEnteredMyEmergencyContactDetails,
  givenIHaveEnteredMyPersonalDetails,
} from "../integration/common/i-can-enter-owner-information.spec";
import { andIHaveNoFurtherUses } from "../integration/common/i-can-enter-use-information/generic.spec";
import { givenIHaveEnteredMyLandUse } from "../integration/common/i-can-enter-use-information/land.spec";
import {
  givenIHaveACookieSetAndHaveSignedInIVisit,
  givenIHaveClicked,
  thenTheUrlShouldContain,
} from "../integration/common/selectors-and-assertions.spec";

describe("As user with an account", () => {
  const iCanSeeTheBeaconListWithMyInformation = (): void => {
    cy.contains(testBeaconAndOwnerData.beaconDetails.hexId);
    cy.contains(testBeaconAndOwnerData.ownerDetails.fullName);
    cy.contains(sentenceCase(testLandUseData.type.activity));
    const date = new Date();
    cy.contains(date.toISOString().split("T")[0]);
  };

  it("I register a beacon with a single use and see it in my Account page", () => {
    givenIHaveACookieSetAndHaveSignedInIVisit(PageURLs.updateAccount);
    givenIHaveFilledInUpdateAccountDetailsPage();
    iCanSeeMyAccountDetails();
    givenIHaveClicked(".govuk-button");
    givenIHaveEnteredMyBeaconDetails();
    givenIHaveEnteredMyLandUse();
    andIHaveNoFurtherUses();
    givenIHaveEnteredMyPersonalDetails();
    givenIHaveEnteredMyAddressDetails();
    givenIHaveEnteredMyEmergencyContactDetails();
    givenIHaveClicked(".govuk-button--start");
    thenTheUrlShouldContain(PageURLs.applicationComplete);
    givenIHaveClicked(".govuk-button");
    thenTheUrlShouldContain(PageURLs.accountHome);
    iCanSeeTheBeaconListWithMyInformation();
  });
});
