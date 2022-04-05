package uk.gov.mca.beacons.api.export;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.nullValue;

import java.util.List;
import org.junit.jupiter.api.Test;
import uk.gov.mca.beacons.api.BeaconMocker;

class SpreadsheetRowUnitTest {

  @Test
  public void whenTheBeaconOwnerIsNull_thenTheBeaconOwnerNameFieldIsAlsoNull() {
    SpreadsheetRow spreadsheetRow = new SpreadsheetRow(
      BeaconMocker.getBeacon(),
      null,
      List.of(),
      List.of()
    );

    assertThat(spreadsheetRow.getOwnerName(), nullValue());
  }
}
