import { iHavePreviouslyRegisteredALegacyBeacon } from "../common/i-have-a-legacy-beacon.spec";
import { givenIHaveSignedIn } from "../common/selectors-and-assertions.spec";
import { legacyBeaconRequest } from "../fixtures/legacyBeaconRequest";

describe("As an account holder", () => {
  it("I can view a legacy beacon linked to my email", () => {
    givenIHaveSignedIn();
    iHavePreviouslyRegisteredALegacyBeacon(legacyBeaconRequest);
    cy.visit("/account/your-beacon-registry-account");
  });
});
