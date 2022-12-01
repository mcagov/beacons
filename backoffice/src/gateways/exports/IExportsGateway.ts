import { IBeaconExport } from "./IBeaconExport";

export interface IExportsGateway {
  getCertificateDataForBeacon(beaconId: string): Promise<IBeaconExport>;
  getLetterDataForBeacon(beaconId: string): Promise<IBeaconExport>;
  getExportDataForBeacon(beaconId: string): Promise<IBeaconExport>;
  getLabelForBeacon(beaconId: string): Promise<Blob>;
  getBackupExportFile(): Promise<Blob>;
}
