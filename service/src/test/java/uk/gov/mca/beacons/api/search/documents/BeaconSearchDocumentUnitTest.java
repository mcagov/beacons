package uk.gov.mca.beacons.api.search.documents;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.contains;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.BDDMockito.given;

import java.util.Collections;
import java.util.List;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import uk.gov.mca.beacons.api.BeaconMocker;
import uk.gov.mca.beacons.api.accountholder.domain.AccountHolder;
import uk.gov.mca.beacons.api.beacon.domain.Beacon;
import uk.gov.mca.beacons.api.beaconowner.domain.BeaconOwner;
import uk.gov.mca.beacons.api.beaconuse.domain.BeaconUse;

public class BeaconSearchDocumentUnitTest {

  @Test
  public void whenThereAreNoBeaconUses_thenTheMmsiFieldIsEmpty() {
    AccountHolder accountHolder = BeaconMocker.getAccountHolder();
    Beacon beacon = BeaconMocker.getBeacon(accountHolder.getId());
    BeaconOwner beaconOwner = BeaconMocker.getBeaconOwner(beacon.getId());

    BeaconSearchDocument doc = new BeaconSearchDocument(
      beacon,
      beaconOwner,
      Collections.emptyList()
    );

    assert (doc.getVesselMmsiNumbers()).isEmpty();
  }

  @Test
  public void whenThereIsABeaconUseWithoutAnMmsiNumber_thenTheMmsiFieldIsEmpty() {
    AccountHolder accountHolder = BeaconMocker.getAccountHolder();
    Beacon beacon = BeaconMocker.getBeacon(accountHolder.getId());
    BeaconOwner beaconOwner = BeaconMocker.getBeaconOwner(beacon.getId());
    BeaconUse useWithoutMmsiNumber = BeaconMocker.getMaritimeUse(
      beacon.getId()
    );
    useWithoutMmsiNumber.setFixedVhfRadioValue("");
    useWithoutMmsiNumber.setPortableVhfRadioValue("");
    List<BeaconUse> uses = List.of(useWithoutMmsiNumber);

    BeaconSearchDocument doc = new BeaconSearchDocument(
      beacon,
      beaconOwner,
      uses
    );

    assert (doc.getVesselMmsiNumbers()).isEmpty();
  }

  @Test
  public void whenThereIsABeaconUseWithAnMmsiNumber_thenTheMmsiFieldContainsThatNumber() {
    AccountHolder accountHolder = BeaconMocker.getAccountHolder();
    Beacon beacon = BeaconMocker.getBeacon(accountHolder.getId());
    BeaconOwner beaconOwner = BeaconMocker.getBeaconOwner(beacon.getId());
    BeaconUse useWithOneMmsiNumber = BeaconMocker.getMaritimeUse(
      beacon.getId()
    );
    String mmsiNumber = "123 456789";
    given(useWithOneMmsiNumber.getMmsiNumbers()).willReturn(
      List.of(mmsiNumber)
    );
    List<BeaconUse> uses = List.of(useWithOneMmsiNumber);

    BeaconSearchDocument doc = new BeaconSearchDocument(
      beacon,
      beaconOwner,
      uses
    );

    assert (doc.getVesselMmsiNumbers().get(0)).equals(mmsiNumber);
  }

  @Nested
  class PrimarySearchFields {

    @Test
    public void givenABeaconWithAssociatedMaritimeBeaconUse_BeaconSearchDocumentShouldContainMmsiNumbersVesselNameRadioCallsign() {
      AccountHolder accountHolder = BeaconMocker.getAccountHolder();
      Beacon beacon = BeaconMocker.getBeacon(accountHolder.getId());
      BeaconOwner beaconOwner = BeaconMocker.getBeaconOwner(beacon.getId());
      BeaconUse maritimeUse = BeaconMocker.getMaritimeUse(beacon.getId());
      String mmsiNumber = "123 456789";
      given(maritimeUse.getMmsiNumbers()).willReturn(List.of(mmsiNumber));

      BeaconSearchDocument doc = new BeaconSearchDocument(
        beacon,
        beaconOwner,
        List.of(maritimeUse)
      );

      assertThat(doc.getVesselMmsiNumbers(), contains(mmsiNumber));
      assertThat(doc.getVesselNames(), contains(maritimeUse.getVesselName()));
      assertThat(doc.getVesselCallsigns(), contains(maritimeUse.getCallSign()));
    }
  }
}
