package uk.gov.mca.beacons.api.export.rest;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;
import javax.validation.Valid;
import lombok.*;
import uk.gov.mca.beacons.api.beacon.domain.BeaconId;
import uk.gov.mca.beacons.api.emergencycontact.rest.EmergencyContactDTO;
import uk.gov.mca.beacons.api.note.domain.Note;
import uk.gov.mca.beacons.api.note.rest.NoteDTO;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BeaconBackupExportDTO {

  @Valid
  private String id;

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

  //This is only valid for legacy.
  @Valid
  private String cospasSarsatNumber;

  @Valid
  private String chkCode;

  @Valid
  //This is only valid for legacy.
  private String beaconNote;

  @Valid
  //These are only valid for new beacons
  List<Note> notes;

  @Valid
  List<BeaconExportUseDTO> uses;

  @Valid
  List<BeaconExportOwnerDTO> owners;

  @Valid
  BeaconExportAccountHolderDTO accountHolder;

  @Valid
  List<EmergencyContactDTO> emergencyContacts;
}
