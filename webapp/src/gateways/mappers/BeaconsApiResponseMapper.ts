import { Beacon } from "../../entities/Beacon";
import { EmergencyContact } from "../../entities/EmergencyContact";
import { Owner } from "../../entities/Owner";
import { Use } from "../../entities/Use";
import { isoDate } from "../../lib/dateTime";
import {
  BeaconOwnerResponse,
  BeaconUseResponse,
  EmergencyContactResponse,
  RegistrationResponse,
} from "../../lib/deprecatedRegistration/IRegistrationResponseBody";
import { IBeaconResponseMapper } from "./IBeaconResponseMapper";

export class BeaconsApiResponseMapper implements IBeaconResponseMapper {
  public map(registrationResponse: RegistrationResponse): Beacon {
    return this.mapToBeacon(registrationResponse);
  }

  public mapList(registrationResponseList: RegistrationResponse[]): Beacon[] {
    return registrationResponseList.map((registrationResponse) => {
      return this.mapToBeacon(registrationResponse);
    });
  }

  private mapToBeacon(registrationResponse: RegistrationResponse): Beacon {
    return {
      id: registrationResponse.id,
      hexId: registrationResponse.hexId,
      referenceNumber: registrationResponse.referenceNumber,
      accountHolderId: registrationResponse.accountHolderId || "",
      type: registrationResponse.type || "",
      manufacturer: registrationResponse.manufacturer || "",
      model: registrationResponse.model || "",
      status: registrationResponse.status || "",
      registeredDate: isoDate(registrationResponse.createdDate || ""),
      lastModifiedDate: isoDate(registrationResponse.lastModifiedDate || ""),
      batteryExpiryDate: isoDate(registrationResponse.batteryExpiryDate || ""),
      chkCode: registrationResponse.chkCode || "",
      csta: registrationResponse.csta || "",
      protocolCode: registrationResponse.protocolCode || "",
      codingMethod: registrationResponse.codingMethod || "",
      lastServicedDate: isoDate(registrationResponse.lastServicedDate || ""),
      manufacturerSerialNumber:
        registrationResponse.manufacturerSerialNumber || "",
      owners: this.mapOwners(registrationResponse.owner),
      emergencyContacts: this.mapEmergencyContacts(
        registrationResponse.emergencyContacts
      ),
      uses: this.mapUses(registrationResponse.uses),
    };
  }

  private mapOwners(beaconOwner: BeaconOwnerResponse): Owner[] {
    return [
      {
        id: beaconOwner.id,
        fullName: beaconOwner.fullName || "",
        isMain: beaconOwner.isMain || true,
        email: beaconOwner.email || "",
        telephoneNumber1: beaconOwner.telephoneNumber || "",
        telephoneNumber2: beaconOwner.alternativeTelephoneNumber || "",
        addressLine1: beaconOwner.addressLine1 || "",
        addressLine2: beaconOwner.addressLine2 || "",
        addressLine3: beaconOwner.addressLine3 || "",
        addressLine4: beaconOwner.addressLine4 || "",
        townOrCity: beaconOwner.townOrCity || "",
        county: beaconOwner.county || "",
        postcode: beaconOwner.postcode || "",
        country: beaconOwner.country || "",
      },
    ];
  }

  private mapEmergencyContacts(
    emergencyContacts: EmergencyContactResponse[]
  ): EmergencyContact[] {
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

  private mapUses(uses: BeaconUseResponse[]): Use[] {
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
            // Writing this makes me really unhappy, but it is for compatibility with what was here before.
          } as Record<string, any> as Use)
      )
      .sort((firstUse, secondUse) => this.mainUseSortFn(firstUse, secondUse));
  }

  private mainUseSortFn(firstUse: Use, secondUse: Use): number {
    const firstUseMainUseAsNumber: number = +firstUse.mainUse;
    const secondUseMainUseAsNumber: number = +secondUse.mainUse;
    return secondUseMainUseAsNumber - firstUseMainUseAsNumber;
  }
}
