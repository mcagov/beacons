import { PageURLs } from "../../src/lib/urls";
import { singleBeaconRegistration } from "../fixtures/singleBeaconRegistration";
import {
  givenIHaveACookieSetAndHaveSignedIn,
  whenIAmAt,
} from "../integration/common/selectors-and-assertions.spec";
import { iCanSeeMyExistingRegistration } from "./common/i-can-see-my-existing-registration.spec";
import {
  iHavePreviouslyRegisteredABeacon,
  randomUkEncodedHexId,
} from "./common/i-have-previously-registered-a-beacon.spec";

describe("As an account holder", () => {
  it("I can update one of my registrations", () => {
    const testRegistration = {
      ...singleBeaconRegistration,
      hexId: randomUkEncodedHexId(),
    };

    givenIHaveACookieSetAndHaveSignedIn();
    andIHavePreviouslyRegisteredABeacon(testRegistration);

    whenIAmAt(PageURLs.accountHome);
    iCanSeeMyExistingRegistration(testRegistration.hexId);

    whenIClickOnTheHexIdOfTheRegistrationIWantToUpdate(testRegistration.hexId);
  });
});

const andIHavePreviouslyRegisteredABeacon = iHavePreviouslyRegisteredABeacon;

const whenIClickOnTheHexIdOfTheRegistrationIWantToUpdate = (hexId: string) => {
  cy.get("a").contains(hexId).click();
};
