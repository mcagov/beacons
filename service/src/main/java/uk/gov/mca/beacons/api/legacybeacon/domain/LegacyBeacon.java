package uk.gov.mca.beacons.api.legacybeacon.domain;

import com.vladmihalcea.hibernate.type.json.JsonType;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import javax.persistence.*;
import javax.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Type;
import org.hibernate.annotations.TypeDef;
import org.hibernate.annotations.TypeDefs;
import uk.gov.mca.beacons.api.shared.domain.base.BaseAggregateRoot;

@Getter
@Entity
@Table(name = "legacy_beacon")
@TypeDefs({ @TypeDef(name = "json", typeClass = JsonType.class) })
public class LegacyBeacon extends BaseAggregateRoot<LegacyBeaconId> {

  public static final String ID_GENERATOR_NAME = "legacybeacon-id-generator";

  @Type(type = "uk.gov.mca.beacons.api.legacybeacon.domain.LegacyBeaconId")
  @Column(nullable = false)
  @Id
  @GeneratedValue(
    strategy = GenerationType.AUTO,
    generator = "legacybeacon-id-generator"
  )
  private LegacyBeaconId id;

  @Setter
  private String hexId;

  @Setter
  private String ownerEmail;

  @Setter
  @Getter(AccessLevel.NONE)
  private String beaconStatus;

  @Setter
  private String ownerName;

  @Setter
  private String useActivities;

  @Setter
  @Type(type = "json")
  @Column(columnDefinition = "jsonb")
  private LegacyData data;

  @OneToMany(
    cascade = CascadeType.ALL,
    orphanRemoval = true,
    fetch = FetchType.EAGER
  )
  @JoinColumn(name = "legacy_beacon_id", nullable = false)
  private List<LegacyBeaconAction> actions;

  @Setter
  @NotNull
  private OffsetDateTime createdDate;

  @Setter
  @NotNull
  private OffsetDateTime lastModifiedDate;

  public boolean isClaimed() {
    if (actions == null) {
      return false;
    }

    return actions.stream().anyMatch(LegacyBeaconClaimAction.class::isInstance);
  }

  public void claim() {
    initActions();
    if (!isClaimed()) {
      LegacyBeaconClaimAction claimAction = new LegacyBeaconClaimAction();
      actions.add(claimAction);
    }
  }

  public String getBeaconStatus() {
    if (isClaimed()) {
      return "CLAIMED";
    }

    return beaconStatus;
  }

  // TODO: Add constructor to initialize list of actions
  private void initActions() {
    if (actions == null) {
      actions = new ArrayList<>();
    }
  }
}
