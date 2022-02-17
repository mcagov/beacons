import { BeaconStatuses, IBeacon } from "../entities/IBeacon";
import { IEmergencyContact } from "../entities/IEmergencyContact";
import { IUse } from "../entities/IUse";
import { deepFreeze } from "../utils";
import { emergencyContactsFixture } from "./emergencyContacts.fixture";
import { testOwners } from "./owner.fixture";
import { usesFixture } from "./uses.fixture";

export const beaconFixture = deepFreeze<IBeacon>({
  id: "f48e8212-2e10-4154-95c7-bdfd061bcfd2",
  hexId: "1D0EA08C52FFBFF",
  beaconType: "Beacon type to be derived from Hex ID",
  protocol: "Protocol code to be derived from Hex ID",
  coding: "Coding method to be derived from Hex ID",
  registeredDate: "08/06/2018",
  status: BeaconStatuses.New,
  manufacturer: "Ocean Signal",
  referenceNumber: "REF1234",
  mti: "EXAMPLE MTI",
  svdr: "true",
  csta: "CSTA EXAMPLE",
  model: "CSTA 282, SafeSea E100G EPIRB",
  manufacturerSerialNumber: "1407312904",
  chkCode: "456QWE",
  batteryExpiryDate: "01/02/2020",
  lastServicedDate: "01/02/2020",
  lastModifiedDate: "01/02/2021",
  uses: usesFixture as IUse[],
  owners: testOwners,
  emergencyContacts: emergencyContactsFixture as IEmergencyContact[],
});
