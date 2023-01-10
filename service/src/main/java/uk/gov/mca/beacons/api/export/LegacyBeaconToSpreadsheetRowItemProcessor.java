package uk.gov.mca.beacons.api.export;

import org.jetbrains.annotations.NotNull;
import org.springframework.batch.item.ItemProcessor;
import org.springframework.stereotype.Component;
import uk.gov.mca.beacons.api.export.xlsx.ExportSpreadsheetRow;
import uk.gov.mca.beacons.api.legacybeacon.domain.LegacyBeacon;

@Component
public class LegacyBeaconToSpreadsheetRowItemProcessor
  implements ItemProcessor<LegacyBeacon, ExportSpreadsheetRow> {

  @Override
  public ExportSpreadsheetRow process(@NotNull LegacyBeacon legacyBeacon) {
    return new ExportSpreadsheetRow(legacyBeacon);
  }
}
