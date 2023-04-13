import { IDuplicateSummary } from "./IDuplicatesSummaryDTO";
import { IDuplicateBeacon } from "../../entities/IDuplicateBeacon";

export interface IDuplicatesGateway {
  getDuplicates: (
    pageNumber: number,
    duplicateSummariesPerPage: number
  ) => Promise<IDuplicateSummary[]>;
  getDuplicatesForHexId: (hexId: string) => Promise<IDuplicateBeacon[]>;
}
