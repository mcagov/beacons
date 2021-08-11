import { Registration } from "../../src/entities/Registration";
import { PageURLs } from "../../src/lib/urls";
import { prettyUseName } from "../../src/lib/writingStyle";
import { singleBeaconRegistration } from "../fixtures/singleBeaconRegistration";
import {
  givenIHaveACookieSetAndHaveSignedIn,
  iAmAt,
  whenIAmAt,
  whenIClickTheButtonContaining,
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
    iAmAskedIfIAmSureIWantToDeleteMyRegistration(singleBeaconRegistration);
    whenIClickTheButtonContaining("Cancel");
    iAmAt(PageURLs.accountHome);
    iCanSeeMyExistingRegistration(
      singleBeaconRegistration.hexId,
      singleBeaconRegistration.ownerFullName
    );
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

const iAmAskedIfIAmSureIWantToDeleteMyRegistration = (
  registration: Registration
) => {
  cy.get("h1").contains(/Are you sure/i);

  // Plays back beacon information to the Account Holder
  cy.get("main").contains(registration.manufacturer);
  cy.get("main").contains(registration.model);
  cy.get("main").contains(registration.hexId);

  // Plays back what the beacon is used for to the Account Holder
  registration.uses.forEach((use) => {
    cy.get("main").contains(prettyUseName(use));
  });
};
