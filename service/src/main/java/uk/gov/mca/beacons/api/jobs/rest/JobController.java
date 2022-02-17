package uk.gov.mca.beacons.api.jobs.rest;

import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.batch.core.launch.JobExecutionNotRunningException;
import org.springframework.batch.core.launch.NoSuchJobExecutionException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import uk.gov.mca.beacons.api.exceptions.ResourceNotFoundException;
import uk.gov.mca.beacons.api.jobs.JobService;

@RestController
@RequestMapping("/spring-api/job")
@Tag(name = "Job Controller")
public class JobController {

  private final JobService jobService;

  public JobController(JobService jobService) {
    this.jobService = jobService;
  }

  @PostMapping("/reindexSearch")
  public ResponseEntity<JobAcceptanceDTO> reindexSearch() throws Exception {
    Long jobExecutionId = jobService.startReindexSearchJob();
    JobAcceptanceDTO jobAcceptanceDTO = JobAcceptanceDTO
      .builder()
      .location("/spring-api/job/reindexSearch/" + jobExecutionId)
      .build();

    return ResponseEntity.accepted().body(jobAcceptanceDTO);
  }

  @GetMapping("reindexSearch/{id}")
  public ResponseEntity<JobOutputDTO> getReindexSearchOutput(
    @PathVariable("id") Long jobExecutionId
  ) {
    JobOutputDTO jobOutputDTO = JobOutputDTO
      .builder()
      .status(jobService.getJobStatus(jobExecutionId))
      .build();
    return ResponseEntity.ok().body(jobOutputDTO);
  }

  @DeleteMapping("{id}")
  public ResponseEntity<Void> cancelJob(
    @PathVariable("id") Long jobExecutionId
  ) throws NoSuchJobExecutionException, JobExecutionNotRunningException {
    try {
      jobService.cancel(jobExecutionId);
    } catch (NoSuchJobExecutionException e) {
      throw new ResourceNotFoundException();
    } catch (JobExecutionNotRunningException e) {
      // The job has been found but is not deletable; no further information is to be supplied.
      // See https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/DELETE
      return ResponseEntity.noContent().build();
    }

    return ResponseEntity.accepted().build();
  }
}
