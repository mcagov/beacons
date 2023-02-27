package uk.gov.mca.beacons.api.legacybeacon.rest.dto;

import java.util.List;
import javax.validation.Valid;
import lombok.*;
import uk.gov.mca.beacons.api.dto.DomainDTO;
import uk.gov.mca.beacons.api.legacybeacon.domain.*;

public class LegacyBeaconDTO extends DomainDTO<LegacyBeaconDTO.Attributes> {

  private String type = "legacyBeacon";

  public String getType() {
    return type;
  }

  @Getter
  @Setter
  @Builder
  @NoArgsConstructor
  @AllArgsConstructor
  public static class Attributes {

    @Valid
    private LegacyBeaconDetails beacon;

    private LegacyOwner owner;
    private List<LegacyUse> uses;
    private List<LegacySecondaryOwner> secondaryOwners;
    private LegacyEmergencyContact emergencyContact;
    private String claimStatus;
  }
}
