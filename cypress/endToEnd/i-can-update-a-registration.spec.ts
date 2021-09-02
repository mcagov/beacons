import { Registration } from "../../src/entities/Registration";
import { PageURLs } from "../../src/lib/urls";
import { formatDateLong } from "../../src/lib/writingStyle";
import { singleBeaconRegistration } from "../fixtures/singleBeaconRegistration";
import {
  givenIHaveACookieSetAndHaveSignedIn,
  whenIAmAt,
} from "../integration/common/selectors-and-assertions.spec";
import { iCanSeeMyExistingRegistrationHexId } from "./common/i-can-see-my-existing-registration-hex-id.spec";
import {
  iHavePreviouslyRegisteredABeacon,
  randomUkEncodedHexId,
} from "./common/i-have-previously-registered-a-beacon.spec";

describe("As an account holder", () => {
  it("I can update one of my registrations", () => {
    givenIHaveACookieSetAndHaveSignedIn();
    andIHavePreviouslyRegisteredABeacon(testRegistration);

    whenIAmAt(PageURLs.accountHome);
    iCanSeeMyExistingRegistrationHexId(testRegistration.hexId);

    whenIClickOnTheHexIdOfTheRegistrationIWantToUpdate(testRegistration.hexId);
    iCanSeeTheDetailsOfMyExistingRegistration(testRegistration);
  });
});

const testRegistration: Registration = {
  ...singleBeaconRegistration,
  hexId: randomUkEncodedHexId(),
};

const andIHavePreviouslyRegisteredABeacon = iHavePreviouslyRegisteredABeacon;

const whenIClickOnTheHexIdOfTheRegistrationIWantToUpdate = (hexId: string) => {
  cy.get("a").contains(hexId).click();
};

const iCanSeeTheDetailsOfMyExistingRegistration = (
  registration: Registration
) => {
  iCanSeeMyExistingRegistrationHexId(registration.hexId);
  iCanSeeTheHistoryOfMyRegistration(registration);
};

const iCanSeeTheHistoryOfMyRegistration = (registration: Registration) => {
  cy.get(".govuk-summary-list__value")
    .should("contain", "First registered")
    .and("contain", formatDateLong(new Date().toDateString())); // Assume test user registered beacon on same day for ease)

  cy.get(".govuk-summary-list__value")
    .should("contain", "Last updated")
    .and("contain", formatDateLong(new Date().toDateString())); // User has not yet updated the beacon, only created it
};
