import { ILegacyBeaconRequest } from "../../src/gateways/interfaces/LegacyBeaconRequest";
import { formatDateLong } from "../../src/lib/writingStyle";
import { iHavePreviouslyRegisteredALegacyBeacon } from "../common/i-have-a-legacy-beacon.spec";
import { iHavePreviouslyRegisteredABeacon } from "../common/i-have-previously-registered-a-beacon.spec";
import {
  clickViewLegacyBeacon,
  givenIHaveSignedIn,
  iCanSeeTheBeaconHexIdThatIsAssociatedWithMyEmailAddress,
  thenIShouldSeeFormErrors,
  thenTheUrlShouldContain,
  whenIClickContinue,
} from "../common/selectors-and-assertions.spec";
import { legacyBeaconRequest } from "../fixtures/legacyBeaconRequest";
import { singleBeaconRegistration } from "../fixtures/singleBeaconRegistration";

describe("As an account holder", () => {
  it("I can view a new and legacy beacon linked to my account/email", () => {
    givenIHaveSignedIn();
    iHavePreviouslyRegisteredALegacyBeacon(legacyBeaconRequest);
    iHavePreviouslyRegisteredABeacon(singleBeaconRegistration);
    cy.visit("/account/your-beacon-registry-account");
    iCanSeeTheBeaconHexIdThatIsAssociatedWithMyEmailAddress(
      legacyBeaconRequest.data.attributes.beacon.hexId
    );
    iCanSeeTheBeaconHexIdThatIsAssociatedWithMyEmailAddress(
      singleBeaconRegistration.hexId
    );
  });

  it.only("I can claim a legacy beacon", () => {
    givenIHaveSignedIn();
    iHavePreviouslyRegisteredALegacyBeacon(legacyBeaconRequest);
    cy.visit("/account/your-beacon-registry-account");
    clickViewLegacyBeacon(legacyBeaconRequest);
    thenTheUrlShouldContain(`/manage-my-registrations/claim-legacy-beacon`);
    iCanSeeTheSelectedLegacyBeacon(legacyBeaconRequest);
    // unhappy path
    whenIClickContinueWithNoOptionsSelected();
    thenIShouldSeeFormErrors("Select an option");
    // happy path
    // givenISelectClaimABeacon();
    // iAmThenRedirectedToTheUpdateFlowForClaimedBeacon();
  });
});

const whenIClickContinueWithNoOptionsSelected = whenIClickContinue;

const iCanSeeTheSelectedLegacyBeacon = (
  legacyBeaconRequest: ILegacyBeaconRequest
) => {
  cy.contains(
    formatDateLong(
      legacyBeaconRequest.data.attributes.beacon.firstRegistrationDate
    )
  );
  cy.contains(
    formatDateLong(legacyBeaconRequest.data.attributes.beacon.lastModifiedDate)
  );
  cy.contains(legacyBeaconRequest.data.attributes.beacon.hexId);
  cy.contains(legacyBeaconRequest.data.attributes.beacon.manufacturer);
  cy.contains(legacyBeaconRequest.data.attributes.beacon.model);
};
