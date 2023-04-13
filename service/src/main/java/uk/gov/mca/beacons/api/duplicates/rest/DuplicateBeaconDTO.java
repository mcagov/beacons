package uk.gov.mca.beacons.api.duplicates.rest;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;
import lombok.Builder;
import lombok.Setter;
import uk.gov.mca.beacons.api.duplicates.domain.DuplicateBeacon;

@Builder
@Setter
public class DuplicateBeaconDTO {

  public UUID beaconId;
  public String hexId;
  public OffsetDateTime lastModifiedDate;
  public String status;
  public String category;
}
