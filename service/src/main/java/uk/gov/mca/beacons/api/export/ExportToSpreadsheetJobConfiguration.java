package uk.gov.mca.beacons.api.export;

import java.util.Map;
import javax.persistence.EntityManagerFactory;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.configuration.annotation.EnableBatchProcessing;
import org.springframework.batch.core.configuration.annotation.JobBuilderFactory;
import org.springframework.batch.core.configuration.annotation.StepBuilderFactory;
import org.springframework.batch.core.configuration.annotation.StepScope;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.batch.item.ItemProcessor;
import org.springframework.batch.item.ItemReader;
import org.springframework.batch.item.ItemWriter;
import org.springframework.batch.item.file.FlatFileItemWriter;
import org.springframework.batch.item.file.builder.FlatFileItemWriterBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.FileSystemResource;
import uk.gov.mca.beacons.api.beacon.domain.Beacon;
import uk.gov.mca.beacons.api.jobs.listener.JobExecutionLoggingListener;
import uk.gov.mca.beacons.api.legacybeacon.domain.LegacyBeacon;

@Configuration
@EnableBatchProcessing
public class ExportToSpreadsheetJobConfiguration {
    private static final int chunkSize = 256;
    private final JobBuilderFactory jobBuilderFactory;
    private final StepBuilderFactory stepBuilderFactory;
    private final JobExecutionLoggingListener jobExecutionLoggingListener;

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
        this.jobExecutionLoggingListener = jobExecutionLoggingListener;
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
    @StepScope
    public FlatFileItemWriter<SpreadsheetRow> writer(@Value("#{jobParameters}") Map<String, String> jobParameters) {
        return new FlatFileItemWriterBuilder<SpreadsheetRow>()
                .name("spreadsheetRowWriter")
                .resource(new FileSystemResource(jobParameters.get("destination")))
                .delimited()
                .delimiter(",")
                .names(SpreadsheetRow.getColumnAttributes().toArray(new String[0]))
                .headerCallback(headerWriter -> {
                    for (String columnHeading : SpreadsheetRow.getColumnHeadings()) {
                        headerWriter.write(columnHeading + ", ");
                    }
                })
                .append(true)
                .build();
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
