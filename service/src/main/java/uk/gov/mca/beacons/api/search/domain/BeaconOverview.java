package uk.gov.mca.beacons.api.search.domain;

import java.time.OffsetDateTime;
import java.util.UUID;
import lombok.Getter;
import lombok.Setter;
import org.apache.poi.ss.formula.functions.Offset;

@Getter
@Setter
public class BeaconOverview {

  public BeaconOverview(
    UUID id,
    String hexId,
    OffsetDateTime lastModifiedDate
  ) {
    setId(id);
    setHexId(hexId);
    setLastModifiedDate(lastModifiedDate);
  }

  private UUID id;
  private String hexId;
  private OffsetDateTime lastModifiedDate;
}
