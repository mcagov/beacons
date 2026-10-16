package uk.gov.mca.beacons.api.beaconuse.application;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.contains;
import static org.mockito.BDDMockito.given;

import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mca.beacons.api.beacon.domain.BeaconId;
import uk.gov.mca.beacons.api.beaconuse.domain.BeaconUse;
import uk.gov.mca.beacons.api.beaconuse.domain.BeaconUseRepository;

@ExtendWith(MockitoExtension.class)
public class BeaconUseServiceUnitTest {

  @InjectMocks
  BeaconUseService beaconUseService;

  @Mock
  BeaconUseRepository beaconUseRepository;

  @Test
  public void givenUsesWhereTheMainUseIsNotFirst_whenGettingByBeaconId_thenTheMainUseIsReturnedFirstAndTheRestKeepTheirOrder() {
    BeaconId beaconId = new BeaconId(UUID.randomUUID());
    BeaconUse skiing = createUse(false);
    BeaconUse motor = createUse(false);
    BeaconUse lightAircraft = createUse(true);
    BeaconUse walking = createUse(false);
    given(beaconUseRepository.getBeaconUseByBeaconId(beaconId)).willReturn(
      List.of(skiing, motor, lightAircraft, walking)
    );

    List<BeaconUse> uses = beaconUseService.getByBeaconId(beaconId);

    assertThat(uses, contains(lightAircraft, skiing, motor, walking));
  }

  private BeaconUse createUse(boolean mainUse) {
    BeaconUse use = new BeaconUse();
    use.setMainUse(mainUse);
    return use;
  }
}
