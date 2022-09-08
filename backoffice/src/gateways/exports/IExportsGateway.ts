import { IPdfLabel } from "./IPdfLabel";

export interface IExportsGateway {
  getPdfLabel(beaconId: string): Promise<IPdfLabel>;
}
