package uk.gov.mca.beacons.api.export.csv;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import org.springframework.batch.core.StepContribution;
import org.springframework.batch.core.scope.context.ChunkContext;
import org.springframework.batch.core.step.tasklet.Tasklet;
import org.springframework.batch.repeat.RepeatStatus;
import org.springframework.lang.NonNull;

public class RenameFileTasklet implements Tasklet {

  private final Path tmpFilePath;

  public RenameFileTasklet(Path tmpFilePath) {
    this.tmpFilePath = tmpFilePath;
  }

  @Override
  public RepeatStatus execute(
    @NonNull StepContribution contribution,
    ChunkContext chunkContext
  ) throws IOException {
    Path outputFilePath = Paths.get(
      (String) chunkContext
        .getStepContext()
        .getJobParameters()
        .get("destination")
    );
    Files.move(tmpFilePath, outputFilePath);

    return RepeatStatus.FINISHED;
  }
}
