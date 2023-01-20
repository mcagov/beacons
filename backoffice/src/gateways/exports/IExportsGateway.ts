import {
  ExportSearchFormProps,
  IBeaconExportSearchResult,
} from "views/exports/BeaconExportSearch";
import { IBeaconExport } from "./IBeaconExport";
import { IDataComparison } from "views/comparison/DataComparisonView";

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
  searchExportData(
    searchForm: ExportSearchFormProps
  ): Promise<IBeaconExportSearchResult>;

  getDataComparison(): Promise<IDataComparison>;
}
