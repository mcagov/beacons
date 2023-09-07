package uk.gov.mca.beacons.api.export.xlsx.backup;

import javax.persistence.EntityManagerFactory;
import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.core.ChunkListener;
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
import uk.gov.mca.beacons.api.export.xlsx.BeaconsDataWorkbookRepository;

@Configuration
@Slf4j
@EnableBatchProcessing
public class BackupToXlsxJobConfiguration {

  private final EntityManagerFactory entityManagerFactory;
  private final StepBuilderFactory stepBuilderFactory;
  private final JobBuilderFactory jobBuilderFactory;
  private static final int CHUNK_SIZE = 100;

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

  @Bean("beaconBackupItemReader")
  public JpaPagingItemReader<BeaconBackupItem> backupSpreadsheetBeaconItemReader() {
    JpaPagingItemReader<BeaconBackupItem> reader = BeaconBackupItemReaderFactory.getItemReader(
      entityManagerFactory
    );
    return reader;
  }

  @Bean("backupBeaconToSpreadsheetStep")
  public Step backupBeaconToSpreadsheetStep(
    ItemReader<BeaconBackupItem> beaconBackupItemReader,
    ItemProcessor<BeaconBackupItem, BackupSpreadsheetRow> backupBeaconToSpreadsheetRowItemProcessor,
    ChunkListener backupChunkListener,
    ItemWriter<BackupSpreadsheetRow> xlsxItemWriter
  ) {
    return stepBuilderFactory
      .get("backupBeaconToSpreadsheetStep")
      .<BeaconBackupItem, BackupSpreadsheetRow>chunk(CHUNK_SIZE)
      .reader(beaconBackupItemReader)
      .processor(backupBeaconToSpreadsheetRowItemProcessor)
      .writer(xlsxItemWriter)
      .listener(backupChunkListener)
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
    BeaconsDataWorkbookRepository beaconsDataWorkbookRepository
  ) {
    return new BackupToXlsxJobListener(beaconsDataWorkbookRepository);
  }

  @Bean("backupChunkListener")
  BackupChunkListener backupChunkListener() {
    return new BackupChunkListener();
  }

  @Bean(value = "backupToSpreadsheetJob")
  public Job backupToSpreadsheetJob(
    Step backupBeaconToSpreadsheetStep,
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
      .build();
  }
}
