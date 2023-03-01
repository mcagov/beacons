package uk.gov.mca.beacons.api.duplicates.rest;

import java.util.List;
import uk.gov.mca.beacons.api.duplicates.domain.DuplicatesSummary;

public class DuplicatesSummaryDTO {

  List<DuplicatesSummary> duplicateSummaries;

  public DuplicatesSummaryDTO(List<DuplicatesSummary> duplicateSummaries) {
    this.duplicateSummaries = duplicateSummaries;
  }
}
