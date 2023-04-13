package uk.gov.mca.beacons.api.legacybeacon.application;

import static java.util.stream.Collectors.groupingBy;

import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.mca.beacons.api.legacybeacon.domain.*;

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

  public Map<String, Integer> findHexIdsWithDuplicates(
    int batchSize,
    int numberAlreadyTaken
  ) {
    Stream<LegacyBeacon> lbsWithHexIds = getBatchWhereHexIdIsNotNull(
      batchSize,
      numberAlreadyTaken
    )
      .stream();

    Map<String, Integer> hexIdsAndDuplicateCounts = lbsWithHexIds
      .collect(groupingBy(LegacyBeacon::getHexId, Collectors.counting()))
      .entrySet()
      .stream()
      .filter(m -> m.getValue() > 1)
      .collect(Collectors.toMap(m -> m.getKey(), m -> m.getValue().intValue()));
    return hexIdsAndDuplicateCounts;
  }

  public List<LegacyBeacon> getBatchWhereHexIdIsNotNull(
    int batchSize,
    int numberAlreadyTaken
  ) {
    Stream<LegacyBeacon> lbs = legacyBeaconRepository
      .findByHexIdNotNull()
      .stream();

    List<LegacyBeacon> listLbs = lbs
      .skip(numberAlreadyTaken)
      .limit(batchSize)
      .collect(Collectors.toList());

    return listLbs;
  }

  public List<LegacyBeacon> findByHexId(String hexId) {
    return legacyBeaconRepository.findByHexId(hexId);
  }
}
