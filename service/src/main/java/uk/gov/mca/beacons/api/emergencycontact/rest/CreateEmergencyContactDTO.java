package uk.gov.mca.beacons.api.emergencycontact.rest;

import java.util.UUID;
import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CreateEmergencyContactDTO {

  private String fullName;
  private String telephoneNumber;
  private String alternativeTelephoneNumber;

  /**
   * Not being used as beacon uses are being created as part of a registration, when we
   * move to a more resource focussed API structure, this will be used
   */
  private UUID beaconId;
}
