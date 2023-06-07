import { ILegacyBeacon } from "entities/ILegacyBeacon";
import { IUpdateRecoveryEmailData } from "./IUpdateRecoveryEmailDTO";

export interface ILegacyBeaconsGateway {
  getLegacyBeacon: (id: string) => Promise<ILegacyBeacon>;
  updateRecoveryEmail: (
    id: string,
    updatedRecoveryEmail: string
  ) => Promise<IUpdateRecoveryEmailData>;
}
