package uk.gov.mca.beacons.api.legacybeacon.domain;

import java.time.OffsetDateTime;
import javax.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Type;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import uk.gov.mca.beacons.api.shared.domain.base.BaseEntity;

// TODO: Refactor table names
@Getter
@EntityListeners(AuditingEntityListener.class)
@Entity(name = "legacy_beacon_claim_event")
@Table(name = "legacy_beacon_claim_event")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(
  name = "claim_event_type",
  discriminatorType = DiscriminatorType.STRING
)
public abstract class LegacyBeaconAction
  extends BaseEntity<LegacyBeaconActionId> {

  public static final String ID_GENERATOR_NAME =
    "legacybeaconaction-id-generator";

  @Type(
    type = "uk.gov.mca.beacons.api.legacybeacon.domain.LegacyBeaconActionId"
  )
  @Column(nullable = false)
  @Id
  @GeneratedValue(
    strategy = GenerationType.AUTO,
    generator = "legacybeaconaction-id-generator"
  )
  protected LegacyBeaconActionId id;

  // TODO: Update column name to created_date
  @CreatedDate
  @Column(name = "when_happened")
  OffsetDateTime createdDate;
}
