package uk.gov.mca.beacons.api.export;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.nullValue;

import java.util.List;
import org.junit.jupiter.api.Test;
import uk.gov.mca.beacons.api.BeaconMocker;
import uk.gov.mca.beacons.api.export.xlsx.ExportSpreadsheetRow;

class ExportSpreadsheetRowUnitTest {

  @Test
  public void whenTheBeaconOwnerIsNull_thenTheBeaconOwnerNameFieldIsAlsoNull() {
    ExportSpreadsheetRow spreadsheetRow = new ExportSpreadsheetRow(
      BeaconMocker.getBeacon(),
      null,
      List.of(),
      List.of()
    );

    assertThat(spreadsheetRow.getOwnerName(), nullValue());
  }
}
