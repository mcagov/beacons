package uk.gov.mca.beacons.api.legacybeacon.application;

import static java.util.stream.Collectors.groupingBy;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.time.format.FormatStyle;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
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

  public List<LegacyBeacon> delete(
    String hexId,
    String email,
    String reasonForDeletion
  ) {
    LocalDateTime todaysDate = LocalDateTime
      .now()
      .truncatedTo(ChronoUnit.SECONDS);
    OffsetDateTime todaysOffsetDate = todaysDate.atOffset(ZoneOffset.UTC);

    List<LegacyBeacon> legacyBeacons = legacyBeaconRepository.findByHexIdAndOwnerEmail(
      hexId,
      email
    );
    legacyBeacons.forEach(LegacyBeacon::softDelete);

    LegacyBeacon legacyBeacon = legacyBeacons.get(0);
    LegacyData legacyBeaconData = legacyBeacon.getData();
    LegacyBeaconDetails legacyDataBeaconDetails = legacyBeaconData.getBeacon();

    legacyBeaconData.setOwner(new LegacyOwner());
    legacyBeaconData.setUses(new ArrayList<LegacyUse>());
    legacyBeaconData.setEmergencyContact(new LegacyEmergencyContact());
    legacyBeaconData.setSecondaryOwners(new ArrayList<LegacySecondaryOwner>());

    legacyDataBeaconDetails.setNote(null);
    legacyDataBeaconDetails.setLastModifiedDate(todaysDate.toString());
    legacyDataBeaconDetails.setIsWithdrawn("Y");
    legacyDataBeaconDetails.setWithdrawnReason(reasonForDeletion);

    legacyBeacon.setOwnerEmail(null);
    legacyBeacon.setOwnerName(null);
    legacyBeacon.setUseActivities(null);
    legacyBeacon.setLastModifiedDate(todaysOffsetDate);

    return legacyBeaconRepository.saveAll(legacyBeacons);
  }

  public Map<String, Long> findHexIdsWithDuplicates() {
    Map<String, Long> hexIdsAndDuplicateCounts = legacyBeaconRepository
      .findByHexIdNotNull()
      .stream()
      .collect(groupingBy(LegacyBeacon::getHexId, Collectors.counting()))
      .entrySet()
      .stream()
      .filter(m -> m.getValue() > 1)
      .collect(Collectors.toMap(m -> m.getKey(), m -> m.getValue()));
    return hexIdsAndDuplicateCounts;
  }

  public List<LegacyBeacon> findByHexId(String hexId) {
    return legacyBeaconRepository.findByHexId(hexId);
  }
}
