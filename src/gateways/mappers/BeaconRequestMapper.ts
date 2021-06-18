import { IBeacon } from "../../entities/beacon";
import { IBeaconRequest } from "./beaconRequest";

export interface IBeaconRequestMapper {
  map: (beaconId: string, beacon: Partial<IBeacon>) => IBeaconRequest;
}

export class BeaconRequestMapper {
  public map(beaconId: string, beacon: Partial<IBeacon>): IBeaconRequest {
    const attributes: Record<string, string> = {};

    if (beacon.hexId) attributes.hexId = beacon.hexId;
    if (beacon.type) attributes.type = beacon.type;
    if (beacon.protocolCode) attributes.protocolCode = beacon.protocolCode;
    if (beacon.registeredDate)
      attributes.registeredDate = beacon.registeredDate;
    if (beacon.status) attributes.status = beacon.status;
    if (beacon.manufacturer) attributes.manufacturer = beacon.manufacturer;
    if (beacon.model) attributes.model = beacon.model;
    if (beacon.manufacturerSerialNumber)
      attributes.manufacturerSerialNumber = beacon.manufacturerSerialNumber;
    if (beacon.chkCode) attributes.chkCode = beacon.chkCode;
    if (beacon.batteryExpiryDate)
      attributes.batteryExpiryDate = beacon.batteryExpiryDate;
    if (beacon.lastServicedDate)
      attributes.lastServicedDate = beacon.lastServicedDate;

    return {
      data: {
        type: "beacon",
        id: beaconId,
        attributes: attributes,
      },
    };
  }
}
