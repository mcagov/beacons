package uk.gov.mca.beacons.api.legacybeacon.application;

import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;
import org.apache.xmlbeans.impl.regex.RegularExpression;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import uk.gov.mca.beacons.api.legacybeacon.domain.*;
import uk.gov.mca.beacons.api.legacybeacon.domain.LegacyBeacon;
import uk.gov.mca.beacons.api.legacybeacon.domain.LegacyBeaconId;
import uk.gov.mca.beacons.api.legacybeacon.domain.LegacyBeaconRepository;

@Transactional
@Slf4j
@Service("LegacyBeaconServiceV2")
public class LegacyBeaconService {

  private final LegacyBeaconRepository legacyBeaconRepository;
  private final DateTimeFormatter dateTimeFormatter =
    DateTimeFormatter.ofPattern("uuuu-MM-dd'T'HH:mm:ss");

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
    if (accountHolderEmail == null || accountHolderEmail.isBlank()) {
      return new ArrayList<>();
    }

    String lowerAccountHolderEmail = accountHolderEmail.toLowerCase();

    return legacyBeaconRepository
      .findByHexId(hexId)
      .stream()
      .filter(
        l ->
          emailMatches(lowerAccountHolderEmail, l.getRecoveryEmail()) ||
          emailMatches(lowerAccountHolderEmail, l.getOwnerEmail())
      )
      .collect(Collectors.toList());
  }

  private boolean emailMatches(
    String lowerAccountHolderEmail,
    String emailToMatch
  ) {
    return (
      emailToMatch != null &&
      emailToMatch.toLowerCase().equals(lowerAccountHolderEmail)
    );
  }

  public LegacyBeacon claim(LegacyBeacon legacyBeacon) {
    if (legacyBeacon.claim()) {
      LegacyBeacon savedLegacyBeacon = legacyBeaconRepository.save(
        legacyBeacon
      );
      log.info("Claimed legacy beacon with HexID {}", legacyBeacon.getHexId());
      return savedLegacyBeacon;
    } else {
      log.info(
        "Legacy beacon with HexID {} has already been claimed",
        legacyBeacon.getHexId()
      );
      return legacyBeacon;
    }
  }

  public void updateRecoveryEmailByBeaconId(
    String recoveryEmail,
    LegacyBeaconId id
  ) {
    LegacyBeacon legacyBeacon = legacyBeaconRepository.getById(id);
    String sanitisedRecoveryEmail = sanitiseRecoveryEmail(recoveryEmail);

    legacyBeacon.setRecoveryEmail(sanitisedRecoveryEmail);

    legacyBeaconRepository.save(legacyBeacon);
  }

  public String sanitiseRecoveryEmail(String recoveryEmail) {
    String maliciousCodePattern = "<(.*)>(.*)<\\/(.*)>";
    RegularExpression maliciousCodeRegex = new RegularExpression(
      maliciousCodePattern
    );

    if (maliciousCodeRegex.matches(recoveryEmail)) {
      recoveryEmail = recoveryEmail.replaceAll(maliciousCodePattern, "");
    }

    recoveryEmail = StringUtils.deleteAny(recoveryEmail, "/\\{}$&");

    return recoveryEmail;
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

    legacyBeaconToDelete.setRecoveryEmail(null);

    return legacyBeaconRepository.save(legacyBeaconToDelete);
  }
}
