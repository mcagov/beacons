package uk.gov.mca.beacons.api.beaconuse.domain;

import org.junit.jupiter.api.Test;

public class BeaconUseUnitTest {

  @Test
  public void whenThereAreNoMmsiNumbers_thenTheListIsEmpty() {
    BeaconUse use = new BeaconUse();

    assert (use.getMmsiNumbers()).isEmpty();
  }
}
