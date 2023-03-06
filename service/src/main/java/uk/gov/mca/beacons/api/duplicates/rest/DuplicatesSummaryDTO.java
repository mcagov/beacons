package uk.gov.mca.beacons.api.duplicates.rest;

import java.util.List;
import lombok.Getter;
import lombok.Setter;
import uk.gov.mca.beacons.api.duplicates.domain.DuplicatesSummary;

@Getter
@Setter
public class DuplicatesSummaryDTO {

  List<DuplicatesSummary> duplicateSummaries;
  int pageNumber;
  int numberOfDuplicateSummariesPerPage;
  int totalNumberOfPages;
}
