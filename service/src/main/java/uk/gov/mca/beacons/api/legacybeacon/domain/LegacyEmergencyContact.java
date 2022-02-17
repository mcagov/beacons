package uk.gov.mca.beacons.api.legacybeacon.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import lombok.*;
import uk.gov.mca.beacons.api.shared.domain.base.ValueObject;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class LegacyEmergencyContact implements ValueObject, Serializable {

  private String details;
}
