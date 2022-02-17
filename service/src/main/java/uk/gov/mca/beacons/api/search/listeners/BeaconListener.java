package uk.gov.mca.beacons.api.search.listeners;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionalEventListener;
import uk.gov.mca.beacons.api.beacon.domain.events.BeaconCreated;
import uk.gov.mca.beacons.api.search.BeaconSearchService;

@Component
public class BeaconListener {

  BeaconSearchService beaconSearchService;

  @Autowired
  public BeaconListener(BeaconSearchService beaconSearchService) {
    this.beaconSearchService = beaconSearchService;
  }

  @TransactionalEventListener
  public void whenCustomerRegistersBeacon(BeaconCreated event) {
    beaconSearchService.index(event.getBeaconId());
  }
}
