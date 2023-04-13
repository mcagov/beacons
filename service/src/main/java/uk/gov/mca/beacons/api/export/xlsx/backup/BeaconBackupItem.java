package uk.gov.mca.beacons.api.export.xlsx.backup;

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
  private String category;

  @CreatedDate
  private OffsetDateTime createdDate;

  @LastModifiedDate
  private OffsetDateTime lastModifiedDate;

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
