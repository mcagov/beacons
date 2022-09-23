package uk.gov.mca.beacons.api.registration.rest;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;
import javax.validation.Valid;
import lombok.*;
import uk.gov.mca.beacons.api.beacon.rest.BeaconRegistrationDTO;
import uk.gov.mca.beacons.api.beaconowner.rest.BeaconOwnerDTO;
import uk.gov.mca.beacons.api.beaconuse.rest.BeaconUseDTO;
import uk.gov.mca.beacons.api.emergencycontact.rest.EmergencyContactDTO;
import uk.gov.mca.beacons.api.note.rest.NoteDTO;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class LabelDTO {

  @Valid
  @JsonProperty("mcaContactNumber")
  String mcaContactNumber;

  @Valid
  @JsonProperty("beaconUse")
  String beaconUse;

  @Valid
  @JsonProperty("hexId")
  String hexId;

  @Valid
  @JsonProperty("coding")
  String coding;

  @Valid
  @JsonProperty("proofOfRegistrationDate")
  String proofOfRegistrationDate;
}
