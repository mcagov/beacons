package uk.gov.mca.beacons.api.beaconowner.rest;

import com.fasterxml.jackson.annotation.JsonUnwrapped;
import java.util.UUID;
import lombok.*;
import uk.gov.mca.beacons.api.shared.rest.person.dto.AddressDTO;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CreateBeaconOwnerDTO {

  private String fullName;
  private String email;
  private String telephoneNumber;
  private String alternativeTelephoneNumber;

  @JsonUnwrapped
  private AddressDTO addressDTO;

  /**
   * Not being used as beacon owners are being created as part of a registration, when we
   * move to a more resource focussed API structure, this will be used
   */
  private UUID beaconId;
}
