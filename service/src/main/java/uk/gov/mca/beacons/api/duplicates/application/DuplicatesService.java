package uk.gov.mca.beacons.api.duplicates.application;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import uk.gov.mca.beacons.api.beacon.application.BeaconService;
import uk.gov.mca.beacons.api.beacon.domain.Beacon;
import uk.gov.mca.beacons.api.duplicates.domain.DuplicateBeacon;
import uk.gov.mca.beacons.api.duplicates.domain.DuplicatesRepository;
import uk.gov.mca.beacons.api.duplicates.domain.DuplicatesSummary;
import uk.gov.mca.beacons.api.exceptions.ResourceNotFoundException;
import uk.gov.mca.beacons.api.legacybeacon.application.LegacyBeaconService;
import uk.gov.mca.beacons.api.legacybeacon.domain.LegacyBeacon;

@Service("DuplicatesService")
public class DuplicatesService {

  private final DuplicatesRepository duplicatesRepository;
  private final BeaconService beaconService;
  private final LegacyBeaconService legacyBeaconService;

  @Autowired
  public DuplicatesService(
    DuplicatesRepository duplicatesRepository,
    BeaconService beaconService,
    LegacyBeaconService legacyBeaconService
  ) {
    this.duplicatesRepository = duplicatesRepository;
    this.beaconService = beaconService;
    this.legacyBeaconService = legacyBeaconService;
  }

  public List<DuplicatesSummary> getDuplicateSummaries(
    int pageNumber,
    int numberPerPage
  ) {
    int numberAlreadyTaken = pageNumber * numberPerPage;

    List<DuplicatesSummary> duplicateSummaries = getBatch(
      numberPerPage,
      numberAlreadyTaken
    );

    return duplicateSummaries;
  }

  private List<DuplicatesSummary> getBatch(
    int numberPerPage,
    int numberAlreadyTaken
  ) {
    return duplicatesRepository
      .findAll()
      .stream()
      .skip(numberAlreadyTaken)
      .limit(numberPerPage)
      .collect(Collectors.toList());
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
