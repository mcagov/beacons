package uk.gov.mca.beacons.api.search;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.empty;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.nullValue;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mca.beacons.api.beacon.domain.Beacon;
import uk.gov.mca.beacons.api.beacon.domain.BeaconId;
import uk.gov.mca.beacons.api.beacon.domain.BeaconRepository;
import uk.gov.mca.beacons.api.beacon.domain.BeaconStatus;
import uk.gov.mca.beacons.api.beaconowner.domain.BeaconOwner;
import uk.gov.mca.beacons.api.beaconowner.domain.BeaconOwnerRepository;
import uk.gov.mca.beacons.api.beaconuse.domain.BeaconUse;
import uk.gov.mca.beacons.api.beaconuse.domain.BeaconUseRepository;
import uk.gov.mca.beacons.api.search.documents.BeaconSearchDocument;
import uk.gov.mca.beacons.api.search.repositories.BeaconSearchRepository;

@ExtendWith(MockitoExtension.class)
public class BeaconSearchServiceUnitTest {

  @InjectMocks
  BeaconSearchService beaconSearchService;

  @Mock
  BeaconSearchRepository beaconSearchRepository;

  @Mock
  BeaconRepository beaconRepository;

  @Mock
  BeaconOwnerRepository beaconOwnerRepository;

  @Mock
  BeaconUseRepository beaconUseRepository;

  @Test
  public void givenABeaconId_thenSaveACorrespondingBeaconSearchDocument() {
    ArgumentCaptor<BeaconSearchDocument> argumentCaptor = ArgumentCaptor.forClass(
      BeaconSearchDocument.class
    );
    Beacon mockBeacon = createMockBeacon(BeaconStatus.NEW);
    given(beaconRepository.findById(any(BeaconId.class)))
      .willReturn(Optional.of(mockBeacon));
    BeaconOwner mockBeaconOwner = createMockBeaconOwner();
    given(beaconOwnerRepository.findBeaconOwnerByBeaconId(any(BeaconId.class)))
      .willReturn(Optional.of(mockBeaconOwner));
    BeaconUse mockBeaconUse = createMockBeaconUse();
    given(beaconUseRepository.getBeaconUseByBeaconId(any(BeaconId.class)))
      .willReturn(List.of(mockBeaconUse));

    beaconSearchService.index(mockBeacon.getId());

    verify(beaconSearchRepository, times(1)).save(argumentCaptor.capture());
    BeaconSearchDocument beaconSearchDocument = argumentCaptor.getValue();
    assertThat(
      beaconSearchDocument.getId(),
      equalTo(Objects.requireNonNull(mockBeacon.getId()).unwrap())
    );
    assertThat(beaconSearchDocument.getHexId(), equalTo(mockBeacon.getHexId()));
    assertThat(
      beaconSearchDocument.getBeaconStatus(),
      equalTo(mockBeacon.getBeaconStatus().toString())
    );
    assertThat(
      beaconSearchDocument.getBeaconUses().get(0).getVesselName(),
      equalTo(mockBeaconUse.getVesselName())
    );
    assertThat(
      beaconSearchDocument.getBeaconOwner().getOwnerName(),
      equalTo(mockBeaconOwner.getFullName())
    );
  }

  @Test
  public void givenABeaconId_whenThatBeaconIdIsForADeletedBeacon_thenSaveACorrespondingBeaconSearchDocument() {
    ArgumentCaptor<BeaconSearchDocument> argumentCaptor = ArgumentCaptor.forClass(
      BeaconSearchDocument.class
    );
    Beacon mockBeacon = createMockBeacon(BeaconStatus.DELETED);
    given(beaconRepository.findById(any(BeaconId.class)))
      .willReturn(Optional.of(mockBeacon));
    given(beaconOwnerRepository.findBeaconOwnerByBeaconId(any(BeaconId.class)))
      .willReturn(Optional.empty());
    given(beaconUseRepository.getBeaconUseByBeaconId(any(BeaconId.class)))
      .willReturn(List.of());

    beaconSearchService.index(mockBeacon.getId());

    verify(beaconSearchRepository, times(1)).save(argumentCaptor.capture());
    BeaconSearchDocument beaconSearchDocument = argumentCaptor.getValue();
    assertThat(
      beaconSearchDocument.getId(),
      equalTo(Objects.requireNonNull(mockBeacon.getId()).unwrap())
    );
    assertThat(beaconSearchDocument.getHexId(), equalTo(mockBeacon.getHexId()));
    assertThat(
      beaconSearchDocument.getBeaconStatus(),
      equalTo(mockBeacon.getBeaconStatus().toString())
    );
    assertThat(beaconSearchDocument.getBeaconUses(), empty());
    assertThat(beaconSearchDocument.getBeaconOwner(), nullValue());
  }

  @Test
  public void givenABeaconId_whenTheBeaconIdIsNotFound_thenThrowException() {
    assertThrows(
      IllegalArgumentException.class,
      () -> beaconSearchService.index(new BeaconId(UUID.randomUUID()))
    );
  }

  private Beacon createMockBeacon(BeaconStatus status) {
    Beacon beacon = mock(Beacon.class);
    given(beacon.getId()).willReturn(new BeaconId(UUID.randomUUID()));
    given(beacon.getHexId()).willReturn("1D0EA08C52FFBFF");
    given(beacon.getBeaconStatus()).willReturn(status);

    return beacon;
  }

  private BeaconOwner createMockBeaconOwner() {
    BeaconOwner beaconOwner = mock(BeaconOwner.class);
    given(beaconOwner.getFullName()).willReturn("Steve Stevington");

    return beaconOwner;
  }

  private BeaconUse createMockBeaconUse() {
    BeaconUse beaconUse = mock(BeaconUse.class);
    given(beaconUse.getVesselName()).willReturn("Ever Given");

    return beaconUse;
  }
}
