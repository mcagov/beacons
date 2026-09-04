package uk.gov.mca.beacons.api.beaconuse.application;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.Collections;
import java.util.List;
import org.junit.jupiter.api.Test;
import uk.gov.mca.beacons.api.beaconuse.domain.BeaconUse;

public class BeaconUseHelperUnitTest {

  @Test
  public void whenSeveralUsesAreMain_thenOnlyTheFirstStaysMain() {
    List<BeaconUse> beaconUses = List.of(
      beaconUse(false),
      beaconUse(true),
      beaconUse(true)
    );

    BeaconUseHelper.applySingleMainUse(beaconUses);

    assertEquals(List.of(false, true, false), mainUseFlags(beaconUses));
  }

  @Test
  public void whenNoUseIsMain_thenTheFirstUseBecomesMain() {
    List<BeaconUse> beaconUses = List.of(beaconUse(false), beaconUse(false));

    BeaconUseHelper.applySingleMainUse(beaconUses);

    assertEquals(List.of(true, false), mainUseFlags(beaconUses));
  }

  @Test
  public void whenTheMainUseIsNotSet_thenTheFirstUseBecomesMain() {
    List<BeaconUse> beaconUses = List.of(beaconUse(null), beaconUse(null));

    BeaconUseHelper.applySingleMainUse(beaconUses);

    assertEquals(List.of(true, false), mainUseFlags(beaconUses));
  }

  @Test
  public void whenOneUseIsMain_thenItStaysMain() {
    List<BeaconUse> beaconUses = List.of(beaconUse(false), beaconUse(true));

    BeaconUseHelper.applySingleMainUse(beaconUses);

    assertEquals(List.of(false, true), mainUseFlags(beaconUses));
  }

  @Test
  public void whenThereAreNoUses_thenTheListIsUnchanged() {
    List<BeaconUse> beaconUses = Collections.emptyList();

    BeaconUseHelper.applySingleMainUse(beaconUses);

    assertEquals(Collections.emptyList(), beaconUses);
  }

  private BeaconUse beaconUse(Boolean mainUse) {
    BeaconUse beaconUse = new BeaconUse();
    beaconUse.setMainUse(mainUse);

    return beaconUse;
  }

  private List<Boolean> mainUseFlags(List<BeaconUse> beaconUses) {
    return beaconUses.stream().map(BeaconUse::getMainUse).toList();
  }
}
