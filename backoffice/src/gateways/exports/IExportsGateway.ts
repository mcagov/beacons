import { ExportSearchFormProps } from "views/BeaconExportSearch";
import { IBeaconExport } from "./IBeaconExport";

export interface IExportsGateway {
  getCertificateDataForBeacon(beaconId: string): Promise<IBeaconExport>;
  getLetterDataForBeacon(beaconId: string): Promise<IBeaconExport>;
  getExportDataForBeacon(beaconId: string): Promise<IBeaconExport>;
  getLabelForBeacon(beaconId: string): Promise<Blob>;

  getCertificateDataForBeacons(beaconIds: string[]): Promise<IBeaconExport[]>;
  getLetterDataForBeacons(beaconIds: string[]): Promise<IBeaconExport[]>;
  getExportDataForBeacons(beaconIds: string[]): Promise<IBeaconExport[]>;
  getLabelsForBeacons(beaconIds: string[]): Promise<Blob>;

  getExportDataForAllBeacons(): Promise<IBeaconExport[]>;
  searchExportData(searchForm: ExportSearchFormProps): Promise<any>;
}
