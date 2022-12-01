import { BeaconStatuses } from "../../entities/IBeacon";
import {
  ILegacyBeacon,
  ILegacyEmergencyContact,
  ILegacyOwner,
  ILegacyUse,
} from "../../entities/ILegacyBeacon";
import { formatDateTime } from "../../utils/dateTime";
import { ILegacyBeaconResponse } from "./ILegacyBeaconResponse";

export interface ILegacyBeaconResponseMapper {
  map: (beaconApiResponse: ILegacyBeaconResponse) => ILegacyBeacon;
}

export class LegacyBeaconResponseMapper implements ILegacyBeaconResponseMapper {
  public map(beaconApiResponse: ILegacyBeaconResponse): ILegacyBeacon {
    debugger;
    return {
      pkBeaconId: beaconApiResponse.data.attributes.beacon.pkBeaconId,
      hexId: beaconApiResponse.data.attributes.beacon.hexId,
      statusCode: beaconApiResponse.data.attributes.beacon.statusCode,
      beaconStatus: this.mapStatus(
        beaconApiResponse.data.attributes.claimStatus
      ),
      manufacturer: beaconApiResponse.data.attributes.beacon.manufacturer,
      model: beaconApiResponse.data.attributes.beacon.model,
      manufacturerSerialNumber:
        beaconApiResponse.data.attributes.beacon.manufacturerSerialNumber,
      serialNumber: beaconApiResponse.data.attributes.beacon.serialNumber,
      beaconType: beaconApiResponse.data.attributes.beacon.beaconType,
      coding: beaconApiResponse.data.attributes.beacon.coding,
      protocol: beaconApiResponse.data.attributes.beacon.protocol,
      csta: beaconApiResponse.data.attributes.beacon.csta,
      mti: beaconApiResponse.data.attributes.beacon.mti,
      batteryExpiryDate:
        beaconApiResponse.data.attributes.beacon.batteryExpiryDate,
      lastServiceDate: beaconApiResponse.data.attributes.beacon.lastServiceDate,
      firstRegistrationDate: formatDateTime(
        beaconApiResponse.data.attributes.beacon.firstRegistrationDate
      ),
      createdDate:
        formatDateTime(beaconApiResponse.data.attributes.beacon.createdDate) ||
        "",
      lastModifiedDate: formatDateTime(
        beaconApiResponse.data.attributes.beacon.lastModifiedDate
      ),
      cospasSarsatNumber:
        beaconApiResponse.data.attributes.beacon.cospasSarsatNumber,
      departRefId: beaconApiResponse.data.attributes.beacon.departRefId,
      isWithdrawn: beaconApiResponse.data.attributes.beacon.isWithdrawn,
      withdrawnReason: beaconApiResponse.data.attributes.beacon.withdrawnReason,
      isPending: beaconApiResponse.data.attributes.beacon.isPending,
      isArchived: beaconApiResponse.data.attributes.beacon.isArchived,
      createUserId: beaconApiResponse.data.attributes.beacon.createUserId,
      updateUserId: beaconApiResponse.data.attributes.beacon.updateUserId,
      versioning: beaconApiResponse.data.attributes.beacon.versioning,
      note: beaconApiResponse.data.attributes.beacon.note,
      owner: this.mapOwner(beaconApiResponse),
      secondaryOwners: this.mapSecondaryOwners(beaconApiResponse),
      emergencyContact: this.mapEmergencyContacts(beaconApiResponse),
      uses: this.mapUses(beaconApiResponse),
    };
  }

  private mapStatus(claimStatus: string): BeaconStatuses {
    switch (claimStatus.trim().toUpperCase()) {
      case "CLAIMED":
        return BeaconStatuses.Claimed;
      case "DELETED":
        return BeaconStatuses.Deleted;
      default:
        return BeaconStatuses.Migrated;
    }
  }

  private mapOwner(beaconApiResponse: ILegacyBeaconResponse): ILegacyOwner {
    const owner = beaconApiResponse.data.attributes.owner;

    return {
      pkBeaconOwnerId: owner.pkBeaconOwnerId || 0,
      fkBeaconId: owner.fkBeaconId || 0,
      ownerName: owner.ownerName || "",
      companyName: owner.companyName || "",
      careOf: owner.careOf || "",
      address1: owner.address1 || "",
      address2: owner.address2 || "",
      address3: owner.address3 || "",
      address4: owner.address4 || "",
      country: owner.country || "",
      postCode: owner.postCode || "",
      phone1: owner.phone1 || "",
      phone2: owner.phone2 || "",
      mobile1: owner.mobile1 || "",
      mobile2: owner.mobile2 || "",
      fax: owner.fax || "",
      email: owner.email || "",
      isMain: owner.isMain || "",
      createUserId: owner.createUserId || 0,
      createdDate: formatDateTime(owner.createdDate) || "",
      updateUserId: owner.updateUserId || 0,
      lastModifiedDate: formatDateTime(owner.lastModifiedDate) || "",
      versioning: owner.versioning || 0,
    };
  }

