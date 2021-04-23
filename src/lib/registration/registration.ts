import { FormSubmission } from "../formCache";
import { stringToBoolean } from "../utils";
import { initBeacon, initBeaconUse } from "./registrationInitialisation";
import { BeaconUse, IRegistration } from "./types";

type Indexes = {
  useIndex: number;
};

export class Registration {
  private static readonly USES_KEY = "uses";

  public registration: IRegistration;

  constructor() {
    this.registration = initBeacon();
  }

  public getFlattenedRegistration(indexes: Indexes): FormSubmission {
    let flattenedRegistration = { ...this.registration };
    delete flattenedRegistration.uses;

    const useIndex = this._parseUseIndex(indexes.useIndex);
    const use = this.registration.uses[useIndex];
    flattenedRegistration = { ...flattenedRegistration, ...use };

    return flattenedRegistration;
  }

  public getRegistration = (): IRegistration => {
    return this.registration;
  };

  public createUse(): void {
    const use = initBeaconUse();
    this.registration.uses.push(use);
  }

  public update(formData: FormSubmission): void {
    formData = formData || {};
    this._updateBeacon(formData);
    this._updateUse(formData);
  }

  private _updateBeacon(formData: FormSubmission): void {
    Object.keys(formData)
      .filter((key: string) => !(key === Registration.USES_KEY))
      .forEach((key: string) => {
        if (key in this.registration) {
          this.registration[key] = formData[key];
        }
      });
  }

  private _updateUse(formData: FormSubmission): void {
    const useIndex = this._parseUseIndex(formData.useIndex);
    const use = this.registration.uses[useIndex];

    Object.keys(formData).forEach((key: string) => {
      if (key in use) {
        use[key] = formData[key];
      }
    });
  }

  private _parseUseIndex(useIndex = 0): number {
    useIndex = useIndex || 0;
    const beaconUseLength = this.registration.uses.length - 1;
    return Math.min(useIndex, beaconUseLength);
  }

  // TODO: Define return type once domain/form objects have been defined
  public serialiseToAPI() {
    const beacon = this._serialiseBeacon();
    const owner = this._serialiseOwner();
    const emergencyContacts = this._serialiseEmergencyContacts();
    const uses = this._serialiseUses();

    return {
      beacons: [{ ...beacon, owner, emergencyContacts, uses }],
    };
  }

  private _serialiseBeacon() {
    const registration = this.registration;

    return {
      manufacturer: registration.manufacturer,
      model: registration.model,
      hexId: registration.hexId,
      referenceNumber: registration.referenceNumber,

      manufacturerSerialNumber: registration.manufacturerSerialNumber,
      chkCode: registration.chkCode,
      batteryExpiryDate: registration.batteryExpiryDate,
      lastServicedDate: registration.lastServicedDate,
    };
  }

  private _serialiseOwner() {
    const registration = this.registration;

    return {
      fullName: registration.ownerFullName,
      email: registration.ownerEmail,
      telephoneNumber: registration.ownerTelephoneNumber,
      alternativeTelephoneNumber: registration.ownerAlternativeTelephoneNumber,
      addressLine1: registration.ownerAddressLine1,
      addressLine2: registration.ownerAddressLine2,
      townOrCity: registration.ownerTownOrCity,
      county: registration.ownerCounty,
      postcode: registration.ownerPostcode,
    };
  }

  private _serialiseEmergencyContacts() {
    const registration = this.registration;
    const emergencyContacts = [];

    if (
      !!registration.emergencyContact1FullName ||
      !!registration.emergencyContact1TelephoneNumber ||
      !!registration.emergencyContact1AlternativeTelephoneNumber
    ) {
      emergencyContacts.push({
        fullName: registration.emergencyContact1FullName,
        telephoneNumber: registration.emergencyContact1TelephoneNumber,
        alternativeTelephoneNumber:
          registration.emergencyContact1AlternativeTelephoneNumber,
      });
    }

    if (
      !!registration.emergencyContact2FullName ||
      !!registration.emergencyContact2TelephoneNumber ||
      !!registration.emergencyContact2AlternativeTelephoneNumber
    ) {
      emergencyContacts.push({
        fullName: registration.emergencyContact2FullName,
        telephoneNumber: registration.emergencyContact2TelephoneNumber,
        alternativeTelephoneNumber:
          registration.emergencyContact2AlternativeTelephoneNumber,
      });
    }

    if (
      !!registration.emergencyContact3FullName ||
      !!registration.emergencyContact3TelephoneNumber ||
      !!registration.emergencyContact3AlternativeTelephoneNumber
    ) {
      emergencyContacts.push({
        fullName: registration.emergencyContact3FullName,
        telephoneNumber: registration.emergencyContact3TelephoneNumber,
        alternativeTelephoneNumber:
          registration.emergencyContact3AlternativeTelephoneNumber,
      });
    }

    return emergencyContacts;
  }

  private _serialiseUses() {
    const uses = this.registration.uses;

    return uses.map((use, index) => {
      const mainUse = index === 0;
      return this._serialiseUse(use, mainUse);
    });
  }

  private _serialiseUse(use: BeaconUse, mainUse: boolean) {
    const serialisedUse = {
      environment: use.environment,
      activity: use.activity,
      otherActivity: use.otherActivityText,
      callSign: use.callSign,
      vhfRadio: stringToBoolean(use.vhfRadio),
      fixedVhfRadio: stringToBoolean(use.fixedVhfRadio),
      fixedVhfRadioValue: use.fixedVhfRadioInput,
      portableVhfRadio: stringToBoolean(use.portableVhfRadio),
      portableVhfRadioValue: use.portableVhfRadioInput,
      satelliteTelephone: stringToBoolean(use.satelliteTelephone),
      satelliteTelephoneValue: use.satelliteTelephoneInput,
      mobileTelephone: stringToBoolean(use.mobileTelephone),
      mobileTelephone1: use.mobileTelephoneInput1,
      mobileTelephone2: use.mobileTelephoneInput2,
      otherCommunication: stringToBoolean(use.otherCommunication),
      otherCommunicationValue: use.otherCommunicationInput,
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
      mainUse,
      aircraftManufacturer: use.aircraftManufacturer,
      principalAirport: use.principalAirport,
      secondaryAirport: use.secondaryAirport,
      registrationMark: use.registrationMark,
      hexAddress: use.hexAddress,
      cnOrMsnNumber: use.cnOrMsnNumber,
      dongle: stringToBoolean(use.dongle),
      beaconPosition: use.beaconPosition,
      workingRemotelyLocation: use.workingRemotelyLocation,
      workingRemotelyPeopleCount: use.workingRemotelyPeopleCount,
      windfarmLocation: use.windfarmLocation,
      windfarmPeopleCount: use.windfarmPeopleCount,
      otherActivityLocation: use.otherActivityLocation,
      otherActivityPeopleCount: use.otherActivityPeopleCount,
      moreDetails: use.moreDetails,
    };

    if (use.purpose) serialisedUse["purpose"] = use.purpose;

    if (Number.isInteger(use.maxCapacity))
      serialisedUse["maxCapacity"] = use.maxCapacity;

    return serialisedUse;
  }
}
