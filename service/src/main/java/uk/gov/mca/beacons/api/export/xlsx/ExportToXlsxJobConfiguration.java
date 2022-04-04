package uk.gov.mca.beacons.api.export.xlsx;

import javax.persistence.EntityManagerFactory;
import org.apache.poi.xssf.streaming.SXSSFSheet;
import org.apache.poi.xssf.streaming.SXSSFWorkbook;
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
import uk.gov.mca.beacons.api.export.SpreadsheetRow;
import uk.gov.mca.beacons.api.jobs.listener.JobExecutionLoggingListener;
import uk.gov.mca.beacons.api.legacybeacon.application.LegacyBeaconItemReaderFactory;
import uk.gov.mca.beacons.api.legacybeacon.domain.LegacyBeacon;

@Configuration
@EnableBatchProcessing
public class ExportToXlsxJobConfiguration {

  private final EntityManagerFactory entityManagerFactory;
  private final StepBuilderFactory stepBuilderFactory;
  private final JobBuilderFactory jobBuilderFactory;
  private final JobExecutionLoggingListener jobExecutionLoggingListener;
  private static final int chunkSize = 256;

  @Autowired
  public ExportToXlsxJobConfiguration(
    EntityManagerFactory entityManagerFactory,
    StepBuilderFactory stepBuilderFactory,
    JobBuilderFactory jobBuilderFactory,
    JobExecutionLoggingListener jobExecutionLoggingListener
  ) {
    this.entityManagerFactory = entityManagerFactory;
    this.stepBuilderFactory = stepBuilderFactory;
    this.jobBuilderFactory = jobBuilderFactory;
    this.jobExecutionLoggingListener = jobExecutionLoggingListener;
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
    ItemProcessor<Beacon, SpreadsheetRow> exportXlsxBeaconToSpreadsheetRowItemProcessor,
    ItemWriter<SpreadsheetRow> xlsxItemWriter
  ) {
    return stepBuilderFactory
      .get("exportBeaconToXlsxStep")
      .<Beacon, SpreadsheetRow>chunk(chunkSize)
      .reader(exportXlsxBeaconItemReader)
      .processor(exportXlsxBeaconToSpreadsheetRowItemProcessor)
      .writer(xlsxItemWriter)
      .build();
  }

  @Bean
  public Step exportLegacyBeaconToXlsxStep(
    ItemReader<LegacyBeacon> exportXlsxLegacyBeaconItemReader,
    ItemProcessor<LegacyBeacon, SpreadsheetRow> exportXlsxLegacyBeaconToSpreadsheetRowItemProcessor,
    ItemWriter<SpreadsheetRow> xlsxItemWriter
  ) {
    return stepBuilderFactory
      .get("exportLegacyBeaconToXlsxStep")
      .<LegacyBeacon, SpreadsheetRow>chunk(chunkSize)
      .reader(exportXlsxLegacyBeaconItemReader)
      .processor(exportXlsxLegacyBeaconToSpreadsheetRowItemProcessor)
      .writer(xlsxItemWriter)
      .build();
  }

  @Bean
  public SXSSFWorkbook workbook() {
    return new SXSSFWorkbook(chunkSize);
  }

  @Bean
  public ItemWriter<SpreadsheetRow> xlsxItemWriter(SXSSFWorkbook workbook) {
    SXSSFSheet sheet = workbook.createSheet("Beacons data");
    return new XlsxItemWriter(sheet);
  }

  @Bean("exportToXlsxJobListener")
  ExportToXlsxJobListener jobListener(SXSSFWorkbook workbook) {
    return new ExportToXlsxJobListener(workbook);
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
