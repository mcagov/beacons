package uk.gov.mca.beacons.api.export.xlsx.backup;

import java.io.IOException;
import net.javacrumbs.shedlock.spring.annotation.SchedulerLock;
import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

// do we need this or will the view be run afresh every time we generate a new backup
// via the existing cron job?
@Component
public class BeaconBackupViewScheduler {

  @Scheduled(cron = "0 0 1 * * MON") // Every Monday at 1am
  @SchedulerLock(
    name = "beaconBackupView_scheduledTask",
    lockAtLeastFor = "15m", // 15 minutes
    lockAtMostFor = "60m" // 60 minutes
  )
  public void refreshBeaconBackupView()
    throws IOException, InvalidFormatException {
    // re-run the view
  }
}
