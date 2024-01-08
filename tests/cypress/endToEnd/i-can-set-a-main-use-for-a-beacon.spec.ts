import {
  andIClickTheButtonContaining,
  givenIHaveSignedIn,
  iHaveClickedOnALinkWithText,
  theClosestTextToACertainTextIsCorrect,
  whenIClickContinue,
  whenIClickTheButtonContaining,
  whenIHaveVisited,
} from "../common/selectors-and-assertions.spec";
import {
  iHavePreviouslyRegisteredABeacon,
  randomUkEncodedHexId,
} from "../common/i-have-previously-registered-a-beacon.spec";
import singleBeaconRegistration from "../fixtures/singleBeaconRegistration.json";
import { givenIHaveEnteredMyLandUse } from "../common/i-can-enter-use-information/land.spec";
import { theNumberOfUsesIs } from "../common/there-are-n-uses.spec";
import { thenIShouldBeOnTheRegistrationSummaryPageForHexId } from "./i-can-update-a-registration.spec";

describe("As an account holder", () => {
  it("I can set my beacons main use", () => {
    givenIHaveSignedIn();
    andIHavePreviouslyRegisteredABeacon(registration);

    whenIHaveVisited("/account/your-beacon-registry-account");

    whenIClickTheHexIdOfTheRegistrationIWantToUpdate(registration.hexId);

    // check it is set as main use
    theClosestTextToACertainTextIsCorrect(
      "Maritime",
      "Is Main Use",
      "govuk-summary-list__value",
      "Yes"
    );

    // add another use
    iHaveClickedOnALinkWithText("update/uses");
    andIClickTheButtonContaining("Add another use for this beacon");
    givenIHaveEnteredMyLandUse();
    theNumberOfUsesIs(2);
    whenIClickContinue();
    thenIShouldBeOnTheRegistrationSummaryPageForHexId(registration.hexId);

    // check it is not main use
    theClosestTextToACertainTextIsCorrect(
      "Land",
      "Is Main Use",
      "govuk-summary-list__value",
      "No"
    );

    // set it as main use
    iHaveClickedOnALinkWithText("Make this the main use");

    // check it is now the main use
    theClosestTextToACertainTextIsCorrect(
      "Land",
      "Is Main Use",
      "govuk-summary-list__value",
      "Yes"
    );
  });
});

const andIHavePreviouslyRegisteredABeacon = iHavePreviouslyRegisteredABeacon;

const registrationHexId = randomUkEncodedHexId();

const registration = {
  ...singleBeaconRegistration,
  hexId: registrationHexId,
};

const whenIClickTheHexIdOfTheRegistrationIWantToUpdate = (hexId: string) => {
  cy.get("a").contains(hexId).click();
};
