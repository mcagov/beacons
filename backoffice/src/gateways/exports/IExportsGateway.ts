import { IBeaconExport } from "./IBeaconExport";

export interface IExportsGateway {
  getExportDataForBeacon(beaconId: string): Promise<IBeaconExport>;
}
