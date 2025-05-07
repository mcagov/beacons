import { Beacon } from "../entities/Beacon";
import { BeaconUse } from "../entities/BeaconUse";
import { Registration } from "../entities/Registration";
import { Use } from "../entities/Use";
import { Activity } from "./deprecatedRegistration/types";

export const beaconToRegistration = (beacon: Beacon): Registration => {
  const beaconUses = beacon.uses.map((use) => mapUseToBeaconUse(use));

  return {
    id: beacon.id,
    manufacturer: beacon.manufacturer,
    model: beacon.model,
    hexId: beacon.hexId,
    isSecondGeneration: false,
    referenceNumber: beacon.referenceNumber,
    accountHolderId: beacon.accountHolderId,
    registeredDate: beacon.registeredDate,
    lastModifiedDate: beacon.lastModifiedDate,
    manufacturerSerialNumber: beacon.manufacturerSerialNumber,
    chkCode: beacon.chkCode,
    csta: beacon.csta,
    batteryExpiryDate: beacon.batteryExpiryDate,
    batteryExpiryDateMonth: beacon.batteryExpiryDate.slice(5, 7),
    batteryExpiryDateYear: beacon.batteryExpiryDate.slice(0, 4),
    lastServicedDate: beacon.lastServicedDate,
    lastServicedDateMonth: beacon.lastServicedDate.slice(5, 7),
    lastServicedDateYear: beacon.lastServicedDate.slice(0, 4),
    ownerFullName: beacon.owners[0].fullName,
    ownerEmail: beacon.owners[0].email,
    ownerTelephoneNumber: beacon.owners[0].telephoneNumber1,
    ownerAlternativeTelephoneNumber: beacon.owners[0].telephoneNumber2,
    ownerAddressLine1: beacon.owners[0].addressLine1,
    ownerAddressLine2: beacon.owners[0].addressLine2,
    ownerAddressLine3: beacon.owners[0].addressLine3,
    ownerAddressLine4: beacon.owners[0].addressLine4,
    ownerTownOrCity: beacon.owners[0].townOrCity,
    ownerCounty: beacon.owners[0].county,
    ownerCountry: beacon.owners[0].country,
    ownerPostcode: beacon.owners[0].postcode,
    emergencyContact1FullName: beacon.emergencyContacts[0].fullName,
    emergencyContact1TelephoneNumber:
      beacon.emergencyContacts[0].telephoneNumber,
    emergencyContact1AlternativeTelephoneNumber:
      beacon.emergencyContacts[0].alternativeTelephoneNumber,
    emergencyContact2FullName: beacon.emergencyContacts[1]?.fullName || "",
    emergencyContact2TelephoneNumber:
      beacon.emergencyContacts[1]?.telephoneNumber || "",
    emergencyContact2AlternativeTelephoneNumber:
      beacon.emergencyContacts[1]?.alternativeTelephoneNumber || "",
    emergencyContact3FullName: beacon.emergencyContacts[2]?.fullName || "",
    emergencyContact3TelephoneNumber:
      beacon.emergencyContacts[2]?.telephoneNumber || "",
    emergencyContact3AlternativeTelephoneNumber:
      beacon.emergencyContacts[2]?.alternativeTelephoneNumber || "",
    uses: [...beaconUses],
  };
};

const mapUseToBeaconUse = (use: Use): BeaconUse => {
  return {
    environment: use.environment,
    purpose: use.purpose,
    activity: use.activity,
    otherActivityText: use.otherActivity,
    moreDetails: use.moreDetails,
    mainUse: use.mainUse,
    callSign: use.callSign,
    vhfRadio: use.vhfRadio.toString(),
    fixedVhfRadio: use.fixedVhfRadio.toString(),
    fixedVhfRadioInput: use.fixedVhfRadioValue,
    portableVhfRadio: use.portableVhfRadio.toString(),
    portableVhfRadioInput: use.portableVhfRadioValue,
    satelliteTelephone: use.satelliteTelephone.toString(),
    satelliteTelephoneInput: use.satelliteTelephoneValue.toString(),
    mobileTelephone: use.mobileTelephone.toString(),
    mobileTelephoneInput1: use.mobileTelephone1.toString(),
    mobileTelephoneInput2: use.mobileTelephone2.toString(),
    otherCommunication: use.otherCommunication.toString(),
    otherCommunicationInput: use.otherCommunicationValue,
    maxCapacity: use.maxCapacity.toString(),
    vesselName: use.vesselName,
    portLetterNumber: use.portLetterNumber,
    homeport: use.homeport,
    areaOfOperation: use.areaOfOperation,
    beaconLocation: use.beaconLocation,
    imoNumber: use.imoNumber,
    ssrNumber: use.ssrNumber,
    rssNumber: use.rssNumber,
    officialNumber: use.officialNumber,
    rigPlatformLocation: use.rigPlatformLocation,
    aircraftManufacturer: use.aircraftManufacturer,
    principalAirport: use.principalAirport,
    secondaryAirport: use.secondaryAirport,
    registrationMark: use.registrationMark,
    hexAddress: use.hexAddress,
    cnOrMsnNumber: use.cnOrMsnNumber,
    dongle: use.dongle + "",
    beaconPosition: use.beaconPosition,
    workingRemotelyLocation: use.workingRemotelyLocation,
    workingRemotelyPeopleCount: use.workingRemotelyPeopleCount.toString(),
    windfarmLocation: use.windfarmLocation,
    windfarmPeopleCount: use.windfarmPeopleCount.toString(),
    otherActivityLocation: use.otherActivityLocation,
    otherActivityPeopleCount: use.otherActivityPeopleCount.toString(),
    additionalBeaconUse: (!use.mainUse).toString(),
    climbingMountaineering: (
      use.activity === Activity.CLIMBING_MOUNTAINEERING
    ).toString(),
    cycling: (use.activity === Activity.CYCLING).toString(),
    driving: (use.activity === Activity.DRIVING).toString(),
    skiing: (use.activity === Activity.SKIING).toString(),
    walkingHiking: (use.activity === Activity.WALKING_HIKING).toString(),
    windfarm: (use.activity === Activity.WINDFARM).toString(),
    workingRemotely: (use.activity === Activity.WORKING_REMOTELY).toString(),
  };
};
