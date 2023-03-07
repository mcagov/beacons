import { IDuplicateSummary } from "./IDuplicatesSummaryDTO";

export interface IDuplicatesGateway {
  getDuplicates: (
    pageNumber: number,
    duplicateSummariesPerPage: number
  ) => Promise<IDuplicateSummary[]>;
}
