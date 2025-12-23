package uk.gov.mca.beacons.api.beaconsearch.rest;

import java.time.OffsetDateTime;
import java.util.UUID;
import javax.persistence.Id;
import lombok.*;

@EqualsAndHashCode
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BeaconSearchDTO {

  @Id
  private UUID id;

  private OffsetDateTime createdDate;
  private OffsetDateTime lastModifiedDate;
  private String beaconStatus;
  private String hexId;
  private String ownerName;
  private String ownerEmail;
  private String legacyBeaconRecoveryEmail;
  private UUID accountHolderId;
  private String accountHolderName;
  private String accountHolderEmail;
  private String useActivities;
  private String vesselNames;
  private String registrationMarks;
  private String beaconType;
  private String manufacturerSerialNumber;
  private String cospasSarsatNumber;
  private String mainUseName;
}
