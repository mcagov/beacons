package uk.gov.mca.beacons.api.jobs.rest;

import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.batch.core.launch.NoSuchJobExecutionException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.test.web.servlet.MockMvc;
import uk.gov.mca.beacons.api.WebMvcTestConfiguration;
import uk.gov.mca.beacons.api.jobs.JobService;

@AutoConfigureMockMvc
@WebMvcTest(controllers = JobController.class)
@Import(WebMvcTestConfiguration.class)
public class JobControllerUnitTest {

  @Autowired
  private MockMvc mvc;

  @MockBean
  private JobService jobService;

  @Test
  void givenNoRunningJob_whenDeleteRequestIsReceived_thenReturnNotFound()
    throws Exception {
    long nonexistentJobId = 5L;
    given(jobService.cancel(nonexistentJobId))
      .willThrow(NoSuchJobExecutionException.class);

    mvc
      .perform(delete("/spring-api/job/" + nonexistentJobId))
      .andExpect(status().isNotFound());
  }

  @Test
  void givenARunningJob_whenDeleteRequestIsReceived_thenCancelJob()
    throws Exception {
    long jobId = 5L;
    given(jobService.cancel(jobId)).willReturn(true);

    mvc
      .perform(delete("/spring-api/job/" + jobId))
      .andExpect(status().isAccepted());

    verify(jobService, times(1)).cancel(jobId);
  }
}
