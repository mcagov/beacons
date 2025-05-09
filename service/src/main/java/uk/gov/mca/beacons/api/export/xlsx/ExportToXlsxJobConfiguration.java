package uk.gov.mca.beacons.api.export.xlsx;

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
import uk.gov.mca.beacons.api.legacybeacon.application.LegacyBeaconItemReaderFactory;
import uk.gov.mca.beacons.api.legacybeacon.domain.LegacyBeacon;

@Configuration
@EnableBatchProcessing
public class ExportToXlsxJobConfiguration {

  private final EntityManagerFactory entityManagerFactory;
  private final StepBuilderFactory stepBuilderFactory;
  private final JobBuilderFactory jobBuilderFactory;
  private static final int CHUNK_SIZE = 256;

  @Autowired
  public ExportToXlsxJobConfiguration(
    EntityManagerFactory entityManagerFactory,
    StepBuilderFactory stepBuilderFactory,
    JobBuilderFactory jobBuilderFactory
  ) {
    this.entityManagerFactory = entityManagerFactory;
    this.stepBuilderFactory = stepBuilderFactory;
    this.jobBuilderFactory = jobBuilderFactory;
  }

  @Bean("exportXlsxBeaconItemReader")
  public JpaPagingItemReader<Beacon> exportXlsxBeaconItemReader() {
    return BeaconItemReaderFactory.getItemReader(entityManagerFactory);
  }

  @Bean("exportXlsxLegacyBeaconItemReader")
  public JpaPagingItemReader<LegacyBeacon> exportXlsxLegacyBeaconItemReader() {
    return LegacyBeaconItemReaderFactory.getItemReader(entityManagerFactory);
  }

  @Bean
  public Step exportBeaconToXlsxStep(
    ItemReader<Beacon> exportXlsxBeaconItemReader,
    ItemProcessor<
      Beacon,
      ExportSpreadsheetRow
    > exportXlsxBeaconToSpreadsheetRowItemProcessor,
    ItemWriter<ExportSpreadsheetRow> xlsxItemWriter
  ) {
    return stepBuilderFactory
      .get("exportBeaconToXlsxStep")
      .<Beacon, ExportSpreadsheetRow>chunk(CHUNK_SIZE)
      .reader(exportXlsxBeaconItemReader)
      .processor(exportXlsxBeaconToSpreadsheetRowItemProcessor)
      .writer(xlsxItemWriter)
      .build();
  }

  @Bean
  public Step exportLegacyBeaconToXlsxStep(
    ItemReader<LegacyBeacon> exportXlsxLegacyBeaconItemReader,
    ItemProcessor<
      LegacyBeacon,
      ExportSpreadsheetRow
    > exportXlsxLegacyBeaconToSpreadsheetRowItemProcessor,
    ItemWriter<ExportSpreadsheetRow> xlsxItemWriter
  ) {
    return stepBuilderFactory
      .get("exportLegacyBeaconToXlsxStep")
      .<LegacyBeacon, ExportSpreadsheetRow>chunk(CHUNK_SIZE)
      .reader(exportXlsxLegacyBeaconItemReader)
      .processor(exportXlsxLegacyBeaconToSpreadsheetRowItemProcessor)
      .writer(xlsxItemWriter)
      .build();
  }

  @Bean
  public ItemWriter<ExportSpreadsheetRow> xlsxItemWriter(
    BeaconsDataWorkbookRepository beaconsDataWorkbookRepository
  ) {
    return new ExportXlsxItemWriter(beaconsDataWorkbookRepository);
  }

  @Bean("exportToXlsxJobListener")
  ExportToXlsxJobListener jobListener(
    BeaconsDataWorkbookRepository beaconsDataWorkbookRepository
  ) {
    return new ExportToXlsxJobListener(beaconsDataWorkbookRepository);
  }

  @Bean(value = "exportToXlsxJob")
  public Job exportToXlsxJob(
    Step exportBeaconToXlsxStep,
    Step exportLegacyBeaconToXlsxStep,
    @Qualifier(
      "jobExecutionLoggingListener"
    ) JobExecutionListener jobExecutionLoggingListener,
    @Qualifier(
      "exportToXlsxJobListener"
    ) JobExecutionListener jobExecutionListener
  ) {
    return jobBuilderFactory
      .get("exportToXlsxJob")
      .listener(jobExecutionLoggingListener)
      .listener(jobExecutionListener)
      .start(exportBeaconToXlsxStep)
      .next(exportLegacyBeaconToXlsxStep)
      .build();
  }
}
