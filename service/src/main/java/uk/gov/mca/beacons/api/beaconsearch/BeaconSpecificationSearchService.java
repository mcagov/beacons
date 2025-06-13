package uk.gov.mca.beacons.api.beaconsearch;

import java.util.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import uk.gov.mca.beacons.api.beaconsearch.repositories.BeaconSearchSpecificationRepository;
import uk.gov.mca.beacons.api.beaconsearch.rest.BeaconSearchSpecification;
import uk.gov.mca.beacons.api.search.domain.BeaconSearchEntity;

@Service
public class BeaconSpecificationSearchService {

  private final BeaconSearchSpecificationRepository beaconSearchSpecificationRepository;
  private final CacheManager cacheManager;

  @Autowired
  public BeaconSpecificationSearchService(
    BeaconSearchSpecificationRepository beaconSearchSpecificationRepository,
    CacheManager cacheManager
  ) {
    this.beaconSearchSpecificationRepository =
      beaconSearchSpecificationRepository;
    this.cacheManager = cacheManager;
  }

  /**
   * Finds all beacons based on search criteria. The result of this method is cached.
   * The cache key is a combination of all search parameters and pagination details
   * to ensure that each unique query is cached separately.
   * <a href="https://docs.spring.io/spring-framework/reference/integration/cache/annotations.html">...</a>
   */
  @Cacheable(
    value = "find-all-beacons",
    key = "{#status, #uses, #hexId, #ownerName, #cospasSarsatNumber, #manufacturerSerialNumber, #pageable.pageNumber, #pageable.pageSize, #pageable.sort}"
  )
  public Page<BeaconSearchEntity> findAllBeacons(
    String status,
    String uses,
    String hexId,
    String ownerName,
    String cospasSarsatNumber,
    String manufacturerSerialNumber,
    Pageable pageable
  ) {
    Specification<BeaconSearchEntity> spec = Specification.where(
      BeaconSearchSpecification.hasStatus(status)
    )
      .and(BeaconSearchSpecification.hasUses(uses))
      .and(BeaconSearchSpecification.hasHexId(hexId))
      .and(BeaconSearchSpecification.hasOwnerName(ownerName))
      .and(BeaconSearchSpecification.hasCospasSarsatNumber(cospasSarsatNumber))
      .and(
        BeaconSearchSpecification.hasManufacturerSerialNumber(
          manufacturerSerialNumber
        )
      );

    Long totalElements = getCachedTotalCount();

    if (totalElements == null) {
      totalElements = beaconSearchSpecificationRepository.count();
      Objects.requireNonNull(cacheManager.getCache("findAllBeaconsCount")).put(
        "total",
        totalElements
      );
    }

    Slice<BeaconSearchEntity> results =
      beaconSearchSpecificationRepository.findAll(spec, pageable);
    return results.getContent().isEmpty()
      ? Page.empty(pageable)
      : new PageImpl<>(results.getContent(), pageable, totalElements);
  }

  public List<BeaconSearchEntity> findAllByAccountHolderIdAndEmail(
    String email,
    UUID accountHolderId,
    Sort sort
  ) {
    Specification<BeaconSearchEntity> spec = Specification.where(
      BeaconSearchSpecification.hasEmailOrRecoveryEmail(email)
    ).or(BeaconSearchSpecification.hasAccountHolder(accountHolderId));

    List<BeaconSearchEntity> results =
      beaconSearchSpecificationRepository.findAll(spec, sort);

    return results.isEmpty() ? Collections.emptyList() : results;
  }

  private Long getCachedTotalCount() {
    return Objects.requireNonNull(
      cacheManager.getCache("findAllBeaconsCount")
    ).get("total", Long.class);
  }
}
