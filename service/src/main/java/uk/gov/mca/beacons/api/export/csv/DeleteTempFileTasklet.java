package uk.gov.mca.beacons.api.export.csv;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import org.springframework.batch.core.StepContribution;
import org.springframework.batch.core.scope.context.ChunkContext;
import org.springframework.batch.core.step.tasklet.Tasklet;
import org.springframework.batch.repeat.RepeatStatus;
import org.springframework.lang.NonNull;

public class DeleteTempFileTasklet implements Tasklet {

  private final Path tmpFilePath;

  public DeleteTempFileTasklet(Path tmpFilePath) {
    this.tmpFilePath = tmpFilePath;
  }

  @Override
  public RepeatStatus execute(
    @NonNull StepContribution contribution,
    @NonNull ChunkContext chunkContext
  ) throws IOException {
    Files.deleteIfExists(tmpFilePath);
    return RepeatStatus.FINISHED;
  }
}
