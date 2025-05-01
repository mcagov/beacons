import { Beacon } from "../../src/entities/Beacon";
import { Registration } from "../../src/entities/Registration";
import { beaconToRegistration } from "../../src/lib/beaconToRegistration";
import { beaconFixtures } from "../fixtures/beacons.fixture";
import { registrationFixture } from "../fixtures/registration.fixture";

describe("beaconToRegistration", () => {
  it("maps a Beacon to a Registration", () => {
    const beacon: Beacon = beaconFixtures[0];

    const registration: Registration = beaconToRegistration(beacon);

    expect(registration).toStrictEqual(registrationFixture);
  });
});
