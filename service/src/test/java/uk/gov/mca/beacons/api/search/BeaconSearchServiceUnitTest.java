package uk.gov.mca.beacons.api.search;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.*;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.*;

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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import uk.gov.mca.beacons.api.beacon.domain.Beacon;
import uk.gov.mca.beacons.api.beacon.domain.BeaconId;
import uk.gov.mca.beacons.api.beacon.domain.BeaconRepository;
import uk.gov.mca.beacons.api.beacon.domain.BeaconStatus;
import uk.gov.mca.beacons.api.beaconowner.domain.BeaconOwner;
import uk.gov.mca.beacons.api.beaconowner.domain.BeaconOwnerRepository;
import uk.gov.mca.beacons.api.beaconuse.domain.BeaconUse;
import uk.gov.mca.beacons.api.beaconuse.domain.BeaconUseRepository;
import uk.gov.mca.beacons.api.legacybeacon.domain.*;
import uk.gov.mca.beacons.api.search.beacons.repositories.BeaconSearchSpecificationRepository;
import uk.gov.mca.beacons.api.search.documents.BeaconSearchDocument;
import uk.gov.mca.beacons.api.search.domain.BeaconSearchEntity;
import uk.gov.mca.beacons.api.search.repositories.BeaconSearchRepository;

@ExtendWith(MockitoExtension.class)
public class BeaconSearchServiceUnitTest {

  @InjectMocks
  BeaconSearchService beaconSearchService;

  @Mock
  BeaconSearchRepository beaconSearchRepository;

  @Mock
  BeaconSearchSpecificationRepository beaconSearchSpecificationRepository;

  @Mock
  BeaconRepository beaconRepository;

  @Mock
  BeaconOwnerRepository beaconOwnerRepository;

  @Mock
  BeaconUseRepository beaconUseRepository;

  @Mock
  LegacyBeaconRepository legacyBeaconRepository;

  @Test
  public void givenABeaconId_thenSaveACorrespondingBeaconSearchDocument() {
    ArgumentCaptor<BeaconSearchDocument> argumentCaptor =
      ArgumentCaptor.forClass(BeaconSearchDocument.class);
    Beacon mockBeacon = createMockBeacon(BeaconStatus.NEW);
    given(beaconRepository.findById(any(BeaconId.class))).willReturn(
      Optional.of(mockBeacon)
    );
    BeaconOwner mockBeaconOwner = createMockBeaconOwner();

    given(beaconOwnerRepository.getByBeaconId(any(BeaconId.class))).willReturn(
      List.of(mockBeaconOwner)
    );

    BeaconUse mockBeaconUse = createMockBeaconUse();

    given(
      beaconUseRepository.getBeaconUseByBeaconId(any(BeaconId.class))
    ).willReturn(List.of(mockBeaconUse));
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
    ArgumentCaptor<BeaconSearchDocument> argumentCaptor =
      ArgumentCaptor.forClass(BeaconSearchDocument.class);
    Beacon mockBeacon = createMockBeacon(BeaconStatus.DELETED);
    given(beaconRepository.findById(any(BeaconId.class))).willReturn(
      Optional.of(mockBeacon)
    );
    given(beaconOwnerRepository.getByBeaconId(any(BeaconId.class))).willReturn(
      List.of()
    );
    given(
      beaconUseRepository.getBeaconUseByBeaconId(any(BeaconId.class))
    ).willReturn(List.of());
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
    assertThrows(IllegalArgumentException.class, () ->
      beaconSearchService.index(new BeaconId(UUID.randomUUID()))
    );
  }

  @Test
  public void givenALegacyBeaconId_thenSaveACorrespondingBeaconSearchDocument() {
    ArgumentCaptor<BeaconSearchDocument> argumentCaptor =
      ArgumentCaptor.forClass(BeaconSearchDocument.class);
    LegacyBeacon mockLegacyBeacon = createMockLegacyBeacon();
    given(
      legacyBeaconRepository.findById(any(LegacyBeaconId.class))
    ).willReturn(Optional.of(mockLegacyBeacon));

    beaconSearchService.index(mockLegacyBeacon.getId());

    verify(beaconSearchRepository, times(1)).save(argumentCaptor.capture());

    BeaconSearchDocument beaconSearchDocument = argumentCaptor.getValue();
    assertThat(
      beaconSearchDocument.getHexId(),
      equalTo(mockLegacyBeacon.getHexId())
    );
    assertThat(
      beaconSearchDocument.getBeaconStatus(),
      equalTo(mockLegacyBeacon.getBeaconStatus())
    );
  }

