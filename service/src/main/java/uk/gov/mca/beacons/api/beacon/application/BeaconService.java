package uk.gov.mca.beacons.api.beacon.application;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.auditing.AuditingHandler;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.mca.beacons.api.accountholder.domain.AccountHolderId;
import uk.gov.mca.beacons.api.beacon.domain.Beacon;
import uk.gov.mca.beacons.api.beacon.domain.BeaconId;
import uk.gov.mca.beacons.api.beacon.domain.BeaconRepository;
import uk.gov.mca.beacons.api.beacon.domain.BeaconStatus;
import uk.gov.mca.beacons.api.exceptions.InvalidHexIdException;
import uk.gov.mca.beacons.api.exceptions.ResourceNotFoundException;
import uk.gov.mca.beacons.api.mappers.ModelPatcher;
import uk.gov.mca.beacons.api.mappers.ModelPatcherFactory;

@Transactional
@Service("BeaconServiceV2")
public class BeaconService {

  private static final Pattern VALID_HEX_ID = Pattern.compile(
    "^([0-9A-F]{15}|[0-9A-F]{23})$"
  );

  private final AuditingHandler auditingHandler;
  private final BeaconRepository beaconRepository;
  private final ModelPatcherFactory<Beacon> beaconModelPatcherFactory;

  @Autowired
  BeaconService(
    @SuppressWarnings(
      "SpringJavaInjectionPointsAutowiringInspection"
    ) AuditingHandler auditingHandler,
    BeaconRepository beaconRepository,
    ModelPatcherFactory<Beacon> beaconModelPatcherFactory
  ) {
    this.auditingHandler = auditingHandler;
    this.beaconRepository = beaconRepository;
    this.beaconModelPatcherFactory = beaconModelPatcherFactory;
  }

  public Beacon create(Beacon beacon) {
    beacon.registerCreatedEvent();
    return beaconRepository.save(beacon);
  }

  public Optional<Beacon> findById(BeaconId beacon) {
    return beaconRepository.findById(beacon);
  }

  public List<Beacon> getByAccountHolderId(AccountHolderId accountHolderId) {
    return beaconRepository.getByAccountHolderId(accountHolderId);
  }

  public List<Beacon> getByAccountHolderIdWhereStatusIsNew(
    AccountHolderId accountHolderId
  ) {
    return beaconRepository.getByAccountHolderIdAndBeaconStatusIn(
      accountHolderId,
      Arrays.asList(BeaconStatus.NEW, BeaconStatus.CHANGE)
    );
  }

  public Optional<Beacon> getByBeaconIdAndAccountHolderIdWhereStatusIsNew(
    BeaconId beaconId,
    AccountHolderId accountHolderId
  ) {
    return beaconRepository.getByIdAndAccountHolderIdAndBeaconStatusIn(
      beaconId,
      accountHolderId,
      Arrays.asList(BeaconStatus.NEW, BeaconStatus.CHANGE)
    );
  }

  public List<Beacon> getBatch(int batchSize, int numberAlreadyTaken) {
    return beaconRepository
      .findAll()
      .stream()
      .skip(numberAlreadyTaken)
      .limit(batchSize)
      .collect(Collectors.toList());
  }

  public Beacon update(BeaconId beaconId, Beacon patch)
    throws ResourceNotFoundException {
    return update(beaconId, patch, false);
  }

  public Beacon update(BeaconId beaconId, Beacon patch, boolean updateHexId)
    throws ResourceNotFoundException, InvalidHexIdException {
    Beacon beacon = beaconRepository
      .findById(beaconId)
      .orElseThrow(ResourceNotFoundException::new);

    final ModelPatcher<Beacon> patcher = getPatcher();

    if (updateHexId && patch.getHexId() != null) {
      patch.setHexId(normaliseHexId(patch.getHexId()));
      patcher.withMapping(Beacon::getHexId, Beacon::setHexId);
    }

    beacon.update(patch, patcher);
    auditingHandler.markModified(beacon);

    return beaconRepository.save(beacon);
  }

  public Beacon softDelete(BeaconId beaconId) {
    Beacon beacon = beaconRepository
      .findById(beaconId)
      .orElseThrow(ResourceNotFoundException::new);

    beacon.softDelete();

    return beaconRepository.save(beacon);
  }

  private String normaliseHexId(String hexId) throws InvalidHexIdException {
    final String normalised = hexId.trim().toUpperCase();
    if (!VALID_HEX_ID.matcher(normalised).matches()) {
      throw new InvalidHexIdException();
    }
    return normalised;
  }

  private ModelPatcher<Beacon> getPatcher() {
    return beaconModelPatcherFactory
      .getModelPatcher()
      .withMapping(Beacon::getBatteryExpiryDate, Beacon::setBatteryExpiryDate)
      .withMapping(Beacon::getBeaconStatus, Beacon::setBeaconStatus)
      .withMapping(Beacon::getChkCode, Beacon::setChkCode)
      .withMapping(Beacon::getLastServicedDate, Beacon::setLastServicedDate)
      .withMapping(Beacon::getManufacturer, Beacon::setManufacturer)
      .withMapping(Beacon::getMti, Beacon::setMti)
      .withMapping(Beacon::getSvdr, Beacon::setSvdr)
      .withMapping(Beacon::getCsta, Beacon::setCsta)
      .withMapping(Beacon::getBeaconType, Beacon::setBeaconType)
      .withMapping(Beacon::getProtocol, Beacon::setProtocol)
      .withMapping(Beacon::getCoding, Beacon::setCoding)
      .withMapping(
        Beacon::getManufacturerSerialNumber,
        Beacon::setManufacturerSerialNumber
      )
      .withMapping(Beacon::getModel, Beacon::setModel);
  }

  public List<Beacon> findAll() {
    return beaconRepository.findAll();
  }
}
