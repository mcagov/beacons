import {
  Activity,
  Environment,
  Purpose,
} from "../../src/lib/registration/types";

export const testData = {
  beaconDetails: {
    manufacturer: "Ocean Signal",
    model: "EPIRB1",
    hexId: "1D0E9B07CEFFBFF",
  },
  additionalBeaconInformation: {
    serialNumber: "42",
    chkCode: "9480B",
    batteryExpiryMonth: "12",
    batteryExpiryYear: "2025",
    lastServicedMonth: "6",
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

export const testAviationPleasureUse = {
  environment: Environment.AVIATION,
  purpose: Purpose.PLEASURE,
  activity: Activity.GLIDER,
  maxCapacity: "15",
  manufacturer: "Cessna 162 Skycatcher",
  principalAirport: "Bristol",
  secondaryAirport: "Heathrow",
  registrationMark: "G-AAAA",
  hexAddress: "AC82EC",
  cnOrMsnNumber: "M-ZYXW",
  beaconPosition: "Cockpit",
  satelliteTelephone: "+881677722191",
  mobileTelephone1: "07162 738293",
  mobileTelephone2: "01728 392012",
  otherCommunication: "Carrier pigeon, goes by the name of Keith",
};
