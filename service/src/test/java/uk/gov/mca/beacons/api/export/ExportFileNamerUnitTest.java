package uk.gov.mca.beacons.api.export;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.nullValue;
import static org.hamcrest.Matchers.startsWith;
import static org.mockito.Mockito.when;

import java.nio.file.Path;
import java.text.SimpleDateFormat;
import java.time.Clock;
import java.time.Instant;
import java.util.Date;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mca.beacons.api.export.xlsx.BeaconsDataWorkbookRepository;

@ExtendWith(MockitoExtension.class)
class ExportFileNamerUnitTest {

  @Mock
  Clock clock;

  @InjectMocks
  ExportFileNamer fileNamer;

  @Test
  public void prefixWithTodaysDateInYyyyMMddFormat() {
    when(clock.instant()).thenReturn(Instant.EPOCH);
    String yyyyMMdd = new SimpleDateFormat("yyyyMMdd")
      .format(Date.from(Instant.EPOCH));

    String filename = fileNamer.constructTodaysExportFilename(
      ExportFileNamer.FileType.EXCEL_SPREADSHEET,
      BeaconsDataWorkbookRepository.OperationType.EXPORT
    );

    assertThat(filename, startsWith(yyyyMMdd));
  }

  @Nested
  class parseDate {

    @Test
    public void givenAFilenameThatDoesNotStartWithADate_thenReturnNull() {
      Path nonDatePrefixedFilename = Path.of("/var/tmp/beacons_data.xlsx");

      Date shouldBeNull = fileNamer.parseDate(nonDatePrefixedFilename);

      assertThat(shouldBeNull, nullValue());
    }
  }
}
