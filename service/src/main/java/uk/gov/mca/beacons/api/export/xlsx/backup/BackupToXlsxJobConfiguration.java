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
    ItemReader<Beacon> backupXlsxBeaconItemReader,
    ItemProcessor<Beacon, BackupSpreadsheetRow> backupBeaconToSpreadsheetRowItemProcessor,
    ItemWriter<BackupSpreadsheetRow> xlsxItemWriter
  ) {
    return stepBuilderFactory
      .get("backupBeaconToXlsxStep")
      .<Beacon, BackupSpreadsheetRow>chunk(CHUNK_SIZE)
      .reader(backupXlsxBeaconItemReader)
      .processor(backupBeaconToSpreadsheetRowItemProcessor)
      .writer(xlsxItemWriter)
      .build();
  }

  @Bean
  public Step backupLegacyBeaconToXlsxStep(
    ItemReader<LegacyBeacon> backupLegacyBeaconItemReader,
    ItemProcessor<LegacyBeacon, BackupSpreadsheetRow> backupLegacyBeaconToSpreadsheetRowItemProcessor,
    ItemWriter<BackupSpreadsheetRow> xlsxItemWriter
  ) {
    return stepBuilderFactory
      .get("backupLegacyBeaconToXlsxStep")
      .<LegacyBeacon, BackupSpreadsheetRow>chunk(CHUNK_SIZE)
      .reader(backupLegacyBeaconItemReader)
      .processor(backupLegacyBeaconToSpreadsheetRowItemProcessor)
      .writer(xlsxItemWriter)
      .build();
  }

  @Bean
  public ItemWriter<BackupSpreadsheetRow> xlsxItemWriter(
    BeaconsDataWorkbookRepository beaconsDataWorkbookRepository
  ) {
    return new BackupXlsxItemWriter(beaconsDataWorkbookRepository);
  }

  @Bean("backupToXlsxJobListener")
  BackupToXlsxJobListener jobListener(
    BeaconsDataWorkbookRepository beaconsDataWorkbookRepository
  ) {
    return new BackupToXlsxJobListener(beaconsDataWorkbookRepository);
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
