package uk.gov.mca.beacons.api.export.csv;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;
import javax.persistence.EntityManagerFactory;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.configuration.annotation.EnableBatchProcessing;
import org.springframework.batch.core.configuration.annotation.JobBuilderFactory;
import org.springframework.batch.core.configuration.annotation.StepBuilderFactory;
import org.springframework.batch.core.configuration.annotation.StepScope;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.batch.core.step.tasklet.Tasklet;
import org.springframework.batch.item.ItemProcessor;
import org.springframework.batch.item.ItemReader;
import org.springframework.batch.item.ItemWriter;
import org.springframework.batch.item.database.JpaPagingItemReader;
import org.springframework.batch.item.file.FlatFileItemWriter;
import org.springframework.batch.item.file.builder.FlatFileItemWriterBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.FileSystemResource;
import uk.gov.mca.beacons.api.beacon.application.BeaconItemReaderFactory;
import uk.gov.mca.beacons.api.beacon.domain.Beacon;
import uk.gov.mca.beacons.api.export.SpreadsheetRow;
import uk.gov.mca.beacons.api.jobs.listener.JobExecutionLoggingListener;
import uk.gov.mca.beacons.api.legacybeacon.application.LegacyBeaconItemReaderFactory;
import uk.gov.mca.beacons.api.legacybeacon.domain.LegacyBeacon;

@Configuration
@EnableBatchProcessing
public class ExportToCsvJobConfiguration {

  private static final int chunkSize = 256;
  private final JobBuilderFactory jobBuilderFactory;
  private final StepBuilderFactory stepBuilderFactory;
  private final EntityManagerFactory entityManagerFactory;
  private final JobExecutionLoggingListener jobExecutionLoggingListener;
  private final Path temporaryExportFile;

  @Autowired
  public ExportToCsvJobConfiguration(
    JobBuilderFactory jobBuilderFactory,
    StepBuilderFactory stepBuilderFactory,
    EntityManagerFactory entityManagerFactory,
    JobExecutionLoggingListener jobExecutionLoggingListener,
    @Value("${export.directory}/temporary.csv") String temporaryExportFile
  ) {
    this.jobBuilderFactory = jobBuilderFactory;
    this.stepBuilderFactory = stepBuilderFactory;
    this.entityManagerFactory = entityManagerFactory;
    this.jobExecutionLoggingListener = jobExecutionLoggingListener;
    this.temporaryExportFile = Paths.get(temporaryExportFile);
  }

  @Bean("exportBeaconItemReader")
  public JpaPagingItemReader<Beacon> exportBeaconItemReader() {
    return BeaconItemReaderFactory.getItemReader(entityManagerFactory);
  }

  @Bean("exportLegacyBeaconItemReader")
  public JpaPagingItemReader<LegacyBeacon> exportLegacyBeaconItemReader() {
    return LegacyBeaconItemReaderFactory.getItemReader(entityManagerFactory);
  }

  @Bean
  public Step exportBeaconToCsvStep(
    ItemReader<Beacon> exportBeaconItemReader,
    ItemProcessor<Beacon, SpreadsheetRow> exportBeaconToSpreadsheetRowItemProcessor,
    ItemWriter<SpreadsheetRow> csvItemWriter
  ) {
    return stepBuilderFactory
      .get("exportBeaconToExcelStep")
      .<Beacon, SpreadsheetRow>chunk(chunkSize)
      .reader(exportBeaconItemReader)
      .processor(exportBeaconToSpreadsheetRowItemProcessor)
      .writer(csvItemWriter)
      .build();
  }

  @Bean
  public Step exportLegacyBeaconToCsvStep(
    ItemReader<LegacyBeacon> exportLegacyBeaconItemReader,
    ItemProcessor<LegacyBeacon, SpreadsheetRow> exportLegacyBeaconToSpreadsheetItemProcessor,
    ItemWriter<SpreadsheetRow> csvItemWriter
  ) {
    return stepBuilderFactory
      .get("exportLegacyBeaconToExcelStep")
      .<LegacyBeacon, SpreadsheetRow>chunk(chunkSize)
      .reader(exportLegacyBeaconItemReader)
      .processor(exportLegacyBeaconToSpreadsheetItemProcessor)
      .writer(csvItemWriter)
      .build();
  }

  @Bean
  public Step deleteTempFileStep() {
    Tasklet deleteTempFileTasklet = new DeleteTempFileTasklet(
      temporaryExportFile
    );
    return stepBuilderFactory
      .get("deleteTempFileStep")
      .tasklet(deleteTempFileTasklet)
      .build();
  }

  @Bean
  public Step renameFileStep() {
    Tasklet renameFileTasklet = new RenameFileTasklet(temporaryExportFile);
    return stepBuilderFactory
      .get("renameFileStep")
      .tasklet(renameFileTasklet)
      .build();
  }

  @Bean("csvItemWriter")
  @StepScope
  public FlatFileItemWriter<SpreadsheetRow> csvItemWriter(
    @Value("#{jobParameters}") Map<String, String> jobParameters
  ) {
    return new FlatFileItemWriterBuilder<SpreadsheetRow>()
      .name("spreadsheetRowWriter")
      .resource(new FileSystemResource(temporaryExportFile))
      .delimited()
      .delimiter(",")
      .names(SpreadsheetRow.getColumnAttributes().toArray(new String[0]))
      .headerCallback(
        headerWriter -> {
          for (String columnHeading : SpreadsheetRow.getColumnHeadings()) {
            headerWriter.write(columnHeading + ", ");
          }
        }
      )
      .append(true)
      .build();
  }

  @Bean(value = "exportToCsvJob")
  public Job exportToCsvJob(
    Step deleteTempFileStep,
    Step exportBeaconToCsvStep,
    Step exportLegacyBeaconToCsvStep,
    Step renameFileStep
  ) {
    return jobBuilderFactory
      .get("exportToCsvJob")
      .listener(jobExecutionLoggingListener)
      .start(deleteTempFileStep)
      .next(exportBeaconToCsvStep)
      .next(exportLegacyBeaconToCsvStep)
      .next(renameFileStep)
      .build();
  }
}
