import {
  Activity,
  Environment,
  Purpose,
} from "../../../src/lib/deprecatedRegistration/types";

export const testBeaconAndOwnerData = {
  beaconDetails: {
    manufacturer: "Ocean Signal",
    model: "EPIRB1",
    hexId: "1D0E9B07CEFFBFF",
  },
  additionalBeaconInformation: {
    serialNumber: "1234",
    chkCode: "9480B",
    batteryExpiryMonth: "12",
    batteryExpiryYear: "2025",
    lastServicedMonth: "06",
    lastServicedYear: "2019",
  },
  ownerDetails: {
    fullName: "Steve Stevington",
    telephoneNumber: "0303 123 7300",
    alternativeTelephoneNumber: "0303 123 7301",
    email: "steve@royal.uk",
  },
  ownerAddress: {
    addressLine1: "Buckingham Palace",
    addressLine2: "Westminster",
    townOrCity: "London",
    postcode: "SW1A 1AA",
  },
  emergencyContacts: {
    emergencyContact1FullName: "Martha Marthaberg",
    emergencyContact1TelephoneNumber: "07826 728192",
    emergencyContact1AlternativeTelephoneNumber: "01283 920382",
    emergencyContact2FullName: "Nick Nicklington",
    emergencyContact2TelephoneNumber: "07283 929382",
    emergencyContact2AlternativeTelephoneNumber: "01829 827392",
    emergencyContact3FullName: "Laura Lark",
    emergencyContact3TelephoneNumber: "02837 728192",
    emergencyContact3AlternativeTelephoneNumber: "01272 299372",
  },
};

export const testAviationUseData = {
  aircraft: {
    maxCapacity: "15",
    manufacturer: "Cessna 162 Skycatcher",
    principalAirport: "Bristol",
    secondaryAirport: "Heathrow",
    registrationMark: "G-AAAA",
    hexAddress: "AC82EC",
    cnOrMsnNumber: "M-ZYXW",
    beaconPosition: "Cockpit",
  },
  communications: {
    checkedFields: [
      "vhfRadio",
      "satelliteTelephone",
      "mobileTelephone",
      "otherCommunication",
    ],
    satelliteTelephone: "+881677723191",
    mobileTelephone1: "07162 738293",
    mobileTelephone2: "01728 392012",
    otherCommunication: "Carrier pigeon, goes by the name of Keith",
  },
  moreDetails: "My aircraft is neon pink",
};

export const testAviationPleasureUseData = {
  ...testAviationUseData,
  type: {
    environment: Environment.AVIATION,
    purpose: Purpose.PLEASURE,
    activity: Activity.GLIDER,
  },
};

export const testAviationCommercialUseData = {
  ...testAviationUseData,
  type: {
    environment: Environment.AVIATION,
    purpose: Purpose.COMMERCIAL,
    activity: Activity.GLIDER,
  },
};

export const testMaritimeUseData = {
  vessel: {
    maxCapacity: "42",
    name: "Ever Given",
    beaconPosition: "Captain's cabin",
    pln: "XYZ123",
    homePort: "Avonmouth",
    typicalAO: "Suez Canal AO",
    imoNumber: "9811000",
    ssrNumber: "1664",
    rssNumber: "A12345",
    officialNumber: "1313",
    rigPlatformLocation: "Suez Canal",
  },
  communications: {
    callSign: "C41151GN",
    checkedFields: [
      "vhfRadio",
      "fixedVhfRadio",
      "portableVhfRadio",
      "satelliteTelephone",
      "mobileTelephone",
      "otherCommunication",
    ],
    fixedMMSI: "353136000",
    portableMMSI: "235107771",
    satelliteTelephone: "+881677722191",
    mobileTelephone1: "07162 738294",
    mobileTelephone2: "01728 392022",
    otherCommunication: "Carrier pigeon, goes by the name of Birdseye",
  },
  moreDetails: "My vessel is stuck",
};

export const testMaritimePleasureUseData = {
  ...testAviationUseData,
  type: {
    environment: Environment.MARITIME,
    purpose: Purpose.PLEASURE,
    activity: Activity.MOTOR,
  },
};

export const testMaritimeCommercialUseData = {
  ...testAviationUseData,
  type: {
    environment: Environment.MARITIME,
    purpose: Purpose.COMMERCIAL,
    activity: Activity.MOTOR,
  },
};

export const testLandUseData = {
  type: {
    environment: Environment.LAND,
    activity: Activity.CYCLING,
  },
  communications: {
    checkedFields: [
      "portableVhfRadio",
      "satelliteTelephone",
      "mobileTelephone",
      "otherCommunication",
    ],
    portableMMSI: "235107781",
    satelliteTelephone: "+881677722112",
    mobileTelephone1: "07162 738203",
    mobileTelephone2: "01728 392022",
    otherCommunication: "Carrier pigeon, goes by the name of Raleigh",
  },
  moreDetails: "My bicycle is blue and red.",
};
