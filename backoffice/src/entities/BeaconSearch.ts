import { BeaconStatus } from "./BeaconStatus";
import { UseEnvironment } from "./UseEnvironment";

type DateString = string;

export type BeaconUseDocument = {
  environment: UseEnvironment | string;
  activity: string | null;
  callsign: string | null;
  purpose: string | null;
  vesselName: string | null;
  aircraftRegistrationMark: string | null;
  mmsi: string | null;
};

export type BeaconOwnerDocument = {
  ownerEmail: string;
  ownerName: string;
};

export type BeaconSearchItem = {
  _id: string;
  hexId: string | null;
  isLegacy: boolean;
  beaconStatus: BeaconStatus;
  createdDate: DateString;
  lastModifiedDate: DateString;
  cospasSarsatNumber: string | null;
  referenceNumber: string | null;
  vesselMmsiNumbers: Array<string> | unknown;
  vesselNames: Array<string>;
  vesselCallsigns: Array<string>;
  aircraftRegistrationMarks: Array<string>;
  aircraft24bitHexAddresses: Array<string>;
  beaconOwner: BeaconOwnerDocument | null;
  beaconUses: Array<BeaconUseDocument>;
};

export type BeaconSearchResult = {
  _id: string;
  hexId: string | null;
  isLegacy: boolean;
  beaconStatus: BeaconStatus;
  cospasSarsatNumber: string | null;
  createdDate: Date;
  lastModifiedDate: Date;
  referenceNumber: string | null;
  vesselMmsiNumbers: Array<string>;
  vesselNames: Array<string>;
  vesselCallsigns: Array<string>;
  aircraftRegistrationMarks: Array<string>;
  aircraft24bitHexAddresses: Array<string>;
  beaconOwner: BeaconOwnerDocument | null;
  beaconUses: Array<BeaconUseDocument>;
};

export function parseBeaconSearchItem(
  item: BeaconSearchItem
): BeaconSearchResult {
  return {
    _id: item._id,
    hexId: item.hexId,
    isLegacy: item.isLegacy,
    beaconStatus: item.beaconStatus,
    cospasSarsatNumber: item.cospasSarsatNumber,
    createdDate: new Date(item.createdDate),
    lastModifiedDate: new Date(item.lastModifiedDate),
    referenceNumber: item.referenceNumber,
    vesselNames: processItemArray(item.vesselNames),
    vesselMmsiNumbers: processItemArray(item.vesselMmsiNumbers),
    vesselCallsigns: processItemArray(item.vesselCallsigns),
    aircraftRegistrationMarks: processItemArray(item.aircraftRegistrationMarks),
    aircraft24bitHexAddresses: processItemArray(item.aircraft24bitHexAddresses),
    beaconOwner: item.beaconOwner,
    beaconUses: item.beaconUses,
  };
}

// Deduplicates results, removes empty strings, and returns an empty array if not of expected type: Array<string>
function processItemArray<T extends string>(arr: Array<T> | unknown): Array<T> {
  if (!Array.isArray(arr)) {
    return [];
  }

  return Array.from(new Set(arr.filter((item) => item.length > 0)));
}
