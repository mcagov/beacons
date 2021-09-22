import { iHavePreviouslyRegisteredALegacyBeacon } from "../common/i-have-a-legacy-beacon.spec";
import { iHavePreviouslyRegisteredABeacon } from "../common/i-have-previously-registered-a-beacon.spec";
import {
  givenIHaveSignedIn,
  iCanSeeTheBeaconHexIdThatIsAssociatedWithMyEmailAddress,
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
});
