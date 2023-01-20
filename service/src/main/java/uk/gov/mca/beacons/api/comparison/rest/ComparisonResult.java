package uk.gov.mca.beacons.api.comparison.rest;

import java.util.List;
import lombok.Getter;
import lombok.Setter;
import uk.gov.mca.beacons.api.search.domain.BeaconOverview;

@Getter
@Setter
public class ComparisonResult {

  private int dbCount;
  private int openSearchCount;
  private int missingCount;
  private List<BeaconOverview> missing;
}
