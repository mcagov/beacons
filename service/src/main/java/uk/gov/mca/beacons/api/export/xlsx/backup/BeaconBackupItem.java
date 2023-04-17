package uk.gov.mca.beacons.api.export.xlsx.backup;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;
import javax.persistence.*;
import javax.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Type;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import uk.gov.mca.beacons.api.accountholder.domain.AccountHolderId;
import uk.gov.mca.beacons.api.legacybeacon.domain.LegacyData;

@Getter
@EntityListeners(AuditingEntityListener.class)
@Entity
@Table(name = "beacon_backup")
@NamedQuery(
  name = "PagingBeaconBackupItemReader",
  query = "select b from BeaconBackupItem b",
  hints = @QueryHint(name = "org.hibernate.readOnly", value = "true")
)
public class BeaconBackupItem {

  public static final String ID_GENERATOR_NAME = "beacon-id-generator";

  @Type(type = "java.util.UUID")
  @Column(nullable = false)
  @Id
  @GeneratedValue(
    strategy = GenerationType.AUTO,
    generator = "beacon-id-generator"
  )
  // fields shared by modern and legacy
  private UUID id;

  @Setter
  @NotNull
  private String hexId;

  @Setter
  private String beaconStatus;

  @Setter
  @Enumerated(EnumType.STRING)
  private BeaconCategory category;

  @CreatedDate
  private OffsetDateTime createdDate;

  @LastModifiedDate
  private OffsetDateTime lastModifiedDate;

  // modern beacon fields
  @Setter
  @NotNull
  private String manufacturer;

  @Setter
  @NotNull
  private String model;

  @Setter
  @NotNull
  private String manufacturerSerialNumber;

  @Setter
  private String referenceNumber;

  @Setter
  private AccountHolderId accountHolderId;

  @Setter
  private String chkCode;

  @Setter
  private LocalDate batteryExpiryDate;

  @Setter
  private LocalDate lastServicedDate;

  @Setter
  private String mti;

  @Setter
  private Boolean svdr;

  @Setter
  private String csta;

  @Setter
  private String beaconType;

  @Setter
  private String protocol;

  @Setter
  private String coding;

  // legacy beacon fields
  @Setter
  @Type(type = "json")
  @Column(columnDefinition = "jsonb")
  private LegacyData data;

  @Setter
  private String ownerName;

  @Setter
  private String ownerEmail;

  @Setter
  private String useActivities;
}
