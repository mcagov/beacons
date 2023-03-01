package uk.gov.mca.beacons.api.duplicates.domain;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DuplicatesSummary {

  public String hexId;
  public Long numberOfBeacons;
}
