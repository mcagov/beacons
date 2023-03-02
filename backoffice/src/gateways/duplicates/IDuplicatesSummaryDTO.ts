export interface IDuplicatesSummaryDTO {
  duplicateSummaries: IDuplicateSummary[];
}

export interface IDuplicateSummary {
  hexId: string;
  numberOfBeacons: number;
}
