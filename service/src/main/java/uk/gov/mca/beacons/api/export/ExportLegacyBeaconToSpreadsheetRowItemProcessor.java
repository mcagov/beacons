package uk.gov.mca.beacons.api.export;

import org.jetbrains.annotations.NotNull;
import org.springframework.batch.item.ItemProcessor;
import org.springframework.stereotype.Component;
import uk.gov.mca.beacons.api.legacybeacon.domain.LegacyBeacon;

@Component
public class ExportLegacyBeaconToSpreadsheetRowItemProcessor
  implements ItemProcessor<LegacyBeacon, SpreadsheetRow> {

  @Override
  public SpreadsheetRow process(@NotNull LegacyBeacon legacyBeacon) {
    return new SpreadsheetRow(legacyBeacon);
  }
}
