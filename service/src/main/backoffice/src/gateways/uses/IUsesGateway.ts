import { IUse } from "entities/IUse";

export interface IUsesGateway {
  getUses: (beaconId: string) => Promise<IUse[]>;
}
