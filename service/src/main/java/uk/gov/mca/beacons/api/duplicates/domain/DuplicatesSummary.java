package uk.gov.mca.beacons.api.duplicates.domain;

import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.Id;
import javax.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Getter
@Setter
@EntityListeners(AuditingEntityListener.class)
@Entity(name = "duplicateSummary")
@Table(name = "duplicate_hex_ids")
public class DuplicatesSummary {

  @Id
  public String hexId;

  public Integer numberOfBeacons;
}
