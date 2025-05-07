package uk.gov.mca.beacons.api.registration.rest;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonUnwrapped;
import java.util.List;
import javax.validation.Valid;
import jdk.jfr.Name;
import lombok.*;
import uk.gov.mca.beacons.api.accountholder.rest.AccountHolderDTO;
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
  public BeaconRegistrationDTO beaconDTO;

  @Valid
  @JsonProperty("owner")
  public BeaconOwnerDTO beaconOwnerDTO;

  @Valid
  @JsonProperty("owners")
  public List<BeaconOwnerDTO> beaconOwnerDTOs;

  @Valid
  @JsonProperty("accountHolder")
  public AccountHolderDTO accountHolderDTO;

  @Valid
  @JsonProperty("uses")
  public List<BeaconUseDTO> beaconUseDTOs;

  @Valid
  @JsonProperty("emergencyContacts")
  public List<EmergencyContactDTO> emergencyContactDTOs;
}
