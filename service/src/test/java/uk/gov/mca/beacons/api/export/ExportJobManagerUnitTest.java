package uk.gov.mca.beacons.api.export;

import static org.junit.jupiter.api.Assertions.assertThrows;

import java.nio.file.Path;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.batch.core.BatchStatus;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.JobExecution;
import org.springframework.batch.core.JobParametersInvalidException;
import org.springframework.batch.core.explore.JobExplorer;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.batch.core.repository.JobExecutionAlreadyRunningException;
import org.springframework.batch.core.repository.JobInstanceAlreadyCompleteException;
import org.springframework.batch.core.repository.JobRestartException;
import uk.gov.mca.beacons.api.export.csv.ExportToCsvFailedException;

@ExtendWith(MockitoExtension.class)
class ExportJobManagerUnitTest {

  @Mock
  JobExplorer jobExplorer;

  @Mock
  JobLauncher jobLauncher;

  @Mock
  Job exportToSpreadsheetJob;

  @InjectMocks
  ExportJobManager exportJobManager;

  @Test
  void whenAJobDoesNotComplete_thenLoudlyThrowAnException()
    throws JobInstanceAlreadyCompleteException, JobExecutionAlreadyRunningException, JobParametersInvalidException, JobRestartException {
    JobExecution failedJobExecution = Mockito.mock(JobExecution.class);
    Mockito.when(failedJobExecution.getStatus()).thenReturn(BatchStatus.FAILED);
    Mockito
      .when(jobLauncher.run(Mockito.any(), Mockito.any()))
      .thenReturn(failedJobExecution);

    assertThrows(
      ExportToCsvFailedException.class,
      () -> exportJobManager.exportToCsv(Path.of("/filename.csv"))
    );
  }
}
