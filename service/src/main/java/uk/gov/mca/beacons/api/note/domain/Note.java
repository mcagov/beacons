package uk.gov.mca.beacons.api.note.domain;

import java.time.OffsetDateTime;
import java.util.UUID;
import javax.persistence.*;
import javax.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Type;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import uk.gov.mca.beacons.api.beacon.domain.BeaconId;
import uk.gov.mca.beacons.api.shared.domain.base.BaseAggregateRoot;
import uk.gov.mca.beacons.api.shared.domain.user.User;

@Getter
@EntityListeners(AuditingEntityListener.class)
@Entity(name = "notev2")
@Table(name = "note")
public class Note extends BaseAggregateRoot<NoteId> {

  public static final String ID_GENERATOR_NAME = "note-id-generator";

  @Type(type = "uk.gov.mca.beacons.api.note.domain.NoteId")
  @Column(nullable = false)
  @Id
  @GeneratedValue(
    strategy = GenerationType.AUTO,
    generator = "note-id-generator"
  )
  private NoteId id;

  @Setter
  @Type(type = "uk.gov.mca.beacons.api.beacon.domain.BeaconId")
  @NotNull
  private BeaconId beaconId;

  @Setter
  private String fullName;

  @Setter
  private String email;

  @Setter
  private String text;

  @Setter
  @Enumerated(EnumType.STRING)
  private NoteType type;

  @Setter
  private UUID userId;

  @CreatedDate
  private OffsetDateTime createdDate;

  public void setUser(User user) {
    setEmail(user.getEmail());
    setFullName(user.getFullName());
    setUserId(user.getUserId());
  }
}
