package uk.gov.mca.beacons.api.accountholder.domain;

import java.util.UUID;
import uk.gov.mca.beacons.api.shared.domain.base.DomainObjectId;

public class AccountHolderId extends DomainObjectId {

  public AccountHolderId(UUID id) {
    super(id);
  }
}
