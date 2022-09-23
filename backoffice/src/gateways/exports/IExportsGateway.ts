import { ICertificate } from "./ICertificate";

export interface IExportsGateway {
  getCertificateDataForBeacon(beaconId: string): Promise<ICertificate>;
}
