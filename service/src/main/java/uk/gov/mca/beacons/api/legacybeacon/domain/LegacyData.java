package uk.gov.mca.beacons.api.legacybeacon.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.List;
import lombok.*;
import uk.gov.mca.beacons.api.shared.domain.base.ValueObject;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class LegacyData implements ValueObject, Serializable {

  private LegacyBeaconDetails beacon;
  private LegacyOwner owner;
  private List<LegacyUse> uses;
  private List<LegacySecondaryOwner> secondaryOwners;
  private LegacyEmergencyContact emergencyContact;
}
