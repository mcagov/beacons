package uk.gov.mca.beacons.api.beaconsearch;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.*;

import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import uk.gov.mca.beacons.api.beacon.domain.BeaconId;
import uk.gov.mca.beacons.api.beaconsearch.repositories.BeaconSearchSpecificationRepository;
import uk.gov.mca.beacons.api.beaconsearch.rest.BeaconSearchDTO;
import uk.gov.mca.beacons.api.beaconuse.application.BeaconUseService;
import uk.gov.mca.beacons.api.beaconuse.domain.BeaconUse;
import uk.gov.mca.beacons.api.search.domain.BeaconSearchEntity;

@ExtendWith(MockitoExtension.class)
public class BeaconSpecificationSearchServiceUnitTest {

  @InjectMocks
  BeaconSpecificationSearchService beaconSpecificationSearchService;

  @Mock
  BeaconSearchSpecificationRepository beaconSearchSpecificationRepository;

  @Mock
  private BeaconUseService beaconUseService;

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

    Page<BeaconSearchEntity> result =
      beaconSpecificationSearchService.findAllBeacons(
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

    given(
      beaconSearchSpecificationRepository.findAll(
        any(Specification.class),
        eq(pageable)
      )
    ).willReturn(expectedPage);

    Page<BeaconSearchEntity> result =
      beaconSpecificationSearchService.findAllBeacons(
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

  @Test
  public void givenEmailAndAccountHolderId_WhenSearchingBeacons_ThenReturnBeaconSearchEntities() {
    String email = "test@example.com";
    UUID accountId = UUID.randomUUID();
    Sort sort = Sort.by("hexId");
    BeaconSearchEntity entity1 = createDummyEntity(UUID.randomUUID());
    BeaconSearchEntity entity2 = createDummyEntity(UUID.randomUUID());
    List<BeaconSearchEntity> expectedList = List.of(entity1, entity2);
    List<BeaconSearchDTO> expectedListDTO = List.of(
      beaconSpecificationSearchService.toDto(entity1),
      beaconSpecificationSearchService.toDto(entity2)
    );

    given(
      beaconSearchSpecificationRepository.findAll(
        any(Specification.class),
        eq(sort)
      )
    ).willReturn(expectedList);

    List<BeaconSearchDTO> actualList =
      beaconSpecificationSearchService.findAllByAccountHolderIdAndEmail(
        email,
        accountId,
        sort
      );

    assertThat(actualList, equalTo(expectedListDTO));
    assertThat(actualList, hasSize(2));

    verify(beaconSearchSpecificationRepository).findAll(
      any(Specification.class),
      eq(sort)
    );
  }

  @Test
  public void givenFindAllBeaconsForFullExport_ThenShouldCallRepositoryAndReturnList() {
    BeaconSearchEntity entity1 = createDummyEntity(UUID.randomUUID());
    BeaconSearchEntity entity2 = createDummyEntity(UUID.randomUUID());
    List<BeaconSearchEntity> expectedList = List.of(entity1, entity2);

    given(
      beaconSearchSpecificationRepository.findAll(any(Specification.class))
    ).willReturn(expectedList);

    List<BeaconSearchEntity> actualList =
      beaconSpecificationSearchService.findAllBeaconsForFullExport(
        "",
        null,
        null,
        null,
        null
      );

    verify(beaconSearchSpecificationRepository, times(1)).findAll(
      any(Specification.class)
    );

    assertThat(actualList, equalTo(expectedList));
    assertThat(actualList, hasSize(2));
  }

  @Test
  public void shouldCorrectlyMapEntityToDto() {
    BeaconSearchEntity testEntity = createDummyEntity(UUID.randomUUID());
    BeaconSearchDTO resultDto = beaconSpecificationSearchService.toDto(
      testEntity
    );

    assertThat(resultDto, notNullValue());
    assertThat(testEntity.getId(), equalTo(resultDto.getId()));
    assertThat(testEntity.getHexId(), equalTo(resultDto.getHexId()));
    assertThat(testEntity.getOwnerName(), equalTo(resultDto.getOwnerName()));
    assertThat(
      testEntity.getBeaconStatus(),
      equalTo(resultDto.getBeaconStatus())
    );
    assertThat(
      testEntity.getCreatedDate(),
      equalTo(resultDto.getCreatedDate())
    );
  }

  @Test
  void resolveMainUseName_shouldDoNothingIfNameIsAlreadyPresent() {
    createTestDto.setMainUseName("Main Use");

    beaconSpecificationSearchService.resolveMainUseName(createTestDto);

    verify(beaconUseService, never()).getMainUseByBeaconId(any(BeaconId.class));
    assertThat("Main Use", equalTo(createTestDto.getMainUseName()));
  }

  @Test
  void resolveMainUseName_shouldSetVesselNameAsMainUse() {
    BeaconUse mockUse = new BeaconUse();
    mockUse.setVesselName("Vessel Name");
    mockUse.setRegistrationMark("");

    given(
      beaconUseService.getMainUseByBeaconId(any(BeaconId.class))
    ).willReturn(mockUse);

    beaconSpecificationSearchService.resolveMainUseName(createTestDto);

    verify(beaconUseService, times(1)).getMainUseByBeaconId(
      new BeaconId(createTestDto.getId())
    );
    assertThat("Vessel Name", equalTo(createTestDto.getMainUseName()));
  }

  @Test
  void resolveMainUseName_shouldSetRegistrationMarkAsMainUseWhenVesselNameIsBlank() {
    BeaconUse mockUse = new BeaconUse();
    mockUse.setVesselName("  ");
    mockUse.setRegistrationMark("A1234");
    given(
      beaconUseService.getMainUseByBeaconId(any(BeaconId.class))
    ).willReturn(mockUse);

    beaconSpecificationSearchService.resolveMainUseName(createTestDto);

    verify(beaconUseService, times(1)).getMainUseByBeaconId(
      new BeaconId(createTestDto.getId())
    );
    assertThat("A1234", equalTo(createTestDto.getMainUseName()));
  }

  private BeaconSearchEntity createDummyEntity(UUID id) {
    BeaconSearchEntity entity = new BeaconSearchEntity();
    entity.setId(id);
    entity.setHexId("1D123456789ABCD");
    entity.setBeaconStatus("NEW");
    return entity;
  }

  private final BeaconSearchDTO createTestDto = BeaconSearchDTO.builder()
    .id(UUID.randomUUID())
    .mainUseName(null)
    .build();
}
