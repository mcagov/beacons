import { IBeaconSearchResult } from "entities/IBeaconSearchResult";
import { IDeleteBeaconDto } from "entities/IDeleteBeaconDto";
import { ILegacyBeacon } from "entities/ILegacyBeacon";
import { BeaconRowData } from "../../components/BeaconsTable";
import { IBeacon } from "../../entities/IBeacon";
import { AxiosResponse } from "axios";

export type GetAllBeaconsFilters = Partial<
  Pick<
    BeaconRowData,
    | "beaconStatus"
    | "hexId"
    | "ownerName"
    | "useActivities"
    | "cospasSarsatNumber"
    | "manufacturerSerialNumber"
  >
>;

export type GetAllBeaconsSort = [keyof BeaconRowData, "asc" | "desc"] | null;

export interface IBeaconsGateway {
  getAllBeacons: (
    term: string,
    filters: GetAllBeaconsFilters,
    page: number,
    pageSize: number,
    sort: GetAllBeaconsSort
  ) => Promise<IBeaconSearchResult>;
  getBeacon: (id: string) => Promise<IBeacon>;
  getLegacyBeacon: (id: string) => Promise<ILegacyBeacon>;
  updateBeacon: (
    beaconId: string,
    updatedFields: Partial<IBeacon>
  ) => Promise<IBeacon>;
  deleteBeacon: (deleteBeaconDto: IDeleteBeaconDto) => Promise<AxiosResponse>;
  deleteLegacyBeacon: (
    deleteBeaconDto: IDeleteBeaconDto
  ) => Promise<AxiosResponse>;
}
