package uk.gov.mca.beacons.api.jobs.listener;

import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.core.JobExecution;
import org.springframework.batch.core.JobExecutionListener;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class JobExecutionLoggingListener implements JobExecutionListener {

  @Override
  public void beforeJob(JobExecution jobExecution) {
    log.info(
      String.format("Starting job execution with id %s", jobExecution.getId())
    );
  }

  @Override
  public void afterJob(JobExecution jobExecution) {
    var duration =
      jobExecution.getEndTime().toInstant().getEpochSecond() -
      jobExecution.getStartTime().toInstant().getEpochSecond();
    log.info(
      String.format(
        "Finished job execution with id %s, duration was %ss",
        jobExecution.getId(),
        duration
      )
    );
  }
}
