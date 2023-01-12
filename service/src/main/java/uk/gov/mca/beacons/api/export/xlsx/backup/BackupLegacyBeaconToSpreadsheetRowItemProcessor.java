package uk.gov.mca.beacons.api.export.xlsx.backup;

import java.time.format.DateTimeFormatter;
import org.jetbrains.annotations.NotNull;
import org.springframework.batch.item.ItemProcessor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import uk.gov.mca.beacons.api.export.mappers.ExportMapper;
import uk.gov.mca.beacons.api.legacybeacon.domain.LegacyBeacon;

@Component
class BackupLegacyBeaconToSpreadsheetRowItemProcessor
  implements ItemProcessor<LegacyBeacon, BackupSpreadsheetRow> {

  private final ExportMapper exportMapper;

  private static final DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern(
    "dd-MM-yyyy"
  );

  @Autowired
  public BackupLegacyBeaconToSpreadsheetRowItemProcessor(
    ExportMapper exportMapper
  ) {
    this.exportMapper = exportMapper;
  }

  @Override
  public BackupSpreadsheetRow process(@NotNull LegacyBeacon legacyBeacon) {
    return new BackupSpreadsheetRow(legacyBeacon, exportMapper, dateFormatter);
  }
}
