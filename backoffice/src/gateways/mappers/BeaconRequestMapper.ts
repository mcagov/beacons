import { IBeacon } from "../../entities/IBeacon";
import { IBeaconRequest } from "./IBeaconRequest";

export interface IBeaconRequestMapper {
  map: (beaconId: string, beacon: Partial<IBeacon>) => IBeaconRequest;
}

export class BeaconRequestMapper {
  public map(beaconId: string, beacon: Partial<IBeacon>): IBeaconRequest {
    const attributes: Record<string, string> = {};

    if (beacon.hexId) attributes.hexId = beacon.hexId;
    if (beacon.beaconType != null) attributes.beaconType = beacon.beaconType;
    if (beacon.protocol != null) attributes.protocol = beacon.protocol;
    if (beacon.coding != null) attributes.coding = beacon.coding;
    if (beacon.registeredDate != null)
      attributes.registeredDate = beacon.registeredDate;
    if (beacon.status) attributes.status = beacon.status;
    if (beacon.manufacturer != null)
      attributes.manufacturer = beacon.manufacturer;
    if (beacon.model != null) attributes.model = beacon.model;
    if (beacon.manufacturerSerialNumber != null)
      attributes.manufacturerSerialNumber = beacon.manufacturerSerialNumber;
    if (beacon.chkCode != null) attributes.chkCode = beacon.chkCode;
    if (beacon.batteryExpiryDate != null)
      attributes.batteryExpiryDate = beacon.batteryExpiryDate;
    if (beacon.lastServicedDate != null)
      attributes.lastServicedDate = beacon.lastServicedDate;
    if (beacon.mti != null) attributes.mti = beacon.mti;
    if (beacon.svdr != null) attributes.svdr = beacon.svdr;
    if (beacon.csta != null) attributes.csta = beacon.csta;

    return {
      data: {
        type: "beacon",
        id: beaconId,
        attributes: attributes,
      },
    };
  }
}
