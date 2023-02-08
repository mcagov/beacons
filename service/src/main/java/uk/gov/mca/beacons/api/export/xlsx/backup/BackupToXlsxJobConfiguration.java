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
import uk.gov.mca.beacons.api.export.xlsx.BeaconsDataWorkbookRepository;
import uk.gov.mca.beacons.api.export.xlsx.XlsxSpreadsheetSorter;
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

  @Bean("backupSpreadsheetBeaconItemReader")
  public JpaPagingItemReader<Beacon> backupSpreadsheetBeaconItemReader() {
    JpaPagingItemReader<Beacon> reader = BeaconItemReaderFactory.getBackupItemReader(
      entityManagerFactory
    );
    return reader;
  }

  @Bean("backupSpreadsheetLegacyBeaconItemReader")
  public JpaPagingItemReader<LegacyBeacon> backupSpreadsheetLegacyBeaconItemReader() {
    JpaPagingItemReader<LegacyBeacon> reader = LegacyBeaconItemReaderFactory.getLegacyBackupItemReader(
      entityManagerFactory
    );
    return reader;
  }

  @Bean("backupBeaconToSpreadsheetStep")
  public Step backupBeaconToSpreadsheetStep(
    ItemReader<Beacon> backupSpreadsheetBeaconItemReader,
    ItemProcessor<Beacon, BackupSpreadsheetRow> backupBeaconToSpreadsheetRowItemProcessor,
    ItemWriter<BackupSpreadsheetRow> xlsxItemWriter
  ) {
    return stepBuilderFactory
      .get("backupBeaconToSpreadsheetStep")
      .<Beacon, BackupSpreadsheetRow>chunk(CHUNK_SIZE)
      .reader(backupSpreadsheetBeaconItemReader)
      .processor(backupBeaconToSpreadsheetRowItemProcessor)
      .writer(xlsxItemWriter)
      .build();
  }

  @Bean
  public Step backupLegacyBeaconToSpreadsheetStep(
    ItemReader<LegacyBeacon> backupSpreadsheetLegacyBeaconItemReader,
    ItemProcessor<LegacyBeacon, BackupSpreadsheetRow> backupLegacyBeaconToSpreadsheetRowItemProcessor,
    ItemWriter<BackupSpreadsheetRow> xlsxItemWriter
  ) {
    return stepBuilderFactory
      .get("backupLegacyBeaconToSpreadsheetStep")
      .<LegacyBeacon, BackupSpreadsheetRow>chunk(CHUNK_SIZE)
      .reader(backupSpreadsheetLegacyBeaconItemReader)
      .processor(backupLegacyBeaconToSpreadsheetRowItemProcessor)
      .writer(xlsxItemWriter)
      .build();
  }

  @Bean
  public ItemWriter<BackupSpreadsheetRow> backupToXlsxItemWriter(
    BeaconsDataWorkbookRepository beaconsDataWorkbookRepository
  ) {
    return new BackupXlsxItemWriter(beaconsDataWorkbookRepository);
  }

  @Bean("backupToXlsxJobListener")
  BackupToXlsxJobListener backupToXlsxJobListener(
    BeaconsDataWorkbookRepository beaconsDataWorkbookRepository,
    XlsxSpreadsheetSorter spreadsheetSorter
  ) {
    return new BackupToXlsxJobListener(
      beaconsDataWorkbookRepository,
      spreadsheetSorter
    );
  }

  @Bean(value = "backupToSpreadsheetJob")
  public Job backupToSpreadsheetJob(
    Step backupBeaconToSpreadsheetStep,
    Step backupLegacyBeaconToSpreadsheetStep,
    @Qualifier(
      "jobExecutionLoggingListener"
    ) JobExecutionListener jobExecutionLoggingListener,
    @Qualifier(
      "backupToXlsxJobListener"
    ) JobExecutionListener jobExecutionListener
  ) {
    return jobBuilderFactory
      .get("backupToSpreadsheetJob")
      .listener(jobExecutionLoggingListener)
      .listener(jobExecutionListener)
      .start(backupBeaconToSpreadsheetStep)
      .next(backupLegacyBeaconToSpreadsheetStep)
      .build();
  }
}
