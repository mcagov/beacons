package uk.gov.mca.beacons.api.export;

import java.io.IOException;
import net.javacrumbs.shedlock.spring.annotation.SchedulerLock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import uk.gov.mca.beacons.api.export.xlsx.XlsxExporter;

@Component
public class ExportScheduler {

  private final XlsxExporter xlsxExporter;

  @Autowired
  public ExportScheduler(XlsxExporter xlsxExporter) {
    this.xlsxExporter = xlsxExporter;
  }

  @Scheduled(cron = "0 0 1 * * ?") // Nightly at 1am
  @SchedulerLock(
    name = "xlsxExport_scheduledTask",
    lockAtLeastFor = "15m", // 15 minutes
    lockAtMostFor = "30m" // 30 minutes
  )
  public void createNewXlsxExport() throws IOException {
    xlsxExporter.export();
  }
}
