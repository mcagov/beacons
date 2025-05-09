import { iCanSeeMyExistingRegistrationHexId } from "../common/i-can-see-my-existing-registration-hex-id.spec";
import {
  iHavePreviouslyRegisteredABeacon,
  randomUkEncodedHexId,
} from "../common/i-have-previously-registered-a-beacon.spec";
import {
  andIClickTheButtonContaining,
  givenIHaveACookieSetAndHaveSignedInIVisit,
  givenIHaveSignedIn,
  iCanSeeAButtonContaining,
  iCanSeeNLinksContaining,
  iHaveVisited,
  iPerformOperationAndWaitForNewPageToLoad,
  thenIShouldSeeFormErrors,
  whenIClickTheButtonContaining,
  whenIClickTheLinkContaining,
} from "../common/selectors-and-assertions.spec";
import { prettyUseName } from "../common/writing-style.spec";
import singleBeaconRegistration from "../fixtures/singleBeaconRegistration.json";

describe("As an account holder", () => {
  it("I can delete one of my beacons", () => {
    const testRegistration = {
      ...singleBeaconRegistration,
      hexId: randomUkEncodedHexId(),
    };

    givenIHaveSignedIn();
    andIHavePreviouslyRegisteredABeacon(testRegistration);
    givenIHaveACookieSetAndHaveSignedInIVisit(
      "/account/your-beacon-registry-account",
    );
    iCanSeeMyExistingRegistrationHexId(testRegistration.hexId);

    whenIClickTheDeleteButtonForTheRegistrationWithHexId(
      testRegistration.hexId,
    );
    iAmAskedIfIAmSureIWantToDeleteMyRegistration();
    iAmPresentedWithSomeRegistrationInformation_SoICanMakeSureIAmDeletingTheCorrectRegistration(
      testRegistration,
    );

    whenIClickTheLinkContaining("Cancel");
    iHaveVisited("/account/your-beacon-registry-account");
    iCanSeeMyExistingRegistrationHexId(testRegistration.hexId);

    whenIClickTheDeleteButtonForTheRegistrationWithHexId(
      testRegistration.hexId,
    );
    andIDontSelectAReason();
    andIClickTheButtonContaining("Delete");
    thenIShouldSeeFormErrors("Enter a reason for deleting your registration");

    whenISelectTheOtherReasonForDeletion();
    andIDontEnterAReasonInTheResultingTextbox();
    thenIShouldSeeFormErrors("Enter a reason for deleting your registration");

    whenIEnterMyReasonInTheResultingTextbox("Lost overboard");
    iPerformOperationAndWaitForNewPageToLoad(() =>
      andIClickTheButtonContaining("Delete"),
    );
    iAmGivenAConfirmationMessage();

    whenIGoBackToAccountHome();
    myDeletedRegistrationIsNoLongerVisible(testRegistration.hexId);
  });
});

const andIHavePreviouslyRegisteredABeacon = iHavePreviouslyRegisteredABeacon;

const whenIClickTheDeleteButtonForTheRegistrationWithHexId = (
  hexId: string,
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
  iCanSeeNLinksContaining(1, "Cancel");
  iCanSeeAButtonContaining("Delete");
};

const iAmPresentedWithSomeRegistrationInformation_SoICanMakeSureIAmDeletingTheCorrectRegistration =
  (registration) => {
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
  whenIClickTheButtonContaining("Return to your Beacon Registry Account");
  iHaveVisited("/account/your-beacon-registry-account");
};

const myDeletedRegistrationIsNoLongerVisible = (hexId: string): void => {
  cy.get("main").contains(hexId).should("not.exist");
};
