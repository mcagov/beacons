package uk.gov.mca.beacons.api.duplicates.application;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import uk.gov.mca.beacons.api.beacon.application.BeaconService;
import uk.gov.mca.beacons.api.beacon.domain.Beacon;
import uk.gov.mca.beacons.api.duplicates.domain.DuplicateBeacon;
import uk.gov.mca.beacons.api.duplicates.domain.DuplicatesSummary;
import uk.gov.mca.beacons.api.exceptions.ResourceNotFoundException;
import uk.gov.mca.beacons.api.legacybeacon.application.LegacyBeaconService;
import uk.gov.mca.beacons.api.legacybeacon.domain.LegacyBeacon;

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

  public List<DuplicatesSummary> getDuplicateSummaries() {
    List<DuplicatesSummary> duplicateSummaries = new ArrayList<>();
    Map<String, Long> beaconHexIdsWithDuplicateCounts = beaconService.findHexIdsWithDuplicates();
    Map<String, Long> legacyBeaconHexIdsWithDuplicateCounts = legacyBeaconService.findHexIdsWithDuplicates();

    beaconHexIdsWithDuplicateCounts.putAll(
      legacyBeaconHexIdsWithDuplicateCounts
    );

    for (String hexId : beaconHexIdsWithDuplicateCounts.keySet()) {
      DuplicatesSummary summary = new DuplicatesSummary();
      summary.setHexId(hexId);
      summary.setNumberOfBeacons(beaconHexIdsWithDuplicateCounts.get(hexId));

      duplicateSummaries.add(summary);
    }

    return duplicateSummaries;
  }

  public List<DuplicateBeacon> getDuplicatesForHexId(String hexId) {
    List<DuplicateBeacon> duplicateBeaconsForHexId = new ArrayList<>();

    try {
      List<Beacon> duplicateModernBeacons = beaconService.findByHexId(hexId);
      duplicateBeaconsForHexId.addAll(
        duplicateModernBeacons
          .stream()
          .map(b ->
            new DuplicateBeacon(
              b.getId().unwrap(),
              b.getHexId(),
              b.getLastModifiedDate(),
              b.getBeaconStatus().toString(),
              "NEW"
            )
          )
          .collect(Collectors.toList())
      );
    } catch (ResourceNotFoundException e) {
      List<LegacyBeacon> duplicateLegacyBeacons = legacyBeaconService.findByHexId(
        hexId
      );
      duplicateBeaconsForHexId.addAll(
        duplicateLegacyBeacons
          .stream()
          .map(b ->
            new DuplicateBeacon(
              b.getId().unwrap(),
              b.getHexId(),
              b.getLastModifiedDate(),
              b.getBeaconStatus(),
              "MIGRATED"
            )
          )
          .collect(Collectors.toList())
      );
    }

    return duplicateBeaconsForHexId;
  }
}
