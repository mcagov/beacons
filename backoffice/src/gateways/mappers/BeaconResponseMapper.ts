import { IBeacon } from "../../entities/IBeacon";
import { IEmergencyContact } from "../../entities/IEmergencyContact";
import { IOwner } from "../../entities/IOwner";
import { IUse } from "../../entities/IUse";
import { formatDateTime } from "../../utils/dateTime";
import { IAccountHolder } from "../../entities/IAccountHolder";
import {
  EmergencyContactRegistrationResponse,
  IRegistrationResponse,
  OwnerRegistrationResponse,
  UseRegistrationResponse,
} from "./IRegistrationResponse";
import { IBeaconResponseAttributes } from "./IBeaconResponse";
import { IAccountHolderResponse } from "./IAccountHolderResponse";

export interface IBeaconResponseMapper {
  map: (beaconApiResponse: IRegistrationResponse) => IBeacon;
  mapAccountHolder: (accountHolder: IAccountHolderResponse) => IAccountHolder;
  mapBeacon: (beacon: IBeaconResponseAttributes) => IBeacon;
}

export class BeaconResponseMapper implements IBeaconResponseMapper {
  public map(beaconApiResponse: IRegistrationResponse): IBeacon {
    return {
      id: beaconApiResponse.id,
      hexId: beaconApiResponse.hexId,
      status: beaconApiResponse.status || "",
      manufacturer: beaconApiResponse.manufacturer || "",
      model: beaconApiResponse.model || "",
      manufacturerSerialNumber:
        beaconApiResponse.manufacturerSerialNumber || "",
      chkCode: beaconApiResponse.chkCode || "",
      beaconType: beaconApiResponse.beaconType || "",
      protocol: beaconApiResponse.protocol || "",
      coding: beaconApiResponse.coding || "",
      csta: beaconApiResponse.csta || "",
      mti: beaconApiResponse.mti || "",
      svdr:
        beaconApiResponse.svdr == null
          ? ""
          : beaconApiResponse.svdr
          ? "true"
          : "false",
      batteryExpiryDate: formatDateTime(
        beaconApiResponse.batteryExpiryDate || ""
      ),
      lastServicedDate: formatDateTime(
        beaconApiResponse.lastServicedDate || ""
      ),
      registeredDate: formatDateTime(beaconApiResponse.createdDate || ""),
      lastModifiedDate: formatDateTime(
        beaconApiResponse.lastModifiedDate || ""
      ),
      referenceNumber: beaconApiResponse.referenceNumber,
      owners: beaconApiResponse.owner
        ? this.mapOwners(beaconApiResponse.owner)
        : [],
      accountHolder: beaconApiResponse.accountHolder
        ? this.mapAccountHolder(beaconApiResponse.accountHolder)
        : null,
      emergencyContacts: beaconApiResponse.emergencyContacts
        ? this.mapEmergencyContacts(beaconApiResponse.emergencyContacts)
        : [],
      uses: beaconApiResponse.uses ? this.mapUses(beaconApiResponse.uses) : [],
      mainUseName: beaconApiResponse.mainUseName || "",
    };
  }

  private mapOwners(owner: OwnerRegistrationResponse): IOwner[] {
    return [
      {
        id: owner.id,
        fullName: owner.fullName || "",
        email: owner.email || "",
        telephoneNumber: owner.telephoneNumber || "",
        alternativeTelephoneNumber: owner.alternativeTelephoneNumber || "",
        addressLine1: owner.addressLine1 || "",
        addressLine2: owner.addressLine2 || "",
        addressLine3: owner.addressLine3 || "",
        addressLine4: owner.addressLine4 || "",
        townOrCity: owner.townOrCity || "",
        county: owner.county || "",
        postcode: owner.postcode || "",
        country: owner.country || "",
      },
    ];
  }

  public mapAccountHolder(
    accountHolder: IAccountHolderResponse
  ): IAccountHolder {
    return {
      id: accountHolder.id,
      fullName: accountHolder.attributes.fullName || "",
      email: accountHolder.attributes.email || "",
      telephoneNumber: accountHolder.attributes.telephoneNumber || "",
      alternativeTelephoneNumber:
        accountHolder.attributes.alternativeTelephoneNumber || "",
      addressLine1: accountHolder.attributes.addressLine1 || "",
      addressLine2: accountHolder.attributes.addressLine2 || "",
      addressLine3: accountHolder.attributes.addressLine3 || "",
      addressLine4: accountHolder.attributes.addressLine4 || "",
      townOrCity: accountHolder.attributes.townOrCity || "",
      county: accountHolder.attributes.county || "",
      postcode: accountHolder.attributes.postcode || "",
      country: accountHolder.attributes.country || "",
      createdDate: formatDateTime(accountHolder.attributes.createdDate || ""),
      lastModifiedDate: formatDateTime(
        accountHolder.attributes.lastModifiedDate || ""
      ),
    };
  }

