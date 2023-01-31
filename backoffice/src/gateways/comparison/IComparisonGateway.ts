import { BeaconSearchItem } from "entities/BeaconSearch";

export interface IComparisonGateway {
  getBeaconsFromOpenSearch(): Promise<BeaconSearchItem[]>;
}
