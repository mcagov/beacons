package uk.gov.mca.beacons.api.emergencycontact.domain;

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

@Getter
@EntityListeners(AuditingEntityListener.class)
@Entity(name = "emergency_contact")
public class EmergencyContact extends BaseAggregateRoot<EmergencyContactId> {

  public static final String ID_GENERATOR_NAME =
    "emergencycontact-id-generator";

  @Type(
    type = "uk.gov.mca.beacons.api.emergencycontact.domain.EmergencyContactId"
  )
  @Column(nullable = false)
  @Id
  @GeneratedValue(
    strategy = GenerationType.AUTO,
    generator = "emergencycontact-id-generator"
  )
  private EmergencyContactId id;

  @Setter
  @NotNull
  private String fullName;

  @Setter
  private String telephoneNumber;

  @Setter
  private String alternativeTelephoneNumber;

  @CreatedDate
  private OffsetDateTime createdDate;

  @LastModifiedDate
  private OffsetDateTime lastModifiedDate;

  @Type(type = "uk.gov.mca.beacons.api.beacon.domain.BeaconId")
  @Setter
  @NotNull
  private BeaconId beaconId;
}
