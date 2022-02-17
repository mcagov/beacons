package uk.gov.mca.beacons.api.accountholder.domain;

import java.time.OffsetDateTime;
import java.util.Objects;
import java.util.UUID;
import javax.persistence.*;
import javax.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.annotations.Type;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import uk.gov.mca.beacons.api.accountholder.domain.events.AccountHolderCreated;
import uk.gov.mca.beacons.api.accountholder.domain.events.AccountHolderUpdated;
import uk.gov.mca.beacons.api.mappers.ModelPatcher;
import uk.gov.mca.beacons.api.shared.domain.base.BaseAggregateRoot;
import uk.gov.mca.beacons.api.shared.domain.person.Address;
import uk.gov.mca.beacons.api.shared.domain.user.User;

@Getter
@EntityListeners(AuditingEntityListener.class)
@Entity(name = "account_holder")
public class AccountHolder
  extends BaseAggregateRoot<AccountHolderId>
  implements User {

  public static final String ID_GENERATOR_NAME = "accountholder-id-generator";

  @Type(type = "uk.gov.mca.beacons.api.accountholder.domain.AccountHolderId")
  @Column(nullable = false)
  @Id
  @GeneratedValue(
    strategy = javax.persistence.GenerationType.AUTO,
    generator = "accountholder-id-generator"
  )
  private AccountHolderId id;

  @Setter
  @NotNull
  @Column(unique = true)
  private String authId;

  @Setter
  private String fullName;

  @Setter
  @NotNull
  private String email;

  @Setter
  private String telephoneNumber;

  @Setter
  private String alternativeTelephoneNumber;

  @Embedded
  @Setter
  private Address address;

  @CreatedDate
  private OffsetDateTime createdDate;

  @LastModifiedDate
  private OffsetDateTime lastModifiedDate;

  public void update(
    AccountHolder accountHolder,
    ModelPatcher<AccountHolder> patcher
  ) {
    patcher.patchModel(this, accountHolder);
    this.registerEvent(new AccountHolderUpdated(this));
  }

  public void registerCreatedEvent() {
    this.registerEvent(new AccountHolderCreated(this));
  }

  public UUID getUserId() {
    return Objects.requireNonNull(getId()).unwrap();
  }
}
