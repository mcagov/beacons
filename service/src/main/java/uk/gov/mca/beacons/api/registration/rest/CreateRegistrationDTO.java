package uk.gov.mca.beacons.api.registration.rest;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonUnwrapped;
import java.util.List;
import javax.validation.Valid;
import lombok.*;
import uk.gov.mca.beacons.api.beacon.rest.CreateBeaconDTO;
import uk.gov.mca.beacons.api.beaconowner.rest.CreateBeaconOwnerDTO;
import uk.gov.mca.beacons.api.beaconuse.rest.CreateBeaconUseDTO;
import uk.gov.mca.beacons.api.emergencycontact.rest.CreateEmergencyContactDTO;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CreateRegistrationDTO {

  @Valid
  @JsonUnwrapped
  private CreateBeaconDTO createBeaconDTO;

  @Valid
  @JsonProperty("uses")
  private List<CreateBeaconUseDTO> createBeaconUseDTOs;

  @Valid
  @JsonProperty("owner")
  private CreateBeaconOwnerDTO createBeaconOwnerDTO;

  @Valid
  @JsonProperty("emergencyContacts")
  private List<CreateEmergencyContactDTO> createEmergencyContactDTOs;
}
