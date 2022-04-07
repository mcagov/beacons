package uk.gov.mca.beacons.api.search.jobs.configuration;

import javax.persistence.EntityManagerFactory;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.configuration.annotation.EnableBatchProcessing;
import org.springframework.batch.core.configuration.annotation.JobBuilderFactory;
import org.springframework.batch.core.configuration.annotation.StepBuilderFactory;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.batch.core.launch.support.SimpleJobLauncher;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.batch.item.ItemProcessor;
import org.springframework.batch.item.ItemReader;
import org.springframework.batch.item.ItemWriter;
import org.springframework.batch.item.database.JpaPagingItemReader;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.task.SimpleAsyncTaskExecutor;
import uk.gov.mca.beacons.api.beacon.application.BeaconItemReaderFactory;
import uk.gov.mca.beacons.api.beacon.domain.Beacon;
import uk.gov.mca.beacons.api.legacybeacon.application.LegacyBeaconItemReaderFactory;
import uk.gov.mca.beacons.api.legacybeacon.domain.LegacyBeacon;
import uk.gov.mca.beacons.api.search.documents.BeaconSearchDocument;
import uk.gov.mca.beacons.api.search.jobs.listener.JobExecutionLoggingListener;

@Configuration
@EnableBatchProcessing
public class ReindexSearchJobConfiguration {

  private final JobBuilderFactory jobBuilderFactory;
  private final StepBuilderFactory stepBuilderFactory;
  private final EntityManagerFactory entityManagerFactory;
  private final JobRepository jobRepository;
  private final JobExecutionLoggingListener jobExecutionLoggingListener;
  private static final int chunkSize = 256;

  @Autowired
  public ReindexSearchJobConfiguration(
    JobBuilderFactory jobBuilderFactory,
    StepBuilderFactory stepBuilderFactory,
    EntityManagerFactory entityManagerFactory,
    JobRepository jobRepository,
    JobExecutionLoggingListener jobExecutionLoggingListener
  ) {
    this.jobBuilderFactory = jobBuilderFactory;
    this.stepBuilderFactory = stepBuilderFactory;
    this.entityManagerFactory = entityManagerFactory;
    this.jobRepository = jobRepository;
    this.jobExecutionLoggingListener = jobExecutionLoggingListener;
  }

  @Bean("searchBeaconItemReader")
  public JpaPagingItemReader<Beacon> searchBeaconItemReader() {
    return BeaconItemReaderFactory.getItemReader(entityManagerFactory);
  }

  @Bean("searchLegacyBeaconItemReader")
  public JpaPagingItemReader<LegacyBeacon> searchLegacyBeaconItemReader() {
    return LegacyBeaconItemReaderFactory.getItemReader(entityManagerFactory);
  }

  @Bean
  public Step reindexSearchBeaconStep(
    ItemReader<Beacon> searchBeaconItemReader,
    ItemProcessor<Beacon, BeaconSearchDocument> beaconBatchJobProcessor,
    ItemWriter<BeaconSearchDocument> beaconSearchDocumentWriter
  ) {
    return stepBuilderFactory
      .get("reindexSearchBeaconStep")
      .<Beacon, BeaconSearchDocument>chunk(chunkSize)
      .reader(searchBeaconItemReader)
      .processor(beaconBatchJobProcessor)
      .writer(beaconSearchDocumentWriter)
      .build();
  }

  @Bean
  public Step reindexSearchLegacyBeaconStep(
    ItemReader<LegacyBeacon> searchLegacyBeaconItemReader,
    ItemProcessor<LegacyBeacon, BeaconSearchDocument> reindexSearchLegacyBeaconProcessor,
    ItemWriter<BeaconSearchDocument> beaconSearchDocumentItemWriter
  ) {
    return stepBuilderFactory
      .get("reindexSearchLegacyBeaconStep")
      .<LegacyBeacon, BeaconSearchDocument>chunk(chunkSize)
      .reader(searchLegacyBeaconItemReader)
      .processor(reindexSearchLegacyBeaconProcessor)
      .writer(beaconSearchDocumentItemWriter)
      .build();
  }

  @Bean(value = "reindexSearchJob")
  public Job reindexSearchJob(
    Step reindexSearchBeaconStep,
    Step reindexSearchLegacyBeaconStep
  ) {
    return jobBuilderFactory
      .get("reindexSearchJob")
      .listener(jobExecutionLoggingListener)
      .start(reindexSearchBeaconStep)
      .next(reindexSearchLegacyBeaconStep)
      .build();
  }

  @Bean(value = "simpleAsyncJobLauncher")
  public JobLauncher jobLauncher() throws Exception {
    SimpleJobLauncher jobLauncher = new SimpleJobLauncher();
    jobLauncher.setJobRepository(jobRepository);
    jobLauncher.setTaskExecutor(new SimpleAsyncTaskExecutor());
    jobLauncher.afterPropertiesSet();
    return jobLauncher;
  }
}
