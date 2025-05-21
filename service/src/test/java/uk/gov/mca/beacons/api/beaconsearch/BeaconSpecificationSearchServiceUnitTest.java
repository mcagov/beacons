package uk.gov.mca.beacons.api.beaconsearch;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import java.util.List;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
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
}
