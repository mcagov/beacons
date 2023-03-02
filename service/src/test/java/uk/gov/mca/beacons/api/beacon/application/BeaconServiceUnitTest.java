package uk.gov.mca.beacons.api.beacon.application;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.assertj.core.util.Hexadecimals;
import org.junit.Assert;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.springframework.data.auditing.AuditingHandler;
import uk.gov.mca.beacons.api.beacon.domain.Beacon;
import uk.gov.mca.beacons.api.beacon.domain.BeaconRepository;
import uk.gov.mca.beacons.api.mappers.ModelPatcherFactory;

public class BeaconServiceUnitTest {

  @Mock
  private final BeaconRepository mockBeaconRepository = mock(
    BeaconRepository.class
  );

  @Mock
  private final AuditingHandler mockAuditingHandler = mock(
    AuditingHandler.class
  );

  @Mock
  private final ModelPatcherFactory<Beacon> mockModelPatcherFactory = mock(
    ModelPatcherFactory.class
  );

  private final BeaconService beaconService = new BeaconService(
    mockAuditingHandler,
    mockBeaconRepository,
    mockModelPatcherFactory
  );

  @Test
  void findHexIdsWithDuplicates_shouldOnlyReturnHexIdsThatMatchMoreThanOneBeacon() {
    Beacon spicesBeacon = new Beacon();
    spicesBeacon.setManufacturer("Graci Noir");
    spicesBeacon.setHexId("1D5EBC98BC1DBAC");

    Beacon bujusBeacon = new Beacon();
    bujusBeacon.setManufacturer("Buju Banton");
    bujusBeacon.setHexId("1DB25EC384BD461");

    Beacon cuttysBeacon = new Beacon();
    cuttysBeacon.setManufacturer("Cutty Ranks");
    cuttysBeacon.setHexId("1D7D2E824C89A9F");

    Beacon cuttysOtherBeacon = new Beacon();
    cuttysOtherBeacon.setManufacturer("Cutty Ranksezz");
    cuttysOtherBeacon.setHexId("1D7D2E824C89A9F");

    List<Beacon> beaconsInBeaconRepository = List.of(
      spicesBeacon,
      bujusBeacon,
      cuttysBeacon,
      cuttysOtherBeacon
    );
    when(mockBeaconRepository.findAll()).thenReturn(beaconsInBeaconRepository);

    Map<String, Integer> hexIdsAndNumberOfBeacons = beaconService.findHexIdsWithDuplicates();
    List<String> hexIdsWithDuplicates = hexIdsAndNumberOfBeacons
      .keySet()
      .stream()
      .collect(Collectors.toList());

    Assert.assertEquals(1, hexIdsWithDuplicates.size());
    Assert.assertEquals("1D7D2E824C89A9F", hexIdsWithDuplicates.get(0));
  }

  @Test
  void findHexIdsWithDuplicates_whenThereAreNoHexIdsWithDuplicates_shouldReturnAnEmptyMap() {
    Beacon spicesBeacon = new Beacon();
    spicesBeacon.setManufacturer("Graci Noir");
    spicesBeacon.setHexId("1D5EBC98BC1DBAC");

    Beacon bujusBeacon = new Beacon();
    bujusBeacon.setManufacturer("Buju Banton");
    bujusBeacon.setHexId("1DB25EC384BD461");

    Beacon cuttysBeacon = new Beacon();
    cuttysBeacon.setManufacturer("Cutty Ranks");
    cuttysBeacon.setHexId("1D7D2E824C89A9F");

    List<Beacon> beaconsInBeaconRepository = List.of(
      spicesBeacon,
      bujusBeacon,
      cuttysBeacon
    );
    when(mockBeaconRepository.findAll()).thenReturn(beaconsInBeaconRepository);

    Map<String, Integer> hexIdsAndNumberOfBeacons = beaconService.findHexIdsWithDuplicates();
    List<String> hexIdsWithDuplicates = hexIdsAndNumberOfBeacons
      .keySet()
      .stream()
      .collect(Collectors.toList());

    Assert.assertEquals(0, hexIdsWithDuplicates.size());
  }

  @Test
  void findHexIdsWithDuplicates_whenTheNumberOfBeaconsInTheDbExeeds150000_shouldOnlyReturnHexIdsThatMatchMoreThanOneBeacon() {
    List<Beacon> largeNumberOfBeacons = new ArrayList<>();

    for (int i = 0; i < 150000; i++) {
      Beacon beacon = new Beacon();
      beacon.setHexId(String.valueOf(i));

      largeNumberOfBeacons.add(beacon);
    }

    Beacon spicesBeacon = new Beacon();
    spicesBeacon.setManufacturer("Graci Noir");
    spicesBeacon.setHexId("1D5EBC98BC1DBAC");

    Beacon spicesOtherBeacon = new Beacon();
    spicesOtherBeacon.setManufacturer("Graci Noir");
    spicesOtherBeacon.setHexId("1D5EBC98BC1DBAC");

    Beacon bujusBeacon = new Beacon();
    bujusBeacon.setManufacturer("Buju Banton");
    bujusBeacon.setHexId("1DB25EC384BD461");

    Beacon bujusOtherBeacon = new Beacon();
    bujusOtherBeacon.setManufacturer("Buju Banton");
    bujusOtherBeacon.setHexId("1DB25EC384BD461");

    Beacon cuttysBeacon = new Beacon();
    cuttysBeacon.setManufacturer("Cutty Ranks");
    cuttysBeacon.setHexId("1D7D2E824C89A9F");

    Beacon cuttysOtherBeacon = new Beacon();
    cuttysOtherBeacon.setManufacturer("Cutty Ranksezz");
    cuttysOtherBeacon.setHexId("1D7D2E824C89A9F");

    largeNumberOfBeacons.add(spicesBeacon);
    largeNumberOfBeacons.add(spicesOtherBeacon);
    largeNumberOfBeacons.add(bujusBeacon);
    largeNumberOfBeacons.add(bujusOtherBeacon);
    largeNumberOfBeacons.add(cuttysBeacon);
    largeNumberOfBeacons.add(cuttysOtherBeacon);

    when(mockBeaconRepository.findAll()).thenReturn(largeNumberOfBeacons);

    Map<String, Integer> hexIdsAndNumberOfBeacons = beaconService.findHexIdsWithDuplicates();
    List<String> hexIdsWithDuplicates = hexIdsAndNumberOfBeacons
      .keySet()
      .stream()
      .collect(Collectors.toList());

    Assert.assertEquals(3, hexIdsWithDuplicates.size());
  }
}
