package uk.gov.mca.beacons.api.beaconsearch;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
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
import uk.gov.mca.beacons.api.beaconsearch.repositories.BeaconSearchSpecificationRepository;
import uk.gov.mca.beacons.api.search.domain.BeaconSearchEntity;

@ExtendWith(MockitoExtension.class)
public class BeaconSpecificationSearchServiceUnitTest {

  @InjectMocks
  BeaconSpecificationSearchService beaconSpecificationSearchService;

  @Mock
  BeaconSearchSpecificationRepository beaconSearchSpecificationRepository;

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
    assertThat(result.getContent(), empty());
    assertThat(result.getSize(), equalTo(20));
    assertThat(result.getTotalPages(), equalTo(0));
    assertThat(result.getNumber(), equalTo(0));
  }

  @Test
  public void givenEmailAndAccountHolder_ThenShouldCallRepositoryWithSpecificationAndSort() {
    String email = "test@example.com";
    UUID accountId = UUID.randomUUID();
    Sort sort = Sort.by("hexId");
    BeaconSearchEntity entity1 = createDummyEntity(UUID.randomUUID());
    BeaconSearchEntity entity2 = createDummyEntity(UUID.randomUUID());
    List<BeaconSearchEntity> expectedList = List.of(entity1, entity2);

    when(
      beaconSearchSpecificationRepository.findAll(
        any(Specification.class),
        any(Sort.class)
      )
    ).thenReturn(expectedList);

    List<BeaconSearchEntity> actualList =
      beaconSpecificationSearchService.findAllByAccountHolderIdAndEmail(
        email,
        accountId,
        sort
      );

    assertThat(actualList, equalTo(expectedList));
    assertThat(actualList, hasSize(2));

    verify(beaconSearchSpecificationRepository).findAll(
      any(Specification.class),
      any(Sort.class)
    );
  }

  @Test
  public void givenSearchParam_ThenShouldCallRepositoryWithSpecificationOnlyForFullExport() {
    String searchParams = "search";
    OffsetDateTime regFrom = OffsetDateTime.of(
      2025,
      1,
      1,
      0,
      0,
      0,
      0,
      ZoneOffset.UTC
    );
    OffsetDateTime regTo = null;
    OffsetDateTime modFrom = null;
    OffsetDateTime modTo = null;
    BeaconSearchEntity entity1 = createDummyEntity(UUID.randomUUID());
    BeaconSearchEntity entity2 = createDummyEntity(UUID.randomUUID());
    List<BeaconSearchEntity> expectedList = List.of(entity1, entity2);

    when(beaconSearchRepository.findAll(any(Specification.class))).thenReturn(
      expectedList
    );

    List<BeaconSearchEntity> actualList =
      beaconSpecificationSearchService.findAllBeaconsForFullExport(
        name,
        regFrom,
        regTo,
        modFrom,
        modTo
      );

    assertThat(actualList).isEqualTo(expectedList);
    assertThat(actualList).hasSize(2);

    verify(beaconSearchRepository).findAll(any(Specification.class));
  }

  private BeaconSearchEntity createDummyEntity(UUID id) {
    BeaconSearchEntity entity = new BeaconSearchEntity();
    entity.setId(id);
    entity.setHexId("1D123456789ABCD");
    entity.setBeaconStatus("NEW");
    return entity;
  }
}
