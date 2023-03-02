package uk.gov.mca.beacons.api.duplicates;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.FormatStyle;
import java.util.List;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import uk.gov.mca.beacons.api.beacon.application.BeaconService;
import uk.gov.mca.beacons.api.legacybeacon.LegacyBeaconTestUtils;
import uk.gov.mca.beacons.api.legacybeacon.application.LegacyBeaconService;
import uk.gov.mca.beacons.api.legacybeacon.domain.*;
import uk.gov.mca.beacons.api.utils.BeaconsStringUtils;

public class DuplicatesServiceUnitTest {

  @Mock
  LegacyBeaconService legacyBeaconService = mock(LegacyBeaconService.class);

  @Mock
  BeaconService beaconService = mock(BeaconService.class);

  @Test
  void getDuplicateSummaries_shouldReturnAllDuplicateSummaries() {}
}
