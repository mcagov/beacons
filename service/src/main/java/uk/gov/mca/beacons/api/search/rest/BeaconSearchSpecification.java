package uk.gov.mca.beacons.api.search.rest;

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
      return (root, query, cb) ->
        likeLower(cb, root.get("beaconStatus"), status);
    }
    return null;
  }

  public static @Nullable Specification<BeaconSearchEntity> hasUses(
    String uses
  ) {
    if (StringUtils.hasText(uses)) {
      return (root, query, cb) ->
        likeLower(cb, root.get("useActivities"), uses);
    }
    return null;
  }

  public static @Nullable Specification<BeaconSearchEntity> hasHexId(
    String hexId
  ) {
    if (StringUtils.hasText(hexId)) {
      return (root, query, cb) -> likeLower(cb, root.get("hexId"), hexId);
    }
    return null;
  }

  public static @Nullable Specification<BeaconSearchEntity> hasOwnerName(
    String ownerName
  ) {
    if (StringUtils.hasText(ownerName)) {
      return (root, query, cb) ->
        likeLower(cb, root.get("ownerName"), ownerName);
    }
    return null;
  }

  public static @Nullable Specification<
    BeaconSearchEntity
  > hasCospasSarsatNumber(String cospasSarsatNumber) {
    if (StringUtils.hasText(cospasSarsatNumber)) {
      return (root, query, cb) ->
        likeLower(cb, root.get("cospasSarsatNumber"), cospasSarsatNumber);
    }
    return null;
  }

  public static @Nullable Specification<
    BeaconSearchEntity
  > hasManufacturerSerialNumber(String manufacturerSerialNumber) {
    if (StringUtils.hasText(manufacturerSerialNumber)) {
      return (root, query, cb) ->
        likeLower(
          cb,
          root.get("manufacturerSerialNumber"),
          manufacturerSerialNumber
        );
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
