package uk.gov.mca.beacons.api.registration.rest;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonUnwrapped;
import java.util.List;
import javax.validation.Valid;
import lombok.*;
import uk.gov.mca.beacons.api.beacon.rest.BeaconRegistrationDTO;
import uk.gov.mca.beacons.api.beaconowner.rest.BeaconOwnerDTO;
import uk.gov.mca.beacons.api.beaconuse.rest.BeaconUseDTO;
import uk.gov.mca.beacons.api.emergencycontact.rest.EmergencyContactDTO;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegistrationDTO {

  @Valid
  @JsonUnwrapped
  BeaconRegistrationDTO beaconDTO;

  @Valid
  @JsonProperty("owner")
  BeaconOwnerDTO beaconOwnerDTO;

  @Valid
  @JsonProperty("uses")
  List<BeaconUseDTO> beaconUseDTOs;

  @Valid
  @JsonProperty("emergencyContacts")
  List<EmergencyContactDTO> emergencyContactDTOs;
}
