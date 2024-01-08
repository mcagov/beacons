package uk.gov.mca.beacons.api.beacon.domain;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.HashMap;
import java.util.Map;
import javax.persistence.*;
import javax.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Type;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import uk.gov.mca.beacons.api.accountholder.domain.AccountHolderId;
import uk.gov.mca.beacons.api.beacon.domain.events.BeaconCreated;
import uk.gov.mca.beacons.api.beacon.domain.events.BeaconDeleted;
import uk.gov.mca.beacons.api.beacon.domain.events.BeaconUpdated;
import uk.gov.mca.beacons.api.mappers.ModelPatcher;
import uk.gov.mca.beacons.api.shared.domain.base.BaseAggregateRoot;

@Getter
@EntityListeners(AuditingEntityListener.class)
@Entity(name = "beacon")
@NamedQuery(
  name = "PagingBeaconReader",
  query = "select b from beacon b order by lastModifiedDate",
  hints = @QueryHint(name = "org.hibernate.readOnly", value = "true")
)
public class Beacon extends BaseAggregateRoot<BeaconId> {

  public static final String ID_GENERATOR_NAME = "beacon-id-generator";

  @Setter
  @Type(type = "uk.gov.mca.beacons.api.beacon.domain.BeaconId")
  @Column(nullable = false)
  @Id
  @GeneratedValue(
    strategy = GenerationType.AUTO,
    generator = "beacon-id-generator"
  )
  private BeaconId id;

  @Setter
  @NotNull
  private String hexId;

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

  @Setter
  @Enumerated(EnumType.STRING)
  private BeaconStatus beaconStatus;

  @Setter
  @CreatedDate
  private OffsetDateTime createdDate;

  @Setter
  @LastModifiedDate
  private OffsetDateTime lastModifiedDate;

  @Type(type = "uk.gov.mca.beacons.api.accountholder.domain.AccountHolderId")
  @Setter
  @NotNull
  private AccountHolderId accountHolderId;

  public void registerCreatedEvent() {
    this.registerEvent(new BeaconCreated(this));
  }

  public boolean isChange() {
    if (this.createdDate == null) {
      return false;
    }

    if (this.beaconStatus != BeaconStatus.NEW) {
      return false;
    }

    return OffsetDateTime.now().isAfter(this.createdDate.plusDays(1));
  }

  public void update(Beacon patch, ModelPatcher<Beacon> patcher) {
    patcher.patchModel(this, patch);
    if (isChange()) {
      setBeaconStatus(BeaconStatus.CHANGE);
    }
    this.registerEvent(new BeaconUpdated(this));
  }

  public void softDelete() {
    setBeaconStatus(BeaconStatus.DELETED);
    this.registerEvent(new BeaconDeleted(this));
  }
}
