package uk.gov.mca.beacons.api.search.rest;

import io.swagger.v3.oas.annotations.tags.Tag;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.data.rest.core.annotation.RestResource;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.RequestParam;
import uk.gov.mca.beacons.api.search.domain.BeaconSearchEntity;

/**
 * This {@link RepositoryRestResource} exposes controller endpoints to enable searching across beacon records using JPA's built in pagination/sorting capability.
 * <p>
 * See the docs: <a href="https://docs.spring.io/spring-data/rest/docs/current/reference/html/#reference">...</a> for more info
 */
@RepositoryRestResource(
  path = "beacon-search",
  collectionResourceRel = "beaconSearch"
)
@Tag(name = "BeaconSearch")
interface BeaconSearchRestRepository
  extends JpaRepository<BeaconSearchEntity, UUID> {
  @RestResource(
    path = "find-all-by-account-holder-and-email",
    rel = "findAllBeaconsForAccountHolder"
  )
  @Query(
    "SELECT b FROM BeaconSearchEntity b WHERE " +
    "((b.ownerEmail = :email OR b.legacyBeaconRecoveryEmail = :email) AND b.beaconStatus = 'MIGRATED') OR " +
    "(b.accountHolderId = :accountHolderId AND b.beaconStatus IN ('NEW', 'CHANGE'))"
  )
  List<BeaconSearchEntity> findALlByAccountHolderIdAndEmail(
    @Param("email") String email,
    @Param("accountHolderId") UUID accountHolderId,
    Sort sort
  );

  @RestResource(path = "export-search", rel = "findAllBeaconsForExport")
  @Query(
    "SELECT b FROM BeaconSearchEntity b WHERE " +
    "(" +
    "COALESCE(:name , '') = '' OR " +
    "(" +
    "LOWER(COALESCE(b.ownerName, '')) LIKE LOWER(CONCAT('%',:name, '%')) " +
    "OR " +
    "LOWER(COALESCE(b.accountHolderName, '')) LIKE LOWER(CONCAT('%', :name, '%'))" +
    ") " +
    ") " +
    "AND ((COALESCE(:registrationFrom, '') ='') OR b.createdDate >= :registrationFrom) " +
    "AND ((COALESCE(:registrationTo, '') = '') OR b.createdDate <= :registrationTo) " +
    "AND ((COALESCE(:lastModifiedFrom, '') = '') OR b.lastModifiedDate >= :lastModifiedFrom) " +
    "AND ((COALESCE(:lastModifiedTo, '') = '') OR b.lastModifiedDate <= :lastModifiedTo) "
  )
  Page<BeaconSearchEntity> findAllBeaconsForExport(
    @RequestParam(required = false, defaultValue = "") String name,
    @RequestParam(required = false) @DateTimeFormat(
      iso = DateTimeFormat.ISO.DATE_TIME,
      fallbackPatterns = { "yyyy-MM-dd" }
    ) OffsetDateTime registrationFrom,
    @RequestParam(required = false) @DateTimeFormat(
      iso = DateTimeFormat.ISO.DATE_TIME,
      fallbackPatterns = { "yyyy-MM-dd" }
    ) OffsetDateTime registrationTo,
    @RequestParam(required = false) @DateTimeFormat(
      iso = DateTimeFormat.ISO.DATE_TIME,
      fallbackPatterns = { "yyyy-MM-dd" }
    ) OffsetDateTime lastModifiedFrom,
    @RequestParam(required = false) @DateTimeFormat(
      iso = DateTimeFormat.ISO.DATE_TIME,
      fallbackPatterns = { "yyyy-MM-dd" }
    ) OffsetDateTime lastModifiedTo,
    Pageable page
  );

  @RestResource(
    path = "full-export-search",
    rel = "findAllBeaconsForFullExport"
  )
  @Query(
    "SELECT b FROM BeaconSearchEntity b WHERE " +
    "(" +
    "COALESCE(:name , '') = '' OR " +
    "(" +
    "LOWER(COALESCE(b.ownerName, '')) LIKE LOWER(CONCAT('%',:name, '%')) " +
    "OR " +
    "LOWER(COALESCE(b.accountHolderName, '')) LIKE LOWER(CONCAT('%', :name, '%'))" +
    ") " +
    ") " +
    "AND ((COALESCE(:registrationFrom, '') ='') OR b.createdDate >= :registrationFrom) " +
    "AND ((COALESCE(:registrationTo, '') = '') OR b.createdDate <= :registrationTo) " +
    "AND ((COALESCE(:lastModifiedFrom, '') = '') OR b.lastModifiedDate >= :lastModifiedFrom) " +
    "AND ((COALESCE(:lastModifiedTo, '') = '') OR b.lastModifiedDate <= :lastModifiedTo) "
  )
  List<BeaconSearchEntity> findAllBeaconsForFullExport(
    @RequestParam(required = false, defaultValue = "") String name,
    @RequestParam(required = false) @DateTimeFormat(
      iso = DateTimeFormat.ISO.DATE_TIME,
      fallbackPatterns = { "yyyy-MM-dd" }
    ) OffsetDateTime registrationFrom,
    @RequestParam(required = false) @DateTimeFormat(
      iso = DateTimeFormat.ISO.DATE_TIME,
      fallbackPatterns = { "yyyy-MM-dd" }
    ) OffsetDateTime registrationTo,
    @RequestParam(required = false) @DateTimeFormat(
      iso = DateTimeFormat.ISO.DATE_TIME,
      fallbackPatterns = { "yyyy-MM-dd" }
    ) OffsetDateTime lastModifiedFrom,
    @RequestParam(required = false) @DateTimeFormat(
      iso = DateTimeFormat.ISO.DATE_TIME,
      fallbackPatterns = { "yyyy-MM-dd" }
    ) OffsetDateTime lastModifiedTo
  );
}
