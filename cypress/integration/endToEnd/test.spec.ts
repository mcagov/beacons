import { PageURLs } from "../../../src/lib/urls";
import { sentenceCase } from "../../../src/lib/utils";
import {
  testBeaconAndOwnerData,
  testLandUseData,
} from "../common/happy-path-test-data.spec";
import { givenIHaveEnteredMyBeaconDetails } from "../common/i-can-enter-beacon-information.spec";
import {
  givenIHaveEnteredMyAddressDetails,
  givenIHaveEnteredMyEmergencyContactDetails,
  givenIHaveEnteredMyPersonalDetails,
} from "../common/i-can-enter-owner-information.spec";
import { andIHaveNoFurtherUses } from "../common/i-can-enter-use-information/generic.spec";
import { givenIHaveEnteredMyLandUse } from "../common/i-can-enter-use-information/land.spec";
import {
  givenIHaveACookieSetAndHaveSignedInIVisit,
  givenIHaveClicked,
  iCanSeeATableCaptionThatContains,
  thenTheUrlShouldContain,
} from "../common/selectors-and-assertions.spec";

describe("As user with an account", () => {
  const iCanSeeTheBeaconListWithMyInformation = (): void => {
    cy.contains(testBeaconAndOwnerData.beaconDetails.hexId);
    cy.contains(testBeaconAndOwnerData.ownerDetails.fullName);
    cy.contains(sentenceCase(testLandUseData.type.activity));
    const date = new Date();
    cy.contains(date.toISOString().split("T")[0]);
  };

  it("I register a beacon with a single use and see it in my Account page", () => {
    givenIHaveACookieSetAndHaveSignedInIVisit(PageURLs.accountHome);
    // Will fail locally if you run the test multiple times
    iCanSeeATableCaptionThatContains("0 registered beacons");
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
    // Will fail locally if you run the test multiple times
    iCanSeeATableCaptionThatContains("1 registered beacons");
    iCanSeeTheBeaconListWithMyInformation();
  });
});
