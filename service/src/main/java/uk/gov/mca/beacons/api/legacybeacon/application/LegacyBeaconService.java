package uk.gov.mca.beacons.api.legacybeacon.application;

import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.mca.beacons.api.legacybeacon.domain.*;
import uk.gov.mca.beacons.api.legacybeacon.domain.LegacyBeacon;
import uk.gov.mca.beacons.api.legacybeacon.domain.LegacyBeaconId;
import uk.gov.mca.beacons.api.legacybeacon.domain.LegacyBeaconRepository;

@Transactional
@Slf4j
@Service("LegacyBeaconServiceV2")
public class LegacyBeaconService {

  private final LegacyBeaconRepository legacyBeaconRepository;
  private final DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern(
    "uuuu-MM-dd'T'HH:mm:ss"
  );

  @Autowired
  public LegacyBeaconService(LegacyBeaconRepository legacyBeaconRepository) {
    this.legacyBeaconRepository = legacyBeaconRepository;
  }

  public LegacyBeacon create(LegacyBeacon legacyBeacon) {
    return this.legacyBeaconRepository.save(legacyBeacon);
  }

  public List<LegacyBeacon> findAll() {
    return legacyBeaconRepository.findAll();
  }

  public Optional<LegacyBeacon> findById(LegacyBeaconId legacyBeaconId) {
    return legacyBeaconRepository.findById(legacyBeaconId);
  }

  public List<LegacyBeacon> findByHexIdAndAccountHolderEmail(
    String hexId,
    String accountHolderEmail
  ) {
    List<LegacyBeacon> beaconsMatchingAccountHolderEmail = legacyBeaconRepository.findByHexIdAndOwnerEmail(
      hexId,
      accountHolderEmail
    );

    if (beaconsMatchingAccountHolderEmail.size() == 0) {
      beaconsMatchingAccountHolderEmail =
        legacyBeaconRepository.findByHexIdAndRecoveryEmail(
          hexId,
          accountHolderEmail
        );
    }

    return beaconsMatchingAccountHolderEmail;
  }

  public List<LegacyBeacon> claimByHexIdAndRecoveryEmail(
    String hexId,
    String recoveryEmail
  ) {
    // todo: abstract to avoid duplication
    List<LegacyBeacon> legacyBeacons = legacyBeaconRepository.findByHexIdAndRecoveryEmail(
      hexId,
      recoveryEmail
    );

    legacyBeacons.forEach(LegacyBeacon::claim);
    List<LegacyBeacon> savedLegacyBeacons = legacyBeaconRepository.saveAll(
      legacyBeacons
    );

    log.info(
      "Claimed {} legacy beacon(s) with HexID {}",
      savedLegacyBeacons.size(),
      hexId
    );

    return savedLegacyBeacons;
  }

  public List<LegacyBeacon> claimByHexIdAndAccountHolderEmail(
    String hexId,
    String email
  ) {
    List<LegacyBeacon> legacyBeacons = legacyBeaconRepository.findByHexIdAndOwnerEmail(
      hexId,
      email
    );
    legacyBeacons.forEach(LegacyBeacon::claim);
    List<LegacyBeacon> savedLegacyBeacons = legacyBeaconRepository.saveAll(
      legacyBeacons
    );

    log.info(
      "Claimed {} legacy beacon(s) with HexID {}",
      savedLegacyBeacons.size(),
      hexId
    );

    return savedLegacyBeacons;
  }

  public void updateRecoveryEmailByBeaconId(
    String recoveryEmail,
    LegacyBeaconId id
  ) {
    LegacyBeacon legacyBeacon = legacyBeaconRepository.getById(id);
    legacyBeacon.setRecoveryEmail(recoveryEmail);
    legacyBeaconRepository.save(legacyBeacon);
  }

  public LegacyBeacon delete(
    LegacyBeacon legacyBeaconToDelete,
    String reasonForDeletion
  ) {
    OffsetDateTime today = OffsetDateTime.now();

    legacyBeaconToDelete.softDelete();

    LegacyData legacyBeaconData = legacyBeaconToDelete.getData();
    LegacyBeaconDetails legacyDataBeaconDetails = legacyBeaconData.getBeacon();

    legacyBeaconData.setOwner(new LegacyOwner());
    legacyBeaconData.setUses(new ArrayList<LegacyUse>());
    legacyBeaconData.setEmergencyContact(new LegacyEmergencyContact());
    legacyBeaconData.setSecondaryOwners(new ArrayList<LegacySecondaryOwner>());

    legacyDataBeaconDetails.setNote(null);
    legacyDataBeaconDetails.setLastModifiedDate(
      today.format(dateTimeFormatter)
    );
    legacyDataBeaconDetails.setIsWithdrawn("Y");
    legacyDataBeaconDetails.setWithdrawnReason(reasonForDeletion);

    legacyBeaconToDelete.setOwnerEmail(null);
    legacyBeaconToDelete.setOwnerName(null);
    legacyBeaconToDelete.setUseActivities(null);
    legacyBeaconToDelete.setLastModifiedDate(today);

    return legacyBeaconRepository.save(legacyBeaconToDelete);
  }
}
