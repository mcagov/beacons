package uk.gov.mca.beacons.api.duplicates.rest;

import java.util.List;
import uk.gov.mca.beacons.api.duplicates.domain.DuplicateBeacon;

public class DuplicateBeaconsDTO {

  List<DuplicateBeacon> duplicateBeacons;

  public DuplicateBeaconsDTO(List<DuplicateBeacon> duplicateBeacons) {
    this.duplicateBeacons = duplicateBeacons;
  }
}
