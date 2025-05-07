import { BeaconUse } from "../../entities/BeaconUse";
import { Registration } from "../../entities/Registration";
import { FormSubmission } from "../../presenters/formSubmission";
import { stringToBoolean } from "../writingStyle";
import {
  IBeaconRequestBody,
  IUseRequestBody,
} from "./IRegistrationRequestBody";
import { initBeacon, initBeaconUse } from "./registrationInitialisation";
import { Activity } from "./types";

type Indexes = {
  useId: number;
};

export class DeprecatedRegistration {
  private static readonly USES_KEY = "uses";

  public registration: Registration;

  constructor(registration: Registration = initBeacon()) {
    this.registration = registration;
  }

  public getFlattenedRegistration(indexes: Indexes): FormSubmission {
    let flattenedRegistration = { ...this.registration };
    delete flattenedRegistration.uses;

    const useId = this._parseUseId(indexes.useId);
    const use = this.registration.uses[useId];
    flattenedRegistration = { ...flattenedRegistration, ...use };

    return flattenedRegistration;
  }

  public getRegistration = (): Registration => {
    return this.registration;
  };

  public createUse(): void {
    const use = initBeaconUse();

    if (this.registration.uses.length === 0) {
      use.mainUse = true;
    }

    this.registration.uses.push(use);
  }

  public update(formData: FormSubmission): void {
    formData = formData || {};
    this._updateBeacon(formData);
    this._updateUse(formData);
  }

  public setReferenceNumber(referenceNumber: string): void {
    this.registration.referenceNumber = referenceNumber;
  }

  public setAccountHolderId(accountHolderId: string): void {
    this.registration.accountHolderId = accountHolderId;
  }

  private _updateBeacon(formData: FormSubmission): void {
    Object.keys(formData)
      .filter((key: string) => !(key === DeprecatedRegistration.USES_KEY))
      .forEach((key: string) => {
        if (key in this.registration) {
          this.registration[key] = formData[key];
        }
      });
  }

  private _updateUse(formData: FormSubmission): void {
    const useId = this._parseUseId(formData.useId);
    const use = this.registration.uses[useId];

    Object.keys(formData).forEach((key: string) => {
      if (key in use) {
        use[key] = formData[key];
      }
    });
  }

  private _parseUseId(useId = 0): number {
    useId = useId || 0;
    const beaconUseLength = this.registration.uses.length - 1;
    return Math.min(useId, beaconUseLength);
  }

  public serialiseToAPI(): IBeaconRequestBody {
    const beacon = this._serialiseBeacon();
    const owner = this._serialiseOwner();
    const emergencyContacts = this._serialiseEmergencyContacts();
    const uses = this._serialiseUses();

    return {
      ...beacon,
      owner,
      emergencyContacts,
      uses,
    };
  }

  private _serialiseBeacon() {
    const registration = this.registration;

    return {
      manufacturer: registration.manufacturer,
      model: registration.model,
      hexId: registration.hexId,
      referenceNumber: registration.referenceNumber,
      accountHolderId: registration.accountHolderId,

      manufacturerSerialNumber: registration.manufacturerSerialNumber,
      chkCode: registration.chkCode,
      csta: registration.csta,
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
      addressLine3: registration.ownerAddressLine3,
      addressLine4: registration.ownerAddressLine4,
      townOrCity: registration.ownerTownOrCity,
      county: registration.ownerCounty,
      postcode: registration.ownerPostcode,
      country: registration.ownerCountry,
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

    const hasMainUse = uses.some((u) => u.mainUse);

    return uses.map((use, index) => {
      use.mainUse = hasMainUse ? use.mainUse || false : index === 0;
      return this._serialiseUse(use);
    });
  }

  private _serialiseUse(use: BeaconUse): IUseRequestBody {
    const serialisedUse = {
      environment: use.environment,
      purpose: use.purpose ? use.purpose : null,
      activity: use.activity,
      otherActivity:
        use.activity === Activity.OTHER ? use.otherActivityText : "",
      callSign: use.callSign,
      vhfRadio: use.vhfRadio === "true",
      fixedVhfRadio: use.fixedVhfRadio === "true",
      fixedVhfRadioValue:
        use.fixedVhfRadio === "true" ? use.fixedVhfRadioInput : "",
      portableVhfRadio: use.portableVhfRadio === "true",
      portableVhfRadioValue:
        use.portableVhfRadio === "true" ? use.portableVhfRadioInput : "",
      satelliteTelephone: use.satelliteTelephone === "true",
      satelliteTelephoneValue:
        use.satelliteTelephone === "true" ? use.satelliteTelephoneInput : "",
      mobileTelephone: use.mobileTelephone === "true",
      mobileTelephone1:
        use.mobileTelephone === "true" ? use.mobileTelephoneInput1 : "",
      mobileTelephone2:
        use.mobileTelephone === "true" ? use.mobileTelephoneInput2 : "",
      otherCommunication: use.otherCommunication === "true",
      otherCommunicationValue:
        use.otherCommunication === "true" ? use.otherCommunicationInput : "",
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
      mainUse: use.mainUse,
      aircraftManufacturer: use.aircraftManufacturer,
      principalAirport: use.principalAirport,
      secondaryAirport: use.secondaryAirport,
      registrationMark: use.registrationMark,
      hexAddress: use.hexAddress,
      cnOrMsnNumber: use.cnOrMsnNumber,
      dongle: stringToBoolean(use.dongle),
      beaconPosition: use.beaconPosition,
      workingRemotelyLocation: use.workingRemotelyLocation,
      workingRemotelyPeopleCount: use.workingRemotelyPeopleCount || "",
      windfarmLocation: use.windfarmLocation,
      windfarmPeopleCount: use.windfarmPeopleCount || "",
      otherActivityLocation:
        use.activity === Activity.OTHER ? use.otherActivityLocation : "",
      otherActivityPeopleCount:
        use.activity === Activity.OTHER
          ? use.otherActivityPeopleCount || "1"
          : "",
      moreDetails: use.moreDetails,
    };

    if (Number.isInteger(+use.maxCapacity))
      serialisedUse["maxCapacity"] = +use.maxCapacity;

    return serialisedUse;
  }
}
