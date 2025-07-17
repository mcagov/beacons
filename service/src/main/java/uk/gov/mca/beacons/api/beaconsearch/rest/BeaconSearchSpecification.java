package uk.gov.mca.beacons.api.beaconsearch.rest;

import java.time.OffsetDateTime;
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
    if (StringUtils.hasText(status)) {
      return (root, query, cb) -> cb.equal(root.get("beaconStatus"), status);
    }
    return null;
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
  > hasAccountHolderName(String accountHolderName) {
    return hasFuzzySearchCriteria(accountHolderName, "accountHolderName");
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
      cb.or(
        cb.equal(root.get("ownerEmail"), email),
        cb.equal(root.get("legacyBeaconRecoveryEmail"), email)
      );
  }

  public static Specification<BeaconSearchEntity> hasMigratedStatus() {
    return (root, query, cb) -> cb.equal(root.get("beaconStatus"), "MIGRATED");
  }

  public static Specification<BeaconSearchEntity> hasAccountHolderId(
    UUID accountHolderId
  ) {
    return (root, query, cb) ->
      cb.equal(root.get("accountHolderId"), accountHolderId);
  }

  public static Specification<BeaconSearchEntity> hasNewOrChangeStatus() {
    return (root, query, cb) ->
      root.get("beaconStatus").in(Arrays.asList("NEW", "CHANGE"));
  }

  public static @Nullable Specification<BeaconSearchEntity> hasDateOnAfter(
    OffsetDateTime dateTime,
    String criteriaName
  ) {
    if (dateTime != null) {
      return (root, query, cb) ->
        hasDateGreaterThanOrEqualTo(cb, root.get(criteriaName), dateTime);
    }
    return null;
  }

  public static @Nullable Specification<BeaconSearchEntity> hasDateOnBefore(
    OffsetDateTime dateTime,
    String criteriaName
  ) {
    if (dateTime != null) {
      return (root, query, cb) ->
        hasDateLessThanOrEqualTo(cb, root.get(criteriaName), dateTime);
    }
    return null;
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

  private static Predicate hasDateGreaterThanOrEqualTo(
    @NotNull CriteriaBuilder cb,
    Expression<OffsetDateTime> expression,
    @NotNull OffsetDateTime pattern
  ) {
    return cb.greaterThanOrEqualTo(expression, pattern);
  }

  private static Predicate hasDateLessThanOrEqualTo(
    @NotNull CriteriaBuilder cb,
    Expression<OffsetDateTime> expression,
    @NotNull OffsetDateTime pattern
  ) {
    return cb.lessThanOrEqualTo(expression, pattern);
  }
}
