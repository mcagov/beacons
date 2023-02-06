package uk.gov.mca.beacons.api.export;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;
import org.junit.Assert;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import uk.gov.mca.beacons.api.export.xlsx.BeaconsDataWorkbookRepository;
import uk.gov.mca.beacons.api.export.xlsx.backup.BackupSpreadsheetRow;
import uk.gov.mca.beacons.api.export.xlsx.backup.BackupXlsxItemWriter;

class BackupXlsxItemWriterUnitTest {

  @Mock
  private BeaconsDataWorkbookRepository mockBeaconsDataWorkbookRepository;

  private BackupXlsxItemWriter backupXlsxItemWriter = new BackupXlsxItemWriter(
    mockBeaconsDataWorkbookRepository
  );

  @Test
  public void orderBeaconRowsByLastModifiedDateDescending_shouldOrderAllBeaconRows() {
    String todaysDate = OffsetDateTime.now().toString();

    BackupSpreadsheetRow newMaritimeBeaconRow = BackupSpreadsheetRow.createEmptyRow(
      UUID.randomUUID()
    );
    newMaritimeBeaconRow.setBeaconStatus("NEW");
    newMaritimeBeaconRow.setBeaconType("Modern");
    newMaritimeBeaconRow.setLastModifiedDate(
      OffsetDateTime.now().minusDays(1).toString()
    );

    BackupSpreadsheetRow deletedLegacyLandBeaconRow = BackupSpreadsheetRow.createEmptyRow(
      UUID.randomUUID()
    );
    deletedLegacyLandBeaconRow.setBeaconStatus("DELETED");
    deletedLegacyLandBeaconRow.setBeaconType("Legacy");
    deletedLegacyLandBeaconRow.setLastModifiedDate(todaysDate);

    BackupSpreadsheetRow claimedLegacyLandBeacon = BackupSpreadsheetRow.createEmptyRow(
      UUID.randomUUID()
    );
    claimedLegacyLandBeacon.setBeaconStatus("CLAIMED");
    claimedLegacyLandBeacon.setBeaconType("Legacy");
    claimedLegacyLandBeacon.setLastModifiedDate(
      OffsetDateTime.now().minusDays(7).toString()
    );

    List<BackupSpreadsheetRow> beaconRows = List.of(
      newMaritimeBeaconRow,
      deletedLegacyLandBeaconRow,
      claimedLegacyLandBeacon
    );

    List<BackupSpreadsheetRow> orderedBeaconRows = backupXlsxItemWriter.orderBeaconRowsByLastModifiedDateDescending(
      beaconRows
    );

    Assert.assertEquals(
      todaysDate,
      orderedBeaconRows.get(0).getLastModifiedDate()
    );
  }
}
