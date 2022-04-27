package uk.gov.mca.beacons.api.search.jobs;

import net.javacrumbs.shedlock.spring.annotation.SchedulerLock;
import org.springframework.batch.core.JobParametersInvalidException;
import org.springframework.batch.core.repository.JobExecutionAlreadyRunningException;
import org.springframework.batch.core.repository.JobInstanceAlreadyCompleteException;
import org.springframework.batch.core.repository.JobRestartException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class ReindexSearchScheduler {

  private final JobService jobService;

  @Autowired
  ReindexSearchScheduler(JobService jobService) {
    this.jobService = jobService;
  }

  @Scheduled(cron = "0 0 2 * * ?") // Nightly at 2am
  @SchedulerLock(
    name = "reindexSearchJob_scheduledTask",
    lockAtLeastFor = "15m", // 15 minutes
    lockAtMostFor = "30m" // 30 minutes
  )
  public void runReindexSearchJob()
    throws JobInstanceAlreadyCompleteException, JobExecutionAlreadyRunningException, JobParametersInvalidException, JobRestartException {
    jobService.startReindexSearchJob();
  }
}
