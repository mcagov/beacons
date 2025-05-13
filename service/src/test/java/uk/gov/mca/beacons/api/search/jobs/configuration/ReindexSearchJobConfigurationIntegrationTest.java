package uk.gov.mca.beacons.api.search.jobs.configuration;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.is;

import java.util.ArrayList;
import java.util.List;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.batch.core.ExitStatus;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.JobExecution;
import org.springframework.batch.core.JobParameters;
import org.springframework.batch.test.JobLauncherTestUtils;
import org.springframework.batch.test.JobRepositoryTestUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import uk.gov.mca.beacons.api.WebIntegrationTest;
import uk.gov.mca.beacons.api.search.documents.BeaconSearchDocument;
import uk.gov.mca.beacons.api.search.repositories.BeaconElasticSearchRepository;

public class ReindexSearchJobConfigurationIntegrationTest
  extends WebIntegrationTest {

  @Autowired
  @Qualifier("searchJobLauncherTestUtils")
  private JobLauncherTestUtils jobLauncherTestUtils;

  @Autowired
  private JobRepositoryTestUtils jobRepositoryTestUtils;

  @Autowired
  BeaconElasticSearchRepository beaconElasticSearchRepository;

  @Autowired
  @Qualifier("reindexSearchJob")
  Job job;

  @AfterEach
  public void cleanUp() {
    jobRepositoryTestUtils.removeJobExecutions();
  }

  @Test
  void whenJobIsTriggered_ShouldWriteBeaconRecordsFromDBToOpensearch()
    throws Exception {
    // given
    String accountHolderId_1 = seedAccountHolder();
    String accountHolderId_2 = seedAccountHolder();
    seedRegistration(RegistrationUseCase.SINGLE_BEACON, accountHolderId_1);
    seedRegistration(RegistrationUseCase.SINGLE_BEACON, accountHolderId_2);

    // when
    JobExecution jobExecution = jobLauncherTestUtils.launchJob(
      new JobParameters()
    );
    ExitStatus exitStatus = jobExecution.getExitStatus();
    List<BeaconSearchDocument> beaconSearchDocuments = new ArrayList<>();
    beaconElasticSearchRepository
      .findAll()
      .iterator()
      .forEachRemaining(beaconSearchDocuments::add);

    // then
    assertThat(exitStatus.getExitCode(), is("COMPLETED"));
    assertThat(beaconSearchDocuments.size(), is(2));
  }
}
