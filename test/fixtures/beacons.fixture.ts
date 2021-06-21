import { IBeacon } from "../../src/entities/beacon";
import { BeaconStatus } from "../../src/lib/registration/types";
import { deepFreeze } from "../utils/deepFreeze";
import { emergencyContactsFixture } from "./emergencyContacts.fixture";
import { testOwners } from "./owner.fixture";
import { usesFixture } from "./uses.fixture";

export const beaconFixture: IBeacon = deepFreeze({
  id: "f48e8212-2e10-4154-95c7-bdfd061bcfd2",
  hexId: "1D0EA08C52FFBFF",
  type: "Beacon type to be derived from Hex ID",
  protocolCode: "Protocol code to be derived from Hex ID",
  codingMethod: "Coding method to be derived from Hex ID",
  registeredDate: "2018-06-08",
  status: BeaconStatus.NEW,
  manufacturer: "Ocean Signal",
  model: "Excelsior",
  manufacturerSerialNumber: "1407312904",
  chkCode: "456QWE",
  batteryExpiryDate: "2020-02-01",
  lastServicedDate: "2020-02-01",
  uses: usesFixture,
  owners: testOwners,
  emergencyContacts: emergencyContactsFixture,
  entityLinks: [
    { verb: "GET", path: "/beacons/f48e8212-2e10-4154-95c7-bdfd061bcfd2" },
    { verb: "PATCH", path: "/beacons/f48e8212-2e10-4154-95c7-bdfd061bcfd2" },
  ],
});
