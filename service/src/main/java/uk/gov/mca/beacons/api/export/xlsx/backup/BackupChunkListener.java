package uk.gov.mca.beacons.api.export.xlsx.backup;

import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.core.ChunkListener;
import org.springframework.batch.core.scope.context.ChunkContext;

@Slf4j
public class BackupChunkListener implements ChunkListener {

  @Override
  public void beforeChunk(ChunkContext chunkContext) {}

  @Override
  public void afterChunk(ChunkContext context) {
    int count = context.getStepContext().getStepExecution().getReadCount();
    log.info("Number of records processed: " + count);
  }

  @Override
  public void afterChunkError(ChunkContext chunkContext) {}
}
