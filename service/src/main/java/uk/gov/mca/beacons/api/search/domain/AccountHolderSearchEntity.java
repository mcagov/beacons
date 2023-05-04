package uk.gov.mca.beacons.api.search.domain;

import java.time.OffsetDateTime;
import java.util.UUID;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "account_holders")
@Getter
@Setter
public class AccountHolderSearchEntity {

  @Id
  private UUID id;

  private String fullName;
  private String email;
  private OffsetDateTime lastModifiedDate;
  private OffsetDateTime createdDate;
  private int beaconCount;
}
