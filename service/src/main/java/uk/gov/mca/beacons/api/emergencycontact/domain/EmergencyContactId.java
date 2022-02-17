package uk.gov.mca.beacons.api.emergencycontact.domain;

import java.util.UUID;
import uk.gov.mca.beacons.api.shared.domain.base.DomainObjectId;

public class EmergencyContactId extends DomainObjectId {

  public EmergencyContactId(UUID id) {
    super(id);
  }
}