  @Test
  public void givenALegacyBeaconId_whenTheLegacyBeaconIdIsNotFound_thenThrowException() {
    assertThrows(IllegalArgumentException.class, () ->
      beaconSearchService.index(new LegacyBeaconId(UUID.randomUUID()))
    );
  }

  @Test
  public void givenFindAllBeacons_WithValidFilters_ThenShouldCallRepositoryWithSpecificationAndPageable() {
    String status = "status";
    String uses = "uses";
    String hexID = "hexID";
    String ownerName = "ownerName";
    String cospasSarsatNumber = "cospasSarsatNumber";
    String manufacturerSerialNumber = "manufacturerSerialNumber";

    Pageable pageable = PageRequest.of(0, 20);

    List<BeaconSearchEntity> beacons = List.of(new BeaconSearchEntity());
    Page<BeaconSearchEntity> expectedPage = new PageImpl<>(
      beacons,
      pageable,
      1
    );

    when(
      beaconSearchSpecificationRepository.findAll(
        any(Specification.class),
        eq(pageable)
      )
    ).thenReturn(expectedPage);

    Page<BeaconSearchEntity> result = beaconSearchService.findAllBeacons(
      status,
      uses,
      hexID,
      ownerName,
      cospasSarsatNumber,
      manufacturerSerialNumber,
      pageable
    );

    assertThat(result, equalTo(expectedPage));
    assertThat(result.getContent(), hasSize(1));
    verify(beaconSearchSpecificationRepository, times(1)).findAll(
      any(Specification.class),
      eq(pageable)
    );
  }

  @Test
  public void givenFindAllBeacons_WithInvalidFilters_ThenShouldReturnEmptyPageable() {
    String status = "status";
    String uses = "uses";
    String hexID = "hexID";
    String ownerName = "ownerName";
    String cospasSarsatNumber = "cospasSarsatNumber";
    String manufacturerSerialNumber = "manufacturerSerialNumber";

    Pageable pageable = PageRequest.of(0, 20);

    Page<BeaconSearchEntity> expectedPage = Page.empty(pageable);

    when(
      beaconSearchSpecificationRepository.findAll(
        any(Specification.class),
        eq(pageable)
      )
    ).thenReturn(expectedPage);

    Page<BeaconSearchEntity> result = beaconSearchService.findAllBeacons(
      status,
      uses,
      hexID,
      ownerName,
      cospasSarsatNumber,
      manufacturerSerialNumber,
      pageable
    );

    assertThat(result, equalTo(expectedPage));
    assertThat(result.getContent(), empty());
    assertThat(result.getSize(), equalTo(20));
    assertThat(result.getTotalPages(), equalTo(0));
    assertThat(result.getNumber(), equalTo(0));
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
    given(beaconOwner.isMain()).willReturn(true);

    return beaconOwner;
  }

  private BeaconUse createMockBeaconUse() {
    BeaconUse beaconUse = mock(BeaconUse.class);
    given(beaconUse.getVesselName()).willReturn("Ever Given");

    return beaconUse;
  }

  private LegacyBeacon createMockLegacyBeacon() {
    LegacyUse legacyUse = mock(LegacyUse.class);
    LegacyOwner legacyOwner = mock(LegacyOwner.class);
    LegacyBeaconDetails legacyBeaconDetails = mock(LegacyBeaconDetails.class);
    LegacyData legacyData = mock(LegacyData.class);
    LegacyBeacon legacyBeacon = mock(LegacyBeacon.class);

    given(legacyData.getBeacon()).willReturn(legacyBeaconDetails);
    given(legacyData.getUses()).willReturn(List.of(legacyUse));
    given(legacyData.getOwner()).willReturn(legacyOwner);
    given(legacyBeacon.getId()).willReturn(
      new LegacyBeaconId(UUID.randomUUID())
    );
    given(legacyBeacon.getData()).willReturn(legacyData);
    given(legacyBeacon.getHexId()).willReturn("1D0EA08C52FFBFF");
    given(legacyBeacon.getBeaconStatus()).willReturn("CLAIMED");

    return legacyBeacon;
  }
}
