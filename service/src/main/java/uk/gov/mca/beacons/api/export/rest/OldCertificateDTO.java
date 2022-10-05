package uk.gov.mca.beacons.api.export.rest;

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
public class OldCertificateDTO {

  @Valid
  @JsonProperty("proofOfRegistrationDate")
  String proofOfRegistrationDate;

  @Valid
  @JsonProperty("mcaContactNumber")
  String mcaContactNumber;

  @Valid
  @JsonProperty("beacon")
  BeaconRegistrationDTO beaconDTO;

  @Valid
  @JsonProperty("beaconCreatedDate")
  String beaconCreatedDate;

  @Valid
  @JsonProperty("beaconLastServicedDate")
  String beaconLastServicedDate;

  @Valid
  @JsonProperty("beaconBatteryExpiryDate")
  String beaconBatteryExpiryDate;

  @Valid
  @JsonProperty("owner")
  BeaconOwnerDTO beaconOwnerDTO;

  @Valid
  @JsonProperty("uses")
  List<BeaconUseDTO> beaconUseDTOs;

  @Valid
  @JsonProperty("emergencyContacts")
  List<EmergencyContactDTO> emergencyContactDTOs;

  @Valid
  @JsonProperty("notes")
  List<NoteDTO> noteDTOs;
}
