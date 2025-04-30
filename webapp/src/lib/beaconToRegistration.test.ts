import { Beacon } from "../entities/Beacon";
import { Registration } from "../entities/Registration";
import { beaconToRegistration } from "./beaconToRegistration";
import { beaconFixtures } from "../../test/fixtures/beacons.fixture";
import { registrationFixture } from "../../test/fixtures/registration.fixture";

describe("beaconToRegistration", () => {
  it("maps a Beacon to a Registration", () => {
    const beacon: Beacon = beaconFixtures[0];

    const registration: Registration = beaconToRegistration(beacon);

    expect(registration).toStrictEqual(registrationFixture);
  });
});
