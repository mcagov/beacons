package uk.gov.mca.beacons.api.comparison.rest;

import java.util.HashMap;
import java.util.List;
import java.util.UUID;
import lombok.Getter;
import lombok.Setter;
import uk.gov.mca.beacons.api.search.domain.BeaconOverview;

@Getter
@Setter
public class ComparisonResult {

  private int dbCount;
  private HashMap<UUID, BeaconOverview> dbBeacons;
}
