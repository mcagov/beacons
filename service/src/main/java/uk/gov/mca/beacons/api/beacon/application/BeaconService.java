package uk.gov.mca.beacons.api.beacon.application;

import static java.util.stream.Collectors.groupingBy;
import static java.util.stream.Collectors.groupingByConcurrent;

import java.util.List;
import java.util.Map;
import java.util.Optional;
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
import uk.gov.mca.beacons.api.exceptions.ResourceNotFoundException;
import uk.gov.mca.beacons.api.mappers.ModelPatcher;
import uk.gov.mca.beacons.api.mappers.ModelPatcherFactory;

@Transactional
@Service("BeaconServiceV2")
public class BeaconService {

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
    return beaconRepository.getByAccountHolderIdAndBeaconStatus(
      accountHolderId,
      BeaconStatus.NEW
    );
  }

  public Optional<Beacon> getByBeaconIdAndAccountHolderIdWhereStatusIsNew(
    BeaconId beaconId,
    AccountHolderId accountHolderId
  ) {
    return beaconRepository.getByIdAndAccountHolderIdAndBeaconStatus(
      beaconId,
      accountHolderId,
      BeaconStatus.NEW
    );
  }

  public Beacon update(BeaconId beaconId, Beacon patch)
    throws ResourceNotFoundException {
    Beacon beacon = beaconRepository
      .findById(beaconId)
      .orElseThrow(ResourceNotFoundException::new);

    final ModelPatcher<Beacon> patcher = getPatcher();

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

  public Map<String, Integer> findHexIdsWithDuplicates(
    int batchSize,
    int numberAlreadyTaken
  ) {
    List<Beacon> batchOfBeacons = getBatch(batchSize, numberAlreadyTaken);

    Map<String, Integer> hexIdsAndDuplicateCounts = batchOfBeacons
      //    Map<String, Integer> hexIdsAndDuplicateCounts = beaconRepository.findAll()
      .stream()
      .collect(groupingBy(Beacon::getHexId, Collectors.counting()))
      .entrySet()
      .stream()
      .filter(m -> m.getValue() > 1)
      .collect(Collectors.toMap(m -> m.getKey(), m -> m.getValue().intValue()));
    return hexIdsAndDuplicateCounts;
  }

  public List<Beacon> getBatch(int batchSize, int numberAlreadyTaken) {
    return beaconRepository
      .findAll()
      .stream()
      .skip(numberAlreadyTaken)
      .limit(batchSize)
      .collect(Collectors.toList());
  }

  public List<Beacon> findByHexId(String hexId) {
    return beaconRepository.findByHexId(hexId);
  }
}
