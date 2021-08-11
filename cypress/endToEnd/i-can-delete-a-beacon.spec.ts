import { PageURLs } from "../../src/lib/urls";
import { singleBeaconRegistration } from "../fixtures/singleBeaconRegistration";
import {
  givenIHaveACookieSetAndHaveSignedIn,
  whenIAmAt,
} from "../integration/common/selectors-and-assertions.spec";
import { iHavePreviouslyRegisteredABeacon } from "./common/i-have-previously-registered-a-beacon.spec";

describe("As an account holder", () => {
  it("I can delete one of my beacons", () => {
    givenIHaveACookieSetAndHaveSignedIn();
    // andIHavePreviouslyRegisteredABeacon(singleBeaconRegistration);
    whenIAmAt(PageURLs.accountHome);
    iCanSeeMyExistingRegistration(
      singleBeaconRegistration.hexId,
      singleBeaconRegistration.ownerFullName
    );

    whenIClickTheDeleteButtonForTheRegistrationWithHexId(
      singleBeaconRegistration.hexId
    );
    // iAmAskedIfIAmSureIWantToDeleteMyRegistration();
  });
});

const andIHavePreviouslyRegisteredABeacon = iHavePreviouslyRegisteredABeacon;

export const iCanSeeMyExistingRegistration = (
  hexId: string,
  ownerFullName: string
): void => {
  cy.get("main").contains(hexId);
  cy.get("main").contains(ownerFullName);
};

const whenIClickTheDeleteButtonForTheRegistrationWithHexId = (
  hexId: string
) => {
  cy.get("tr")
    .contains(hexId)
    .parent()
    .contains(/delete/i)
    .click();
};
