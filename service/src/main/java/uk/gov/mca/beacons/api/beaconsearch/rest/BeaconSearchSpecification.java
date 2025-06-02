package uk.gov.mca.beacons.api.beaconsearch.rest;

import java.util.Arrays;
import java.util.UUID;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.Expression;
import javax.persistence.criteria.Predicate;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;
import uk.gov.mca.beacons.api.search.domain.BeaconSearchEntity;

public class BeaconSearchSpecification {

  public static @Nullable Specification<BeaconSearchEntity> hasStatus(
    String status
  ) {
    return hasFuzzySearchCriteria(status, "beaconStatus");
  }

  public static @Nullable Specification<BeaconSearchEntity> hasUses(
    String uses
  ) {
    return hasFuzzySearchCriteria(uses, "useActivities");
  }

  public static @Nullable Specification<BeaconSearchEntity> hasHexId(
    String hexId
  ) {
    return hasFuzzySearchCriteria(hexId, "hexId");
  }

  public static @Nullable Specification<BeaconSearchEntity> hasOwnerName(
    String ownerName
  ) {
    return hasFuzzySearchCriteria(ownerName, "ownerName");
  }

  public static @Nullable Specification<
    BeaconSearchEntity
  > hasCospasSarsatNumber(String cospasSarsatNumber) {
    return hasFuzzySearchCriteria(cospasSarsatNumber, "cospasSarsatNumber");
  }

  public static @Nullable Specification<
    BeaconSearchEntity
  > hasManufacturerSerialNumber(String manufacturerSerialNumber) {
    return hasFuzzySearchCriteria(
      manufacturerSerialNumber,
      "manufacturerSerialNumber"
    );
  }

  public static @Nullable Specification<
    BeaconSearchEntity
  > hasEmailOrRecoveryEmail(String email) {
    return (root, query, cb) ->
      cb.and(
        cb.or(
          cb.equal(root.get("ownerEmail"), email),
          cb.equal(root.get("legacyBeaconRecoveryEmail"), email)
        ),
        cb.equal(root.get("beaconStatus"), "MIGRATED")
      );
  }

  public static @Nullable Specification<BeaconSearchEntity> hasAccountHolder(
    UUID accountHolderId
  ) {
    return (root, query, cb) ->
      cb.and(
        cb.equal(root.get("accountHolderId"), accountHolderId),
        root.get("beaconStatus").in(Arrays.asList("NEW", "CHANGE"))
      );
  }

  private static @Nullable Specification<
    BeaconSearchEntity
  > hasFuzzySearchCriteria(String searchValue, String criteriaName) {
    if (StringUtils.hasText(searchValue)) {
      return (root, query, cb) ->
        likeLower(cb, root.get(criteriaName), searchValue);
    }
    return null;
  }

  private static Predicate likeLower(
    @NotNull CriteriaBuilder cb,
    Expression<String> expression,
    @NotNull String pattern
  ) {
    return cb.like(
      cb.lower(cb.coalesce(expression, "")),
      "%" + pattern.toLowerCase() + "%"
    );
  }
}
