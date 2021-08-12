import { Registration } from "../../src/entities/Registration";
import { PageURLs } from "../../src/lib/urls";
import { prettyUseName } from "../../src/lib/writingStyle";
import { singleBeaconRegistration } from "../fixtures/singleBeaconRegistration";
import {
  andIClickTheButtonContaining,
  givenIHaveACookieSetAndHaveSignedIn,
  iAmAt,
  thenIShouldSeeFormErrors,
  whenIAmAt,
  whenIClickTheButtonContaining,
} from "../integration/common/selectors-and-assertions.spec";
import { iHavePreviouslyRegisteredABeacon } from "./common/i-have-previously-registered-a-beacon.spec";

describe("As an account holder", () => {
  it("I can delete one of my beacons", () => {
    givenIHaveACookieSetAndHaveSignedIn();
    // randomise HexID to remove test bleed, update singleBeaconRegistration
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

    whenIClickTheDeleteButtonForTheRegistrationWithHexId(
      singleBeaconRegistration.hexId
    );
    andIDontSelectAReason();
    andIClickTheButtonContaining("Delete");
    thenIShouldSeeFormErrors("Enter a reason for deleting your registration");

    whenISelectAReasonForDeletion();
    andIClickTheButtonContaining("Delete");
    iAmGivenAConfirmationMessage();
    // iAmGivenAReferenceNumber();

    // myRegistrationNoLongerExists(); // Go back to Account Home and assert hexId doesn't appear
    // Teardown: clear database
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

const iAmGivenAConfirmationMessage = () => {
  cy.get("main").contains("Registration deleted");
};

const iAmGivenAReferenceNumber = () => {
  cy.get("main").contains("Your reference number");
};

const andIDontSelectAReason = () => null;

const whenISelectAReasonForDeletion = () => {
  cy.get("#incorrectly_registered").check();
};
