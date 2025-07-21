package uk.gov.mca.beacons.api.beaconsearch;

import java.time.OffsetDateTime;
import java.util.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import uk.gov.mca.beacons.api.beacon.domain.BeaconId;
import uk.gov.mca.beacons.api.beaconsearch.repositories.BeaconSearchSpecificationRepository;
import uk.gov.mca.beacons.api.beaconsearch.rest.BeaconSearchSpecification;
import uk.gov.mca.beacons.api.beaconuse.application.BeaconUseService;
import uk.gov.mca.beacons.api.search.domain.BeaconSearchEntity;

@Slf4j
@Service
public class BeaconSpecificationSearchService {

  private final BeaconSearchSpecificationRepository beaconSearchSpecificationRepository;
  private final BeaconUseService beaconUseService;

  @Autowired
  public BeaconSpecificationSearchService(
    BeaconSearchSpecificationRepository beaconSearchSpecificationRepository,
    BeaconUseService beaconUseService
  ) {
    this.beaconSearchSpecificationRepository =
      beaconSearchSpecificationRepository;
    this.beaconUseService = beaconUseService;
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
    Specification<BeaconSearchEntity> migratedSpec = Specification.where(
      BeaconSearchSpecification.hasEmailOrRecoveryEmail(email)
    ).and(BeaconSearchSpecification.hasMigratedStatus());

    Specification<BeaconSearchEntity> newOrChangeSpec = Specification.where(
      BeaconSearchSpecification.hasAccountHolderId(accountHolderId)
    ).and(BeaconSearchSpecification.hasNewOrChangeStatus());

    Specification<BeaconSearchEntity> spec = migratedSpec.or(newOrChangeSpec);
    List<BeaconSearchEntity> results =
      beaconSearchSpecificationRepository.findAll(spec, sort);
    results.forEach(beaconSearchEntity -> {
      if (!StringUtils.hasText(beaconSearchEntity.getMainUseName())) {
        beaconSearchEntity.setMainUseName(
          resolveMainUseName(new BeaconId(beaconSearchEntity.getId()))
        );
      }
    });

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

  private String resolveMainUseName(BeaconId beaconId) {
    try {
      var mainUse = beaconUseService.getMainUseByBeaconId(beaconId);
      if (mainUse == null) {
        return "";
      }
      return StringUtils.hasText(mainUse.getVesselName())
        ? mainUse.getVesselName()
        : mainUse.getRegistrationMark();
    } catch (Exception e) {
      log.error(
        "Failed to resolve main use name for beaconId: {}",
        beaconId,
        e
      );
      return "";
    }
  }
}
