package uk.gov.mca.beacons.api.emergencycontact.rest;

import java.util.UUID;
import javax.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmergencyContactDTO {

  @NotNull
  private UUID id;

  @NotNull
  private String fullName;

  private String telephoneNumber;

  private String alternativeTelephoneNumber;

  private UUID beaconId;
}
