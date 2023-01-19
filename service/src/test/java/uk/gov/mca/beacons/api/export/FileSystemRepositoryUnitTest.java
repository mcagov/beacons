package uk.gov.mca.beacons.api.export;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.startsWith;
import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.when;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.attribute.FileAttribute;
import java.text.SimpleDateFormat;
import java.time.Clock;
import java.time.Instant;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mca.beacons.api.export.xlsx.BeaconsDataWorkbookRepository;

@ExtendWith(MockitoExtension.class)
class FileSystemRepositoryUnitTest {

  @Mock
  Clock clock;

  @InjectMocks
  ExportFileNamer exportFileNamer;

  @Test
  public void prefixWithTodaysDateInYyyyMMddFormat() {
    when(clock.instant()).thenReturn(Instant.EPOCH);
    String yyyyMMdd = new SimpleDateFormat("yyyyMMdd")
      .format(Date.from(Instant.EPOCH));

    String filename = exportFileNamer.constructTodaysExportFilename(
      ExportFileNamer.FileType.EXCEL_SPREADSHEET,
      BeaconsDataWorkbookRepository.OperationType.EXPORT
    );

    assertThat(filename, startsWith(yyyyMMdd));
  }
}
