package uk.gov.mca.beacons.api.duplicates.domain;

import java.time.OffsetDateTime;
import java.util.UUID;
import lombok.Getter;

@Getter
public class DuplicateBeacon {

  private final UUID beaconId;
  private final String hexId;
  private final OffsetDateTime lastModifiedDate;
  private final String status;
  private final String category;

  public DuplicateBeacon(
    UUID beaconId,
    String hexId,
    OffsetDateTime lastModifiedDate,
    String status,
    String category
  ) {
    this.beaconId = beaconId;
    this.hexId = hexId;
    this.lastModifiedDate = lastModifiedDate;
    this.status = status;
    this.category = category;
  }
}
