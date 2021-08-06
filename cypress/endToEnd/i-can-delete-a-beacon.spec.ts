import { PageURLs } from "../../src/lib/urls";
import { singleBeaconRegistration } from "../fixtures/singleBeaconRegistration";
import {
  givenIHaveACookieSetAndHaveSignedIn,
  whenIAmAt,
} from "../integration/common/selectors-and-assertions.spec";
import {
  iCanSeeMyExistingRegistration,
  iHavePreviouslyRegisteredABeacon,
} from "./common/i-have-previously-registered-a-beacon.spec";

describe("As an account holder", () => {
  it("I can delete one of my beacons", () => {
    givenIHaveACookieSetAndHaveSignedIn();
    andIHavePreviouslyRegisteredABeacon(singleBeaconRegistration);
    whenIAmAt(PageURLs.accountHome);
    iCanSeeMyExistingRegistration();

    // TODO: Tests to delete an existing registration
  });
});

const andIHavePreviouslyRegisteredABeacon = iHavePreviouslyRegisteredABeacon;
