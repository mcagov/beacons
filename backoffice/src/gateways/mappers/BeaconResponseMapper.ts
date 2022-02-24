import { IBeacon } from "../../entities/IBeacon";
import { IEmergencyContact } from "../../entities/IEmergencyContact";
import { IOwner } from "../../entities/IOwner";
import { IUse } from "../../entities/IUse";
import { formatDateTime } from "../../utils/dateTime";
import {
  EmergencyContactRegistrationResponse,
  IRegistrationResponse,
  OwnerRegistrationResponse,
  UseRegistrationResponse,
} from "./IRegistrationResponse";

export interface IBeaconResponseMapper {
  map: (beaconApiResponse: IRegistrationResponse) => IBeacon;
}

export class BeaconResponseMapper implements IBeaconResponseMapper {
  public map(beaconApiResponse: IRegistrationResponse): IBeacon {
    return {
      id: beaconApiResponse.id,
      hexId: beaconApiResponse.hexId,
      beaconType: beaconApiResponse.beaconType || "",
      manufacturer: beaconApiResponse.manufacturer || "",
      model: beaconApiResponse.model || "",
      status: beaconApiResponse.status || "",
      registeredDate: formatDateTime(beaconApiResponse.createdDate || ""),
      lastModifiedDate: formatDateTime(
        beaconApiResponse.lastModifiedDate || ""
      ),
      batteryExpiryDate: formatDateTime(
        beaconApiResponse.batteryExpiryDate || ""
      ),
      chkCode: beaconApiResponse.chkCode || "",
      mti: beaconApiResponse.mti || "",
      referenceNumber: beaconApiResponse.referenceNumber,
      svdr:
        beaconApiResponse.svdr == null
          ? ""
          : beaconApiResponse.svdr
          ? "true"
          : "false",
      csta: beaconApiResponse.csta || "",
      protocol: beaconApiResponse.protocol || "",
      coding: beaconApiResponse.coding || "",
      lastServicedDate: formatDateTime(
        beaconApiResponse.lastServicedDate || ""
      ),
      manufacturerSerialNumber:
        beaconApiResponse.manufacturerSerialNumber || "",
      owners: beaconApiResponse.owner
        ? this.mapOwners(beaconApiResponse.owner)
        : [],
      emergencyContacts: beaconApiResponse.emergencyContacts
        ? this.mapEmergencyContacts(beaconApiResponse.emergencyContacts)
        : [],
      uses: beaconApiResponse.uses ? this.mapUses(beaconApiResponse.uses) : [],
    };
  }

  private mapOwners(owner: OwnerRegistrationResponse): IOwner[] {
    return [
      {
        id: owner.id,
        fullName: owner.fullName || "",
        email: owner.email || "",
        telephoneNumber: owner.telephoneNumber || "",
        addressLine1: owner.addressLine1 || "",
        addressLine2: owner.addressLine2 || "",
        addressLine3: owner.addressLine3 || "",
        addressLine4: owner.addressLine3 || "",
        townOrCity: owner.townOrCity || "",
        county: owner.county || "",
        postcode: owner.postcode || "",
        country: owner.country || "",
      },
    ];
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
