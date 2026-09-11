package uk.gov.mca.beacons.api.beaconuse.application;

import java.util.List;
import java.util.stream.IntStream;
import uk.gov.mca.beacons.api.beaconuse.domain.BeaconUse;

public class BeaconUseHelper {

  public static void applySingleMainUse(List<BeaconUse> beaconUses) {
    if (beaconUses.isEmpty()) {
      return;
    }

    int mainUseIndex = IntStream.range(0, beaconUses.size())
      .filter(index -> Boolean.TRUE.equals(beaconUses.get(index).getMainUse()))
      .findFirst()
      .orElse(0);

    IntStream.range(0, beaconUses.size()).forEach(index ->
      beaconUses.get(index).setMainUse(index == mainUseIndex)
    );
  }
}
