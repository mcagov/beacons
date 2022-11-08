package uk.gov.mca.beacons.api.export.rest;

import java.time.OffsetDateTime;
import java.util.List;
import javax.validation.Valid;
import lombok.*;
import uk.gov.mca.beacons.api.emergencycontact.rest.EmergencyContactDTO;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BeaconExportDTO {

  @Valid
  private String type;

  @Valid
  private String name;

  @Valid
  private OffsetDateTime proofOfRegistrationDate;

  @Valid
  //This is only valid for legacy.
  private String departmentReference;

  @Valid
  private String referenceNumber;

  @Valid
  private String recordCreatedDate;

  @Valid
  private OffsetDateTime lastModifiedDate;

  @Valid
  private String beaconStatus;

  @Valid
  private String hexId;

  @Valid
  private String manufacturer;

  @Valid
  private int serialNumber;

  @Valid
  private String manufacturerSerialNumber;

  @Valid
  private String beaconModel;

  @Valid
  private String beaconlastServiced;

  @Valid
  private String beaconCoding;

  @Valid
  private String batteryExpiryDate;

  @Valid
  private String codingProtocol;

  @Valid
  private String cstaNumber;

  @Valid
  //This is only valid for legacy.
  private String beaconNote;

  @Valid
  //These are only valid for new beacons
  List<BeaconExportNoteDTO> notes;

  @Valid
  List<BeaconExportUseDTO> uses;

  @Valid
  List<BeaconExportOwnerDTO> owners;

  @Valid
  BeaconExportAccountHolderDTO accountHolder;

  @Valid
  List<EmergencyContactDTO> emergencyContacts;
}
