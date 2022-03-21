package uk.gov.mca.beacons.api.export;

import javax.persistence.EntityManagerFactory;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.configuration.annotation.EnableBatchProcessing;
import org.springframework.batch.core.configuration.annotation.JobBuilderFactory;
import org.springframework.batch.core.configuration.annotation.StepBuilderFactory;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.batch.item.ItemProcessor;
import org.springframework.batch.item.ItemReader;
import org.springframework.batch.item.ItemWriter;
import org.springframework.batch.item.database.JpaPagingItemReader;
import org.springframework.batch.item.database.builder.JpaPagingItemReaderBuilder;
import org.springframework.batch.item.file.FlatFileItemWriter;
import org.springframework.batch.item.file.transform.BeanWrapperFieldExtractor;
import org.springframework.batch.item.file.transform.DelimitedLineAggregator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import uk.gov.mca.beacons.api.beacon.domain.Beacon;
import uk.gov.mca.beacons.api.jobs.listener.JobExecutionLoggingListener;
import uk.gov.mca.beacons.api.legacybeacon.domain.LegacyBeacon;

@Configuration
@EnableBatchProcessing
public class ExportToSpreadsheetJobConfiguration {
    private final JobBuilderFactory jobBuilderFactory;
    private final StepBuilderFactory stepBuilderFactory;
    private final EntityManagerFactory entityManagerFactory;
    private final JobRepository jobRepository;
    private final JobExecutionLoggingListener jobExecutionLoggingListener;
    private static final int chunkSize = 256;
    private Resource outputResource = new FileSystemResource("output/beacons_data.csv");
    private final String[] columnNames = new String[] {"ID", "Hex ID", "Owner name"};

    @Autowired
    public ExportToSpreadsheetJobConfiguration(
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

    // TODO Method duplicated from ReindexSearchJobConfiguration.  Abstract and reuse?
    @Bean("beaconItemReader")
    public JpaPagingItemReader<Beacon> beaconItemReader() {
        return new JpaPagingItemReaderBuilder<Beacon>()
                .name("beaconReader")
                .entityManagerFactory(entityManagerFactory)
                .queryString("select b from beacon b order by lastModifiedDate")
                .pageSize(chunkSize)
                .build();
    }

    // TODO Method duplicated from ReindexSearchJobConfiguration.  Abstract and reuse?
    @Bean("legacyBeaconItemReader")
    public JpaPagingItemReader<LegacyBeacon> legacyBeaconItemReader() {
        return new JpaPagingItemReaderBuilder<LegacyBeacon>()
                .name("legacyBeaconReader")
                .entityManagerFactory(entityManagerFactory)
                .queryString("select b from LegacyBeacon b order by lastModifiedDate")
                .pageSize(chunkSize)
                .build();
    }

    @Bean
    public Step exportBeaconToExcelStep(
            ItemReader<Beacon> beaconItemReader,
            ItemProcessor<Beacon, SpreadsheetRow> exportBeaconToSpreadsheetRowItemProcessor,
            ItemWriter<SpreadsheetRow> exportSpreadsheetRowItemWriter
    ) {
        return stepBuilderFactory
                .get("exportBeaconToExcelStep")
                .<Beacon, SpreadsheetRow>chunk(chunkSize)
                .reader(beaconItemReader)
                .processor(exportBeaconToSpreadsheetRowItemProcessor)
                .writer(exportSpreadsheetRowItemWriter)
                .build();
    }

    @Bean
    public Step exportLegacyBeaconToExcelStep(
            ItemReader<LegacyBeacon> legacyBeaconItemReader,
            ItemProcessor<LegacyBeacon, SpreadsheetRow> exportLegacyBeaconToSpreadsheetItemProcessor,
            ItemWriter<SpreadsheetRow> exportSpreadsheetRowItemWriter
            ) {
        return stepBuilderFactory
                .get("exportLegacyBeaconToExcelStep")
                .<LegacyBeacon, SpreadsheetRow>chunk(chunkSize)
                .reader(legacyBeaconItemReader)
                .processor(exportLegacyBeaconToSpreadsheetItemProcessor)
                .writer(exportSpreadsheetRowItemWriter)
                .build();
    }

    @Bean
    public FlatFileItemWriter<SpreadsheetRow> writer() {
        FlatFileItemWriter<SpreadsheetRow> writer = new FlatFileItemWriter<>();
        writer.setResource(outputResource);
        writer.setAppendAllowed(true);
        writer.setLineAggregator(new DelimitedLineAggregator<>() {
            {
                setDelimiter(",");
                setFieldExtractor(new BeanWrapperFieldExtractor<>() {
                    {
                        setNames(columnNames);
                    }
                });
            }
        });
        return writer;
    }

    @Bean(value = "exportToSpreadsheetJob")
    public Job exportToSpreadsheetJob(
            Step exportBeaconToExcelStep,
            Step exportLegacyBeaconToExcelStep
    ) {
        return jobBuilderFactory
                .get("exportToSpreadsheetJob")
                .listener(jobExecutionLoggingListener)
                .start(exportBeaconToExcelStep)
                .next(exportLegacyBeaconToExcelStep)
                .build();
    }
}
