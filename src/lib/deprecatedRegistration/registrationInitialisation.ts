import { BeaconUse } from "../../entities/BeaconUse";
import { Registration } from "../../entities/Registration";

/**
 * Convenience function for returning an `empty` instance of a beacon registration.
 *
 * @returns {Registration}   JSON representation of a beacon registration
 */
export const initBeacon = (): Registration => {
  return {
    manufacturer: "",
    model: "",
    hexId: "",
    accountHolderId: "",

    referenceNumber: "",

    manufacturerSerialNumber: "",
    chkCode: "",
    batteryExpiryDate: "",
    batteryExpiryDateMonth: "",
    batteryExpiryDateYear: "",
    lastServicedDate: "",
    lastServicedDateMonth: "",
    lastServicedDateYear: "",

    ownerFullName: "",
    ownerEmail: "",
    ownerTelephoneNumber: "",
    ownerAlternativeTelephoneNumber: "",
    ownerAddressLine1: "",
    ownerAddressLine2: "",
    ownerTownOrCity: "",
    ownerCounty: "",
    ownerPostcode: "",

    emergencyContact1FullName: "",
    emergencyContact1TelephoneNumber: "",
    emergencyContact1AlternativeTelephoneNumber: "",
    emergencyContact2FullName: "",
    emergencyContact2TelephoneNumber: "",
    emergencyContact2AlternativeTelephoneNumber: "",
    emergencyContact3FullName: "",
    emergencyContact3TelephoneNumber: "",
    emergencyContact3AlternativeTelephoneNumber: "",

    uses: [initBeaconUse()],
  };
};

/**
 * Convenience function for returning an `empty` instance of a beacon use.
 *
 * @returns {BeaconUse}   JSON representation of a beacon use
 */
export const initBeaconUse = (): BeaconUse => {
  return {
    environment: "",
    purpose: "",
    activity: "",
    otherActivityText: "",
    otherCommunication: "",
    otherCommunicationInput: "",

    // Communications
    callSign: "",
    vhfRadio: "",
    fixedVhfRadio: "",
    fixedVhfRadioInput: "",
    portableVhfRadio: "",
    portableVhfRadioInput: "",
    satelliteTelephone: "",
    satelliteTelephoneInput: "",
    mobileTelephone: "",
    mobileTelephoneInput1: "",
    mobileTelephoneInput2: "",

    // Vessel info
    maxCapacity: "",
    vesselName: "",
    portLetterNumber: "",
    homeport: "",
    areaOfOperation: "",
    beaconLocation: "",
    imoNumber: "",
    ssrNumber: "",
    rssNumber: "",
    officialNumber: "",
    rigPlatformLocation: "",

    // Aircraft info
    aircraftManufacturer: "",
    principalAirport: "",
    secondaryAirport: "",
    registrationMark: "",
    hexAddress: "",
    cnOrMsnNumber: "",
    dongle: "",
    beaconPosition: "",

    // Land environment
    driving: "",
    cycling: "",
    climbingMountaineering: "",
    skiing: "",
    walkingHiking: "",
    workingRemotely: "",
    workingRemotelyLocation: "",
    workingRemotelyPeopleCount: "",
    windfarm: "",
    windfarmLocation: "",
    windfarmPeopleCount: "",
    otherActivityLocation: "",
    otherActivityPeopleCount: "",

    moreDetails: "",
    additionalBeaconUse: "",
  };
};
