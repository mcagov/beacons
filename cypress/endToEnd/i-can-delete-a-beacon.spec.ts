import { Registration } from "../../src/entities/Registration";
import { AccountPageURLs } from "../../src/lib/urls";
import { prettyUseName } from "../../src/lib/writingStyle";
import { iCanSeeMyExistingRegistrationHexId } from "../common/i-can-see-my-existing-registration-hex-id.spec";
import {
  iHavePreviouslyRegisteredABeacon,
  randomUkEncodedHexId,
} from "../common/i-have-previously-registered-a-beacon.spec";
import {
  andIClickTheButtonContaining,
  givenIHaveACookieSetAndHaveSignedInIVisit,
  iCanSeeAButtonContaining,
  iHaveVisited,
  iPerformOperationAndWaitForNewPageToLoad,
  thenIShouldSeeFormErrors,
  whenIClickTheButtonContaining,
} from "../common/selectors-and-assertions.spec";
import { singleBeaconRegistration } from "../fixtures/singleBeaconRegistration";

describe("As an account holder", () => {
  it("I can delete one of my beacons", () => {
    const testRegistration = {
      ...singleBeaconRegistration,
      hexId: randomUkEncodedHexId(),
    };

    givenIHaveACookieSetAndHaveSignedInIVisit(AccountPageURLs.accountHome);
    andIHavePreviouslyRegisteredABeacon(testRegistration);
    iCanSeeMyExistingRegistrationHexId(testRegistration.hexId);

    whenIClickTheDeleteButtonForTheRegistrationWithHexId(
      testRegistration.hexId
    );
    iAmAskedIfIAmSureIWantToDeleteMyRegistration();
    iAmPresentedWithSomeRegistrationInformation_SoICanMakeSureIAmDeletingTheCorrectRegistration(
      testRegistration
    );

    whenIClickTheButtonContaining("Cancel");
    iHaveVisited(AccountPageURLs.accountHome);
    iCanSeeMyExistingRegistrationHexId(testRegistration.hexId);

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
    iPerformOperationAndWaitForNewPageToLoad(() =>
      andIClickTheButtonContaining("Delete")
    );
    iAmGivenAConfirmationMessage();

    whenIGoBackToAccountHome();
    myDeletedRegistrationIsNoLongerVisible(testRegistration.hexId);
  });
});

const andIHavePreviouslyRegisteredABeacon = iHavePreviouslyRegisteredABeacon;

const whenIClickTheDeleteButtonForTheRegistrationWithHexId = (
  hexId: string
) => {
  cy.get("tr")
    .contains(hexId)
    .parent()
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
  iHaveVisited(AccountPageURLs.accountHome);
};

const myDeletedRegistrationIsNoLongerVisible = (hexId: string): void => {
  cy.get("main").contains(hexId).should("not.exist");
};
