package uk.gov.mca.beacons.api.export;

import java.nio.file.Path;
import java.util.Date;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class ExportResult {

  private final Path path;
  private final Date completed;
}
