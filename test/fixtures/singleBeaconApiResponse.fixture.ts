import { IBeaconResponse } from "../../src/gateways/mappers/IBeaconResponse";
import { deepFreeze } from "../deepFreeze";

const getUseResponseJson = (mainUse: boolean) =>
  deepFreeze({
    environment: "MARITIME",
    purpose: "COMMERCIAL",
    activity: "FISHING_VESSEL",
    moreDetails: "I take people out in my yacht.",
    callSign: "Call me",
    vhfRadio: true,
    fixedVhfRadio: true,
    fixedVhfRadioValue: "123456",
    portableVhfRadio: true,
    portableVhfRadioValue: "123456",
    satelliteTelephone: true,
    satelliteTelephoneValue: "123456",
    mobileTelephone: true,
    mobileTelephone1: "0123456789",
    mobileTelephone2: "01234567890",
    otherCommunication: true,
    otherCommunicationValue: "By fax",
    maxCapacity: 10,
    vesselName: "SS Great Britain",
    portLetterNumber: "1",
    homeport: "England",
    areaOfOperation: "Bristol",
    beaconLocation: "Carry bag",
    imoNumber: "1",
    ssrNumber: "2",
    rssNumber: "3",
    officialNumber: "4",
    rigPlatformLocation: "5",
    aircraftManufacturer: "Boeing",
    principalAirport: "Bristol",
    secondaryAirport: "Cardiff",
    registrationMark: "High flying",
    hexAddress: "Aircraft hex",
    cnOrMsnNumber: "1",
    dongle: false,
    beaconPosition: "In my carry bag",
    workingRemotelyLocation: "Bristol",
    workingRemotelyPeopleCount: 1,
    windfarmLocation: "Scotland",
    windfarmPeopleCount: "100",
    otherActivity: "Zorbing",
    otherActivityLocation: "Manchester",
    otherActivityPeopleCount: "10",
    mainUse,
  });

export const singleBeaconApiResponseFixture: IBeaconResponse = deepFreeze({
  meta: {},
  data: {
    type: "beacon",
    id: "f48e8212-2e10-4154-95c7-bdfd061bcfd2",
    attributes: {
      hexId: "1D0EA08C52FFBFF",
      referenceNumber: "A1B2C3B4",
      accountHolderId: "b32deeb3-031f-4be7-ab16-681a8cac7ddd",
      status: "NEW",
      type: "Beacon type to be derived from Hex ID",
      protocolCode: "Protocol code to be derived from Hex ID",
      codingMethod: "Coding method to be derived from Hex ID",
      manufacturer: "Ocean Signal",
      createdDate: "2018-06-08 09:10:45.648383",
      lastModifiedDate: "2021-09-01 09:10:45.648383",
      model: "Excelsior",
      manufacturerSerialNumber: "1407312904",
      chkCode: "456QWE",
      csta: "CSTA",
      batteryExpiryDate: "2020-02-01T00:00",
      lastServicedDate: "2020-02-01T00:00",
    },
    links: [
      { verb: "GET", path: "/beacons/f48e8212-2e10-4154-95c7-bdfd061bcfd2" },
      { verb: "PATCH", path: "/beacons/f48e8212-2e10-4154-95c7-bdfd061bcfd2" },
    ],
    relationships: {
      uses: {
        data: [
          { type: "beaconUse", id: "e00036c4-e3f4-46bb-aa9e-1d91870d9172" },
        ],
      },
      owner: {
        data: [
          {
            type: "beaconPerson",
            id: "cb2e9fd2-45bb-4865-a04c-add5bb7c34a7",
          },
        ],
      },
      emergencyContacts: {
        data: [
          {
            type: "beaconPerson",
            id: "5ffd1b86-d347-49e2-b821-4550c72666c1",
          },
          {
            type: "beaconPerson",
            id: "3851e8c7-6e4e-4827-ab8f-b904f845582f",
          },
        ],
      },
    },
  },
  included: [
    {
      type: "beaconUse",
      id: "e00036c4-e3f4-46bb-aa9e-1d91870d9172",
      attributes: {
        ...getUseResponseJson(true),
      },
      links: [
        {
          verb: "PATCH",
          path: "/beacon-uses/e00036c4-e3f4-46bb-aa9e-1d91870d9172",
        },
      ],
    },
    {
      type: "beaconPerson",
      id: "cb2e9fd2-45bb-4865-a04c-add5bb7c34a7",
      attributes: {
        fullName: "Steve Stevington",
        email: "steve@beaconowner.com",
        telephoneNumber: "07872536271",
        addressLine1: "1 Beacon Square",
        addressLine2: "",
        townOrCity: "Beaconsfield",
        county: "Yorkshire",
        postcode: "BS8 7NW",
        country: "United Kingdom",
      },
    },
    {
      type: "beaconPerson",
      id: "5ffd1b86-d347-49e2-b821-4550c72666c1",
      attributes: {
        fullName: "Lady Hamilton",
        telephoneNumber: "02392 856621",
        alternativeTelephoneNumber: "02392 856622",
      },
    },
    {
      type: "beaconPerson",
      id: "3851e8c7-6e4e-4827-ab8f-b904f845582f",
      attributes: {
        fullName: "Neil Hamilton",
        telephoneNumber: "04392 856626",
        alternativeTelephoneNumber: "04392 856625",
      },
    },
  ],
});
