package uk.gov.mca.beacons.api.legacybeacon.application;

import java.time.*;
import java.time.format.DateTimeFormatter;
import java.time.format.FormatStyle;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.mca.beacons.api.accountholder.domain.AccountHolder;
import uk.gov.mca.beacons.api.beacon.domain.Beacon;
import uk.gov.mca.beacons.api.exceptions.ResourceNotFoundException;
import uk.gov.mca.beacons.api.legacybeacon.domain.*;
import uk.gov.mca.beacons.api.legacybeacon.domain.LegacyBeacon;
import uk.gov.mca.beacons.api.legacybeacon.domain.LegacyBeaconId;
import uk.gov.mca.beacons.api.legacybeacon.domain.LegacyBeaconRepository;
import uk.gov.mca.beacons.api.registration.domain.Registration;
import uk.gov.mca.beacons.api.registration.rest.DeleteBeaconDTO;

@Transactional
@Slf4j
@Service("LegacyBeaconServiceV2")
public class LegacyBeaconService {

  private final LegacyBeaconRepository legacyBeaconRepository;
  private final DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern(
    "yyyy-MM-dd-HH:mm:ss"
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

  public List<LegacyBeacon> getBatch(int batchSize, int numberAlreadyTaken) {
    return legacyBeaconRepository
      .findAll()
      .stream()
      .skip(numberAlreadyTaken)
      .limit(batchSize)
      .collect(Collectors.toList());
  }

  public LegacyBeacon delete(
    LegacyBeacon legacyBeaconToDelete,
    String reasonForDeletion
  ) {
    LocalDateTime todaysDate = LocalDateTime
      .now()
      .truncatedTo(ChronoUnit.SECONDS);
    OffsetDateTime todaysOffsetDate = todaysDate.atOffset(
      ZoneOffset.ofTotalSeconds(1)
    );

    legacyBeaconToDelete.softDelete();

    LegacyData legacyBeaconData = legacyBeaconToDelete.getData();
    LegacyBeaconDetails legacyDataBeaconDetails = legacyBeaconData.getBeacon();

    legacyBeaconData.setOwner(new LegacyOwner());
    legacyBeaconData.setUses(new ArrayList<LegacyUse>());
    legacyBeaconData.setEmergencyContact(new LegacyEmergencyContact());
    legacyBeaconData.setSecondaryOwners(new ArrayList<LegacySecondaryOwner>());

    legacyDataBeaconDetails.setNote(null);
    legacyDataBeaconDetails.setLastModifiedDate(todaysDate.toString());
    legacyDataBeaconDetails.setIsWithdrawn("Y");
    legacyDataBeaconDetails.setWithdrawnReason(reasonForDeletion);

    legacyBeaconToDelete.setOwnerEmail(null);
    legacyBeaconToDelete.setOwnerName(null);
    legacyBeaconToDelete.setUseActivities(null);
    legacyBeaconToDelete.setLastModifiedDate(todaysOffsetDate);

    return legacyBeaconRepository.save(legacyBeaconToDelete);
  }
}
