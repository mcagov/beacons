package uk.gov.mca.beacons.api.legacybeacon.application;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
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
    List<LegacyBeacon> legacyBeacons = legacyBeaconRepository.findByHexIdAndOwnerEmail(
      hexId,
      email
    );
    legacyBeacons.forEach(LegacyBeacon::softDelete);

    LegacyBeacon legacyBeacon = legacyBeacons.get(0);
    LegacyData legacyBeaconData = legacyBeacon.getData();
    LegacyBeaconDetails legacyDataBeaconDetails = legacyBeaconData.getBeacon();

    LegacyBeaconDetails beaconData = legacyBeaconData.getBeacon();
    beaconData.setIsWithdrawn("Y");
    beaconData.setWithdrawnReason(reasonForDeletion);

    legacyBeaconData.setOwner(new LegacyOwner());
    legacyBeaconData.setUses(new ArrayList<LegacyUse>());
    legacyBeaconData.setEmergencyContact(new LegacyEmergencyContact());
    legacyBeaconData.setSecondaryOwners(new ArrayList<LegacySecondaryOwner>());
    legacyDataBeaconDetails.setNote(null);

    legacyBeacon.setOwnerEmail(null);
    legacyBeacon.setOwnerName(null);
    legacyBeacon.setUseActivities(null);
    legacyBeacon.setLastModifiedDate(OffsetDateTime.now());

    return legacyBeaconRepository.saveAll(legacyBeacons);
  }
}
