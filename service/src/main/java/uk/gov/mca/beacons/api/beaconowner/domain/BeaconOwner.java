package uk.gov.mca.beacons.api.beaconowner.domain;

import java.time.OffsetDateTime;
import javax.persistence.*;
import javax.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Type;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import uk.gov.mca.beacons.api.beacon.domain.BeaconId;
import uk.gov.mca.beacons.api.shared.domain.base.BaseAggregateRoot;
import uk.gov.mca.beacons.api.shared.domain.person.Address;

@Getter
@EntityListeners(AuditingEntityListener.class)
@Entity(name = "beacon_owner")
@Table(name = "beacon_owner")
public class BeaconOwner extends BaseAggregateRoot<BeaconOwnerId> {

  public static final String ID_GENERATOR_NAME = "beaconowner-id-generator";

  @Type(type = "uk.gov.mca.beacons.api.beaconowner.domain.BeaconOwnerId")
  @Column(nullable = false)
  @Id
  @GeneratedValue(
    strategy = GenerationType.AUTO,
    generator = "beaconowner-id-generator"
  )
  private BeaconOwnerId id;

  @Setter
  @NotNull
  private String fullName;

  @Setter
  @NotNull
  private String email;

  @Setter
  private String telephoneNumber;

  @Setter
  private String alternativeTelephoneNumber;

  @Setter
  @Embedded
  private Address address;

  @CreatedDate
  private OffsetDateTime createdDate;

  @LastModifiedDate
  private OffsetDateTime lastModifiedDate;

  @Type(type = "uk.gov.mca.beacons.api.beacon.domain.BeaconId")
  @Setter
  @NotNull
  private BeaconId beaconId;
}
