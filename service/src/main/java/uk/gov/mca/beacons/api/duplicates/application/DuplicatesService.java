package uk.gov.mca.beacons.api.duplicates.application;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import uk.gov.mca.beacons.api.beacon.application.BeaconService;
import uk.gov.mca.beacons.api.beacon.domain.Beacon;
import uk.gov.mca.beacons.api.duplicates.rest.DuplicatesSummaryDTO;
import uk.gov.mca.beacons.api.legacybeacon.application.LegacyBeaconService;

public class DuplicatesService {

  private final BeaconService beaconService;
  private final LegacyBeaconService legacyBeaconService;

  public DuplicatesService(
    BeaconService beaconService,
    LegacyBeaconService legacyBeaconService
  ) {
    this.beaconService = beaconService;
    this.legacyBeaconService = legacyBeaconService;
  }

  public List<DuplicatesSummaryDTO> getDuplicateSummaries() {
    List<DuplicatesSummaryDTO> duplicateSummaries = new ArrayList<>();
    Map<String, Long> modernBeaconHexIdsWithDuplicateCounts = beaconService.findHexIdsWithDuplicates();
  }
}
