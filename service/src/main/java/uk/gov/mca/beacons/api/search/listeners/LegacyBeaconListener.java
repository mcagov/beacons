package uk.gov.mca.beacons.api.search.listeners;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionalEventListener;
import uk.gov.mca.beacons.api.legacybeacon.domain.events.LegacyBeaconClaimed;
import uk.gov.mca.beacons.api.search.BeaconSearchService;

@Component
public class LegacyBeaconListener {

  private final BeaconSearchService beaconSearchService;

  @Autowired
  public LegacyBeaconListener(BeaconSearchService beaconSearchService) {
    this.beaconSearchService = beaconSearchService;
  }

  @TransactionalEventListener
  public void whenUserClaimsLegacyBeaconThenUpdateSearch(
    LegacyBeaconClaimed event
  ) {
    beaconSearchService.index(event.getLegacyBeaconId());
  }
}
