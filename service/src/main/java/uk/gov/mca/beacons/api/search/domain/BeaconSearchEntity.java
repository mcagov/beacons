package uk.gov.mca.beacons.api.search.domain;

import java.time.OffsetDateTime;
import java.util.UUID;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "beacon_search")
@Getter
@Setter
public class BeaconSearchEntity {

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
}
