import {
  IDuplicatesSummaryDTO,
  IDuplicateSummary,
} from "./IDuplicatesSummaryDTO";

export interface IDuplicatesGateway {
  getDuplicates: () => Promise<IDuplicateSummary[]>;
}
