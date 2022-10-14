import { IBeaconExport } from "./IBeaconExport";

export interface IExportsGateway {
  getCertificateDataForBeacon(beaconId: string): Promise<IBeaconExport>;
  getLetterDataForBeacon(beaconId: string): Promise<IBeaconExport>;
  getExportDataForBeacon(beaconId: string): Promise<IBeaconExport>;

  getCertificateDataForBeacons(beaconIds: string[]): Promise<IBeaconExport[]>;
  getLetterDataForBeacons(beaconId: string[]): Promise<IBeaconExport[]>;
  getExportDataForBeacons(beaconId: string[]): Promise<IBeaconExport[]>;

  getExportDataForAllBeacons(): Promise<IBeaconExport[]>;
  searchExportData(searchForm: any): Promise<IBeaconExport[]>;
}
