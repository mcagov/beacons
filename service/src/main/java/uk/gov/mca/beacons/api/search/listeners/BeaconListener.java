package uk.gov.mca.beacons.api.search.listeners;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionalEventListener;
import uk.gov.mca.beacons.api.beacon.domain.events.BeaconCreated;
import uk.gov.mca.beacons.api.beacon.domain.events.BeaconDeleted;
import uk.gov.mca.beacons.api.beacon.domain.events.BeaconUpdated;
import uk.gov.mca.beacons.api.search.BeaconSearchService;

@Component
public class BeaconListener {

  BeaconSearchService beaconSearchService;

  @Autowired
  public BeaconListener(BeaconSearchService beaconSearchService) {
    this.beaconSearchService = beaconSearchService;
  }

  @TransactionalEventListener
  @CacheEvict(
    value = "find-all-beacons",
    allEntries = true,
    beforeInvocation = true
  )
  public void whenCustomerRegistersBeacon(BeaconCreated event) {
    beaconSearchService.index(event.getBeaconId());
  }

  @TransactionalEventListener
  @CacheEvict(
    value = "find-all-beacons",
    allEntries = true,
    beforeInvocation = true
  )
  public void whenCustomerUpdatesABeacon(BeaconUpdated event) {
    beaconSearchService.index(event.getBeaconId());
  }

  @TransactionalEventListener
  @CacheEvict(
    value = "find-all-beacons",
    allEntries = true,
    beforeInvocation = true
  )
  public void whenCustomerDeletesABeaconRegistration(BeaconDeleted event) {
    beaconSearchService.index(event.getBeaconId());
  }
}
