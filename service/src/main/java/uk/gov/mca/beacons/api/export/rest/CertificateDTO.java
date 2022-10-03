package uk.gov.mca.beacons.api.export.rest;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.List;
import javax.validation.Valid;
import lombok.*;
import org.joda.time.DateTime;
import uk.gov.mca.beacons.api.emergencycontact.rest.EmergencyContactDTO;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CertificateDTO {

  @Valid
  private String type;

  @Valid
  private LocalDateTime proofOfRegistrationDate;

  @Valid
  //This is only valid for legacy.
  private String departmentReference;

  @Valid
  private LocalDateTime recordCreatedDate;

  @Valid
  private LocalDateTime lastModifiedDate;

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
  private LocalDateTime beaconlastServiced;

  @Valid
  private String beaconCoding;

  @Valid
  private LocalDateTime batteryExpiryDate;

  @Valid
  private String codingProtocol;

  @Valid
  private String cstaNumber;

  @Valid
  //This is only valid for legacy.
  private String beaconNote;

  @Valid
  //These are only valid for new beacons
  List<CertificateNoteDTO> notes;

  @Valid
  List<CertificateUseDTO> uses;

  @Valid
  List<CertificateOwnerDTO> owners;

  @Valid
  List<EmergencyContactDTO> emergencyContacts;
}
