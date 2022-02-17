package uk.gov.mca.beacons.api.beacon.domain;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import javax.persistence.*;
import javax.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Type;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import uk.gov.mca.beacons.api.accountholder.domain.AccountHolderId;
import uk.gov.mca.beacons.api.beacon.domain.events.BeaconCreated;
import uk.gov.mca.beacons.api.shared.domain.base.BaseAggregateRoot;

@Getter
@EntityListeners(AuditingEntityListener.class)
@Entity(name = "beacon")
public class Beacon extends BaseAggregateRoot<BeaconId> {

  public static final String ID_GENERATOR_NAME = "beacon-id-generator";

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

  @CreatedDate
  private OffsetDateTime createdDate;

  @LastModifiedDate
  private OffsetDateTime lastModifiedDate;

  @Type(type = "uk.gov.mca.beacons.api.accountholder.domain.AccountHolderId")
  @Setter
  @NotNull
  private AccountHolderId accountHolderId;

  public void registerCreatedEvent() {
    this.registerEvent(new BeaconCreated(this));
  }
}
