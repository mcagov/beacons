package uk.gov.mca.beacons.api.export;

import java.io.IOException;
import net.javacrumbs.shedlock.spring.annotation.SchedulerLock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import uk.gov.mca.beacons.api.export.xlsx.backup.BackupXlsxExporter;

@Component
public class BackupScheduler {

  private final BackupXlsxExporter backupXlsxExporter;

  @Autowired
  public BackupScheduler(BackupXlsxExporter backupXlsxExporter) {
    this.backupXlsxExporter = backupXlsxExporter;
  }

  @Scheduled(cron = "0 0 2 * * MON") // Every Monday at 2am
  @SchedulerLock(
    name = "xlsxBackup_scheduledTask",
    lockAtLeastFor = "15m", // 15 minutes
    lockAtMostFor = "30m" // 30 minutes
  )
  public void createNewXlsxBackup() throws IOException {
    backupXlsxExporter.backup();
  }
}
