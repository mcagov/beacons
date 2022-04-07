package uk.gov.mca.beacons.api;

import org.springframework.batch.core.Job;
import org.springframework.batch.test.JobLauncherTestUtils;
import org.springframework.batch.test.JobRepositoryTestUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;

@Configuration
public class SpringBatchTestConfiguration {

  @Bean(value = "searchJobLauncherTestUtils")
  public static JobLauncherTestUtils searchJobLauncherTestUtils() {
    return new JobLauncherTestUtils() {
      @Override
      @Autowired
      @Qualifier("reindexSearchJob")
      public void setJob(@NonNull Job job) {
        super.setJob(job);
      }
    };
  }

  @Bean(value = "excelJobLauncherTestUtils")
  public static JobLauncherTestUtils excelJobLauncherTestUtils() {
    return new JobLauncherTestUtils() {
      @Override
      @Autowired
      @Qualifier("exportToXlsxJob")
      public void setJob(@NonNull Job job) {
        super.setJob(job);
      }
    };
  }

  @Bean
  public static JobRepositoryTestUtils jobRepositoryTestUtils() {
    return new JobRepositoryTestUtils();
  }
}
