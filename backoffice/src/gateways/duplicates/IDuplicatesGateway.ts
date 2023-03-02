import { IDuplicatesSummaryDTO } from "./IDuplicatesSummaryDTO";

export interface IDuplicatesGateway {
  getDuplicates: () => Promise<IDuplicatesSummaryDTO>;
}
