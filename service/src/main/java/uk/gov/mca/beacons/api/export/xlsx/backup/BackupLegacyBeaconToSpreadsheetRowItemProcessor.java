package uk.gov.mca.beacons.api.export.xlsx.backup;

import org.jetbrains.annotations.NotNull;
import org.springframework.batch.item.ItemProcessor;
import org.springframework.stereotype.Component;
import uk.gov.mca.beacons.api.legacybeacon.domain.LegacyBeacon;

@Component
class BackupLegacyBeaconToSpreadsheetRowItemProcessor
  implements ItemProcessor<LegacyBeacon, BackupSpreadsheetRow> {

  @Override
  public BackupSpreadsheetRow process(@NotNull LegacyBeacon legacyBeacon) {
    return new BackupSpreadsheetRow(legacyBeacon);
  }
}