  public mapBeacon(beaconApiResponse: IBeaconResponseAttributes): IBeacon {
    return {
      id: beaconApiResponse.id,
      hexId: beaconApiResponse.hexId,
      status: beaconApiResponse.status || "",
      manufacturer: beaconApiResponse.manufacturer || "",
      model: beaconApiResponse.model || "",
      manufacturerSerialNumber:
        beaconApiResponse.manufacturerSerialNumber || "",
      chkCode: beaconApiResponse.chkCode || "",
      beaconType: beaconApiResponse.beaconType || "",
      protocol: beaconApiResponse.protocol || "",
      coding: beaconApiResponse.coding || "",
      csta: beaconApiResponse.csta || "",
      mti: beaconApiResponse.mti || "",
      svdr:
        beaconApiResponse.svdr == null
          ? ""
          : beaconApiResponse.svdr
          ? "true"
          : "false",
      batteryExpiryDate: formatDateTime(
        beaconApiResponse.batteryExpiryDate || ""
      ),
      lastServicedDate: formatDateTime(
        beaconApiResponse.lastServicedDate || ""
      ),
      registeredDate: formatDateTime(beaconApiResponse.createdDate || ""),
      lastModifiedDate: formatDateTime(
        beaconApiResponse.lastModifiedDate || ""
      ),
      referenceNumber: beaconApiResponse.referenceNumber,
      uses: [],
      owners: [],
      emergencyContacts: [],
      accountHolder: null,
      mainUseName: beaconApiResponse.mainUseName || "",
    };
  }

  private mapEmergencyContacts(
    emergencyContacts: EmergencyContactRegistrationResponse[]
  ): IEmergencyContact[] {
    return emergencyContacts.map((emergencyContact) => {
      return {
        id: emergencyContact.id,
        fullName: emergencyContact.fullName || "",
        telephoneNumber: emergencyContact.telephoneNumber || "",
        alternativeTelephoneNumber:
          emergencyContact.alternativeTelephoneNumber || "",
      };
    });
  }

  private mapUses(uses: UseRegistrationResponse[]): IUse[] {
    return uses
      .map(
        (use) =>
          ({
            id: use.id,
            environment: use.environment || "",
            purpose: use.purpose || "",
            activity: use.activity || "",
            otherActivity: use.otherActivity || "",
            moreDetails: use.moreDetails || "",
            callSign: use.callSign || "",
            vhfRadio: use.vhfRadio || "",
            fixedVhfRadio: use.fixedVhfRadio || "",
            fixedVhfRadioValue: use.fixedVhfRadioValue || "",
            portableVhfRadio: use.portableVhfRadio || "",
            portableVhfRadioValue: use.portableVhfRadioValue || "",
            satelliteTelephone: use.satelliteTelephone || "",
            satelliteTelephoneValue: use.satelliteTelephoneValue || "",
            mobileTelephone: use.mobileTelephone || "",
            mobileTelephone1: use.mobileTelephone1 || "",
            mobileTelephone2: use.mobileTelephone2 || "",
            otherCommunication: use.otherCommunication || "",
            otherCommunicationValue: use.otherCommunicationValue || "",
            maxCapacity: use.maxCapacity || "",
            vesselName: use.vesselName || "",
            portLetterNumber: use.portLetterNumber || "",
            homeport: use.homeport || "",
            areaOfOperation: use.areaOfOperation || "",
            beaconLocation: use.beaconLocation || "",
            imoNumber: use.imoNumber || "",
            ssrNumber: use.ssrNumber || "",
            rssNumber: use.rssNumber || "",
            officialNumber: use.officialNumber || "",
            rigPlatformLocation: use.rigPlatformLocation || "",
            aircraftManufacturer: use.aircraftManufacturer || "",
            principalAirport: use.principalAirport || "",
            secondaryAirport: use.secondaryAirport || "",
            registrationMark: use.registrationMark || "",
            hexAddress: use.hexAddress || "",
            cnOrMsnNumber: use.cnOrMsnNumber || "",
            dongle: use.dongle,
            beaconPosition: use.beaconPosition || "",
            workingRemotelyLocation: use.workingRemotelyLocation || "",
            workingRemotelyPeopleCount: use.workingRemotelyPeopleCount || "",
            windfarmLocation: use.windfarmLocation || "",
            windfarmPeopleCount: use.windfarmPeopleCount || "",
            otherActivityLocation: use.otherActivityLocation || "",
            otherActivityPeopleCount: use.otherActivityPeopleCount || "",
            mainUse: use.mainUse,
            // This makes me sad but is necessary due to previously incorrect code
          } as Record<string, any> as IUse)
      )
      .sort((firstUse, secondUse) => this.mainUseSortFn(firstUse, secondUse));
  }

  private mainUseSortFn(firstUse: IUse, secondUse: IUse): number {
    const firstUseMainUseAsNumber: number = +firstUse.mainUse;
    const secondUseMainUseAsNumber: number = +secondUse.mainUse;
    return secondUseMainUseAsNumber - firstUseMainUseAsNumber;
  }
}
