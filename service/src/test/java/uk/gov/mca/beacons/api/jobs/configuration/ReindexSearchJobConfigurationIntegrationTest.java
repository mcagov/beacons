package uk.gov.mca.beacons.api.jobs.configuration;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.is;

import java.util.ArrayList;
import java.util.List;
import org.junit.Before;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.batch.core.ExitStatus;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.JobExecution;
import org.springframework.batch.core.JobParameters;
import org.springframework.batch.test.JobLauncherTestUtils;
import org.springframework.batch.test.JobRepositoryTestUtils;
import org.springframework.batch.test.context.SpringBatchTest;
import org.springframework.beans.factory.annotation.Autowired;
import uk.gov.mca.beacons.api.WebIntegrationTest;
import uk.gov.mca.beacons.api.search.documents.BeaconSearchDocument;
import uk.gov.mca.beacons.api.search.repositories.BeaconSearchRepository;

@SpringBatchTest
public class ReindexSearchJobConfigurationIntegrationTest
  extends WebIntegrationTest {

  @SuppressWarnings("SpringJavaInjectionPointsAutowiringInspection")
  @Autowired
  private JobLauncherTestUtils jobLauncherTestUtils;

  @SuppressWarnings("SpringJavaInjectionPointsAutowiringInspection")
  @Autowired
  private JobRepositoryTestUtils jobRepositoryTestUtils;

  @Autowired
  BeaconSearchRepository beaconSearchRepository;

  @Autowired
  Job job;

  @AfterEach
  public void cleanUp() {
    jobRepositoryTestUtils.removeJobExecutions();
  }

  @Before
  public void setUp() {
    jobLauncherTestUtils.setJob(job);
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
    beaconSearchRepository
      .findAll()
      .iterator()
      .forEachRemaining(beaconSearchDocuments::add);

    // then
    assertThat(exitStatus.getExitCode(), is("COMPLETED"));
    assertThat(beaconSearchDocuments.size(), is(2));
  }
}
