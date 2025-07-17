package uk.gov.mca.beacons.api.beaconsearch;

import java.time.OffsetDateTime;
import java.util.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import uk.gov.mca.beacons.api.beaconsearch.repositories.BeaconSearchSpecificationRepository;
import uk.gov.mca.beacons.api.beaconsearch.rest.BeaconSearchSpecification;
import uk.gov.mca.beacons.api.search.domain.BeaconSearchEntity;

@Service
public class BeaconSpecificationSearchService {

  private final BeaconSearchSpecificationRepository beaconSearchSpecificationRepository;

  @Autowired
  public BeaconSpecificationSearchService(
    BeaconSearchSpecificationRepository beaconSearchSpecificationRepository
  ) {
    this.beaconSearchSpecificationRepository =
      beaconSearchSpecificationRepository;
  }

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

    Page<BeaconSearchEntity> results =
      beaconSearchSpecificationRepository.findAll(spec, pageable);

    return results.getContent().isEmpty() ? Page.empty(pageable) : results;
  }

  public List<BeaconSearchEntity> findAllByAccountHolderIdAndEmail(
    String email,
    UUID accountHolderId,
    Sort sort
  ) {
    Specification<BeaconSearchEntity> spec = Specification.where(
      BeaconSearchSpecification.hasEmailOrRecoveryEmail(email)
    )
      .and(BeaconSearchSpecification.hasMigratedStatus())
      .or(BeaconSearchSpecification.hasAccountHolderId(accountHolderId))
      .and(BeaconSearchSpecification.hasNewOrChangeStatus());

    List<BeaconSearchEntity> results =
      beaconSearchSpecificationRepository.findAll(spec, sort);

    return results.isEmpty() ? Collections.emptyList() : results;
  }

  public List<BeaconSearchEntity> findAllBeaconsForFullExport(
    String name,
    OffsetDateTime registrationFrom,
    OffsetDateTime registrationTo,
    OffsetDateTime lastModifiedFrom,
    OffsetDateTime lastModifiedTo
  ) {
    Specification<BeaconSearchEntity> spec = Specification.where(
      BeaconSearchSpecification.hasOwnerName(name)
    )
      .or(BeaconSearchSpecification.hasAccountHolderName(name))
      .and(
        BeaconSearchSpecification.hasDateOnAfter(
          registrationFrom,
          "createdDate"
        )
      )
      .and(
        BeaconSearchSpecification.hasDateOnBefore(registrationTo, "createdDate")
      )
      .and(
        BeaconSearchSpecification.hasDateOnAfter(
          lastModifiedFrom,
          "lastModifiedDate"
        )
      )
      .and(
        BeaconSearchSpecification.hasDateOnBefore(
          lastModifiedTo,
          "lastModifiedDate"
        )
      );

    List<BeaconSearchEntity> results =
      beaconSearchSpecificationRepository.findAll(spec);

    return results.isEmpty() ? Collections.emptyList() : results;
  }
}