  private mapSecondaryOwners(
    beaconApiResponse: ILegacyBeaconResponse
  ): ILegacyOwner[] {
    const mappedSecondaryOwners: ILegacyOwner[] = [];
    beaconApiResponse.data.attributes.secondaryOwners.forEach(
      (secondaryOwner) => {
        mappedSecondaryOwners.push({
          pkBeaconOwnerId: secondaryOwner.pkBeaconOwnerId || 0,
          fkBeaconId: secondaryOwner.fkBeaconId || 0,
          ownerName: secondaryOwner.ownerName || "",
          companyName: secondaryOwner.companyName || "",
          careOf: secondaryOwner.careOf || "",
          address1: secondaryOwner.address1 || "",
          address2: secondaryOwner.address2 || "",
          address3: secondaryOwner.address3 || "",
          address4: secondaryOwner.address4 || "",
          country: secondaryOwner.country || "",
          postCode: secondaryOwner.postCode || "",
          phone1: secondaryOwner.phone1 || "",
          phone2: secondaryOwner.phone2 || "",
          mobile1: secondaryOwner.mobile1 || "",
          mobile2: secondaryOwner.mobile2 || "",
          fax: secondaryOwner.fax || "",
          email: secondaryOwner.email || "",
          isMain: secondaryOwner.isMain || "",
          createUserId: secondaryOwner.createUserId || 0,
          createdDate: formatDateTime(secondaryOwner.createdDate) || "",
          updateUserId: secondaryOwner.updateUserId || 0,
          lastModifiedDate:
            formatDateTime(secondaryOwner.lastModifiedDate) || "",
          versioning: secondaryOwner.versioning || 0,
        });
      }
    );
    return mappedSecondaryOwners;
  }

  private mapEmergencyContacts(
    beaconApiResponse: ILegacyBeaconResponse
  ): ILegacyEmergencyContact {
    return {
      details: beaconApiResponse.data.attributes.emergencyContact.details,
    };
  }

  private mapUses(beaconApiResponse: ILegacyBeaconResponse): ILegacyUse[] {
    return beaconApiResponse.data.attributes.uses
      .map((use, index) => {
        return {
          pkBeaconUsesId: use.pkBeaconUsesId || 0,
          fkBeaconId: use.fkBeaconId || 0,
          vesselName: use.vesselName || "",
          homePort: use.homePort || "",
          maxPersons: use.maxPersons || 0,
          officialNumber: use.officialNumber || "",
          rssSsrNumber: use.rssSsrNumber || "",
          callSign: use.callSign || "",
          imoNumber: use.imoNumber || "",
          mmsiNumber: use.mmsiNumber,
          fishingVesselPln: use.fishingVesselPln || "",
          hullIdNumber: use.hullIdNumber || "",
          cg66RefNumber: use.cg66RefNumber || "",
          aodSerialNumber: use.aodSerialNumber || "",
          principalAirport: use.principalAirport || "",
          bit24AddressHex: use.bit24AddressHex || "",
          aircraftRegistrationMark: use.aircraftRegistrationMark || "",
          areaOfUse: use.areaOfUse || "",
          tripInfo: use.tripInfo || "",
          rigName: use.rigName || "",
          beaconPosition: use.beaconPosition || "",
          position: use.position || "",
          localManagementId: use.localManagementId || "",
          beaconNsn: use.beaconNsn || "",
          beaconPartNumber: use.beaconPartNumber || "",
          notes: use.notes || "",
          pennantNumber: use.pennantNumber || "",
          aircraftDescription: use.aircraftDescription || "",
          survivalCraftType: use.survivalCraftType || "",
          communications: use.communications || "",
          isMain: use.isMain || "",
          createUserId: use.createUserId || 0,
          updateUserId: use.updateUserId || 0,
          createdDate: formatDateTime(use.createdDate) || "",
          lastModifiedDate: formatDateTime(use.lastModifiedDate) || "",
          versioning: use.versioning || 0,
          useType: use.useType || "",
          vesselType: use.vesselType || "",
          aircraftType: use.aircraftType || "",
          landUse: use.landUse || "",
          note: use.note || "",
          modType: use.modType || "",
          modStatus: use.modStatus || "",
          modVariant: use.modVariant || "",
          activationMode: use.activationMode || "",
        };
      })
      .sort((firstUse, secondUse) => this.mainUseSortFn(firstUse, secondUse));
  }

  private mainUseSortFn(firstUse: ILegacyUse, secondUse: ILegacyUse): number {
    const firstUseMainUseAsNumber: number = firstUse.isMain === "Y" ? 1 : 0;
    const secondUseMainUseAsNumber: number = secondUse.isMain === "Y" ? 1 : 0;
    return secondUseMainUseAsNumber - firstUseMainUseAsNumber;
  }
}
