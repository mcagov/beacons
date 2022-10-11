package uk.gov.mca.beacons.api.legacybeacon.application;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.mca.beacons.api.beacon.domain.Beacon;
import uk.gov.mca.beacons.api.legacybeacon.domain.LegacyBeacon;
import uk.gov.mca.beacons.api.legacybeacon.domain.LegacyBeaconId;
import uk.gov.mca.beacons.api.legacybeacon.domain.LegacyBeaconRepository;
import uk.gov.mca.beacons.api.registration.domain.Registration;

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
      .limit(batchSize)
      .skip(numberAlreadyTaken)
      .collect(Collectors.toList());
  }
}
