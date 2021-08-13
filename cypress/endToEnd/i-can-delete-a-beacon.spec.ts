import { Registration } from "../../src/entities/Registration";
import { PageURLs } from "../../src/lib/urls";
import { prettyUseName } from "../../src/lib/writingStyle";
import { singleBeaconRegistration } from "../fixtures/singleBeaconRegistration";
import {
  andIClickTheButtonContaining,
  givenIHaveACookieSetAndHaveSignedIn,
  iAmAt,
  iCanSeeAButtonContaining,
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
    iAmAskedIfIAmSureIWantToDeleteMyRegistration();
    iAmPresentedWithSomeRegistrationInformation_SoICanMakeSureIAmDeletingTheCorrectRegistration(
      testRegistration
    );

    whenIClickTheButtonContaining("Cancel");
    iAmAt(PageURLs.accountHome);
    iCanSeeMyExistingRegistration(testRegistration.hexId);

    whenIClickTheDeleteButtonForTheRegistrationWithHexId(
      testRegistration.hexId
    );
    andIDontSelectAReason();
    andIClickTheButtonContaining("Delete");
    thenIShouldSeeFormErrors("Enter a reason for deleting your registration");

    whenISelectTheOtherReasonForDeletion();
    andIDontEnterAReasonInTheResultingTextbox();
    thenIShouldSeeFormErrors("Enter a reason for deleting your registration");

    whenIEnterMyReasonInTheResultingTextbox("Lost overboard");
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

const iAmAskedIfIAmSureIWantToDeleteMyRegistration = () => {
  cy.get("h1").contains(/Are you sure/i);
  iCanSeeAButtonContaining("Cancel");
  iCanSeeAButtonContaining("Delete");
};

const iAmPresentedWithSomeRegistrationInformation_SoICanMakeSureIAmDeletingTheCorrectRegistration =
  (registration: Registration) => {
    cy.get("main").within(() => {
      cy.contains(registration.manufacturer);
      cy.contains(registration.model);
      cy.contains(registration.hexId);
    });

    registration.uses.forEach((use) => {
      cy.get("main").contains(prettyUseName(use));
    });
  };

const iAmGivenAConfirmationMessage = () => {
  cy.get("main").contains("Registration deleted");
};

const andIDontSelectAReason = () => null;

const andIDontEnterAReasonInTheResultingTextbox = () => null;

const whenISelectTheOtherReasonForDeletion = () => {
  cy.get("#other").check();
};

const whenIEnterMyReasonInTheResultingTextbox = (reason: string) => {
  cy.get("form input[type=text]").type(reason);
};

const whenIGoBackToAccountHome = () => {
  whenIClickTheButtonContaining("Return to your Account");
  iAmAt(PageURLs.accountHome);
};

const myDeletedRegistrationIsNoLongerVisible = (hexId: string): void => {
  cy.get("main").contains(hexId).should("not.exist");
};
