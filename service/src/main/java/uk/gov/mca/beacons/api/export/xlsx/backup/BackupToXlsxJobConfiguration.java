package uk.gov.mca.beacons.api.export.xlsx.backup;

import javax.persistence.EntityManagerFactory;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.JobExecutionListener;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.configuration.annotation.EnableBatchProcessing;
import org.springframework.batch.core.configuration.annotation.JobBuilderFactory;
import org.springframework.batch.core.configuration.annotation.StepBuilderFactory;
import org.springframework.batch.item.ItemProcessor;
import org.springframework.batch.item.ItemReader;
import org.springframework.batch.item.ItemWriter;
import org.springframework.batch.item.database.JpaPagingItemReader;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import uk.gov.mca.beacons.api.beacon.application.BeaconItemReaderFactory;
import uk.gov.mca.beacons.api.beacon.domain.Beacon;
import uk.gov.mca.beacons.api.export.ExportSpreadsheetRow;
import uk.gov.mca.beacons.api.export.xlsx.BeaconsDataWorkbookRepository;
import uk.gov.mca.beacons.api.export.xlsx.XlsxItemWriter;
import uk.gov.mca.beacons.api.legacybeacon.application.LegacyBeaconItemReaderFactory;
import uk.gov.mca.beacons.api.legacybeacon.domain.LegacyBeacon;

@Configuration
@EnableBatchProcessing
public class BackupToXlsxJobConfiguration {

  private final EntityManagerFactory entityManagerFactory;
  private final StepBuilderFactory stepBuilderFactory;
  private final JobBuilderFactory jobBuilderFactory;
  private static final int CHUNK_SIZE = 256;

  @Autowired
  public BackupToXlsxJobConfiguration(
    EntityManagerFactory entityManagerFactory,
    StepBuilderFactory stepBuilderFactory,
    JobBuilderFactory jobBuilderFactory
  ) {
    this.entityManagerFactory = entityManagerFactory;
    this.stepBuilderFactory = stepBuilderFactory;
    this.jobBuilderFactory = jobBuilderFactory;
  }

  @Bean("backupXlsxBeaconItemReader")
  public JpaPagingItemReader<Beacon> exportXlsxBeaconItemReader() {
    return BeaconItemReaderFactory.getItemReader(entityManagerFactory);
  }

  @Bean("backupXlsxLegacyBeaconItemReader")
  public JpaPagingItemReader<LegacyBeacon> exportXlsxLegacyBeaconItemReader() {
    return LegacyBeaconItemReaderFactory.getItemReader(entityManagerFactory);
  }

  @Bean
  public Step backupBeaconToXlsxStep(
    ItemReader<Beacon> exportXlsxBeaconItemReader,
    ItemProcessor<Beacon, ExportSpreadsheetRow> exportXlsxBeaconToSpreadsheetRowItemProcessor,
    ItemWriter<ExportSpreadsheetRow> xlsxItemWriter
  ) {
    return stepBuilderFactory
      .get("backupBeaconToXlsxStep")
      .<Beacon, ExportSpreadsheetRow>chunk(CHUNK_SIZE)
      .reader(exportXlsxBeaconItemReader)
      .processor(exportXlsxBeaconToSpreadsheetRowItemProcessor)
      .writer(xlsxItemWriter)
      .build();
  }

  @Bean
  public Step backupLegacyBeaconToXlsxStep(
    ItemReader<LegacyBeacon> exportXlsxLegacyBeaconItemReader,
    ItemProcessor<LegacyBeacon, ExportSpreadsheetRow> exportXlsxLegacyBeaconToSpreadsheetRowItemProcessor,
    ItemWriter<ExportSpreadsheetRow> xlsxItemWriter
  ) {
    return stepBuilderFactory
      .get("backupLegacyBeaconToXlsxStep")
      .<LegacyBeacon, ExportSpreadsheetRow>chunk(CHUNK_SIZE)
      .reader(exportXlsxLegacyBeaconItemReader)
      .processor(exportXlsxLegacyBeaconToSpreadsheetRowItemProcessor)
      .writer(xlsxItemWriter)
      .build();
  }

  // retrieve old spreadsheetrow
  // come back here and make it implement the interface
  @Bean
  public ItemWriter<BackupSpreadsheetRow> xlsxItemWriter(
    BeaconsDataWorkbookRepository beaconsDataWorkbookRepository
  ) {
    return new XlsxItemWriter(beaconsDataWorkbookRepository);
  }

  @Bean("backupToXlsxJobListener")
  ExportToXlsxJobListener jobListener(
    BeaconsDataWorkbookRepository beaconsDataWorkbookRepository
  ) {
    return new ExportToXlsxJobListener(beaconsDataWorkbookRepository);
  }

  @Bean(value = "backupToXlsxJob")
  public Job backupToXlsxJob(
    Step backupBeaconToXlsxStep,
    Step backupLegacyBeaconToXlsxStep,
    @Qualifier(
      "jobExecutionLoggingListener"
    ) JobExecutionListener jobExecutionLoggingListener,
    @Qualifier(
      "backupToXlsxJobListener"
    ) JobExecutionListener jobExecutionListener
  ) {
    return jobBuilderFactory
      .get("backupToXlsxJob")
      .listener(jobExecutionLoggingListener)
      .listener(jobExecutionListener)
      .start(backupBeaconToXlsxStep)
      .next(backupLegacyBeaconToXlsxStep)
      .build();
  }
}
