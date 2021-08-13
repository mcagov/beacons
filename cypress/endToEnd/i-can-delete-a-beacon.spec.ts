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
import {
  iHavePreviouslyRegisteredABeacon,
  randomUkEncodedHexId,
} from "./common/i-have-previously-registered-a-beacon.spec";

describe("As an account holder", () => {
  it("I can delete one of my beacons", () => {
    const testRegistration = {
      ...singleBeaconRegistration,
      hexId: randomUkEncodedHexId(),
    };

    givenIHaveACookieSetAndHaveSignedIn();
    andIHavePreviouslyRegisteredABeacon(testRegistration);
    whenIAmAt(PageURLs.accountHome);
    iCanSeeMyExistingRegistration(testRegistration.hexId);

    whenIClickTheDeleteButtonForTheRegistrationWithHexId(
      testRegistration.hexId
    );
    iAmAskedIfIAmSureIWantToDeleteMyRegistration(testRegistration);
    whenIClickTheButtonContaining("Cancel");
    iAmAt(PageURLs.accountHome);
    iCanSeeMyExistingRegistration(testRegistration.hexId);

    whenIClickTheDeleteButtonForTheRegistrationWithHexId(
      testRegistration.hexId
    );
    andIDontSelectAReason();
    andIClickTheButtonContaining("Delete");
    thenIShouldSeeFormErrors("Enter a reason for deleting your registration");

    whenISelectAReasonForDeletion();
    andIClickTheButtonContaining("Delete");
    iAmGivenAConfirmationMessage();

    whenIGoBackToAccountHome();
    myDeletedRegistrationIsNoLongerVisible(testRegistration.hexId);
  });
});

const andIHavePreviouslyRegisteredABeacon = iHavePreviouslyRegisteredABeacon;

export const iCanSeeMyExistingRegistration = (hexId: string): void => {
  cy.get("main").contains(hexId);
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

const andIDontSelectAReason = () => null;

const whenISelectAReasonForDeletion = () => {
  cy.get("#incorrectly_registered").check();
};

const whenIGoBackToAccountHome = () => {
  whenIClickTheButtonContaining("Return to your Account");
  iAmAt(PageURLs.accountHome);
};

const myDeletedRegistrationIsNoLongerVisible = (hexId: string): void => {
  cy.get("main").contains(hexId).should("not.exist");
};
