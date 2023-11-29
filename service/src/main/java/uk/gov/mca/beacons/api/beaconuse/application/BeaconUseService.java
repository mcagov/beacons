package uk.gov.mca.beacons.api.beaconuse.application;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.auditing.AuditingHandler;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.mca.beacons.api.beacon.domain.BeaconId;
import uk.gov.mca.beacons.api.beaconuse.domain.BeaconUse;
import uk.gov.mca.beacons.api.beaconuse.domain.BeaconUseId;
import uk.gov.mca.beacons.api.beaconuse.domain.BeaconUseRepository;
import uk.gov.mca.beacons.api.exceptions.ResourceNotFoundException;
import uk.gov.mca.beacons.api.mappers.ModelPatcher;
import uk.gov.mca.beacons.api.mappers.ModelPatcherFactory;

@Transactional
@Service("BeaconUseServiceV2")
public class BeaconUseService {

  private final BeaconUseRepository beaconUseRepository;
  private final ModelPatcherFactory<BeaconUse> beaconUseModelPatcherFactory;
  private final AuditingHandler auditingHandler;

  @Autowired
  public BeaconUseService(
    BeaconUseRepository beaconUseRepository,
    ModelPatcherFactory<BeaconUse> beaconUseModelPatcherFactory,
    @SuppressWarnings(
      "SpringJavaInjectionPointsAutowiringInspection"
    ) AuditingHandler auditingHandler
  ) {
    this.beaconUseRepository = beaconUseRepository;
    this.beaconUseModelPatcherFactory = beaconUseModelPatcherFactory;
    this.auditingHandler = auditingHandler;
  }

  public List<BeaconUse> createAll(List<BeaconUse> beaconUses) {
    return beaconUseRepository.saveAll(beaconUses);
  }

  public List<BeaconUse> getByBeaconId(BeaconId beaconId) {
    return beaconUseRepository.getBeaconUseByBeaconId(beaconId);
  }

  public BeaconUse getMainUseByBeaconId(BeaconId beaconId) {
    return getByBeaconId(beaconId)
      .stream()
      .filter(bu -> bu != null && Boolean.TRUE.equals(bu.getMainUse()))
      .findFirst()
      .orElse(null);
  }

  public void deleteByBeaconId(BeaconId beaconId) {
    beaconUseRepository.deleteAllByBeaconId(beaconId);
    beaconUseRepository.flush();
  }

  public BeaconUse update(BeaconUseId beaconUseId, BeaconUse patch)
    throws ResourceNotFoundException {
    BeaconUse beaconUse = beaconUseRepository
      .findById(beaconUseId)
      .orElseThrow(ResourceNotFoundException::new);

    final ModelPatcher<BeaconUse> patcher = getPatcher();

    beaconUse.update(patch, patcher);
    auditingHandler.markModified(beaconUse);

    return beaconUseRepository.save(beaconUse);
  }

  //Don't like this, should either be moved or a way found to auto map it
  private ModelPatcher<BeaconUse> getPatcher() {
    return beaconUseModelPatcherFactory
      .getModelPatcher()
      .withMapping(BeaconUse::getEnvironment, BeaconUse::setEnvironment)
      .withMapping(BeaconUse::getPurpose, BeaconUse::setPurpose)
      .withMapping(BeaconUse::getActivity, BeaconUse::setActivity)
      .withMapping(BeaconUse::getOtherActivity, BeaconUse::setOtherActivity)
      .withMapping(BeaconUse::getCallSign, BeaconUse::setCallSign)
      .withMapping(BeaconUse::getVhfRadio, BeaconUse::setVhfRadio)
      .withMapping(BeaconUse::getFixedVhfRadio, BeaconUse::setFixedVhfRadio)
      .withMapping(
        BeaconUse::getFixedVhfRadioValue,
        BeaconUse::setFixedVhfRadioValue
      )
      .withMapping(
        BeaconUse::getPortableVhfRadio,
        BeaconUse::setPortableVhfRadio
      )
      .withMapping(
        BeaconUse::getPortableVhfRadioValue,
        BeaconUse::setPortableVhfRadioValue
      )
      .withMapping(
        BeaconUse::getSatelliteTelephone,
        BeaconUse::setSatelliteTelephone
      )
      .withMapping(
        BeaconUse::getSatelliteTelephoneValue,
        BeaconUse::setSatelliteTelephoneValue
      )
      .withMapping(BeaconUse::getMobileTelephone, BeaconUse::setMobileTelephone)
      .withMapping(
        BeaconUse::getMobileTelephone1,
        BeaconUse::setMobileTelephone1
      )
      .withMapping(
        BeaconUse::getMobileTelephone2,
        BeaconUse::setMobileTelephone2
      )
      .withMapping(
        BeaconUse::getOtherCommunication,
        BeaconUse::setOtherCommunication
      )
      .withMapping(
        BeaconUse::getOtherCommunicationValue,
        BeaconUse::setOtherCommunicationValue
      )
      .withMapping(BeaconUse::getMaxCapacity, BeaconUse::setMaxCapacity)
      .withMapping(BeaconUse::getVesselName, BeaconUse::setVesselName)
      .withMapping(
        BeaconUse::getPortLetterNumber,
        BeaconUse::setPortLetterNumber
      )
      .withMapping(BeaconUse::getHomeport, BeaconUse::setHomeport)
      .withMapping(BeaconUse::getAreaOfOperation, BeaconUse::setAreaOfOperation)
      .withMapping(BeaconUse::getBeaconLocation, BeaconUse::setBeaconLocation)
      .withMapping(BeaconUse::getImoNumber, BeaconUse::setImoNumber)
      .withMapping(BeaconUse::getSsrNumber, BeaconUse::setSsrNumber)
      .withMapping(BeaconUse::getRssNumber, BeaconUse::setRssNumber)
      .withMapping(BeaconUse::getOfficialNumber, BeaconUse::setOfficialNumber)
      .withMapping(
        BeaconUse::getRigPlatformLocation,
        BeaconUse::setRigPlatformLocation
      )
      .withMapping(BeaconUse::getMainUse, BeaconUse::setMainUse)
      .withMapping(
        BeaconUse::getAircraftManufacturer,
        BeaconUse::setAircraftManufacturer
      )
      .withMapping(
        BeaconUse::getPrincipalAirport,
        BeaconUse::setPrincipalAirport
      )
      .withMapping(
        BeaconUse::getSecondaryAirport,
        BeaconUse::setSecondaryAirport
      )
      .withMapping(
        BeaconUse::getRegistrationMark,
        BeaconUse::setRegistrationMark
      )
      .withMapping(BeaconUse::getHexAddress, BeaconUse::setHexAddress)
      .withMapping(BeaconUse::getCnOrMsnNumber, BeaconUse::setCnOrMsnNumber)
      .withMapping(BeaconUse::getDongle, BeaconUse::setDongle)
      .withMapping(BeaconUse::getBeaconPosition, BeaconUse::setBeaconPosition)
      .withMapping(
        BeaconUse::getWorkingRemotelyLocation,
        BeaconUse::setWorkingRemotelyLocation
      )
      .withMapping(
        BeaconUse::getWorkingRemotelyPeopleCount,
        BeaconUse::setWorkingRemotelyPeopleCount
      )
      .withMapping(
        BeaconUse::getWindfarmLocation,
        BeaconUse::setWindfarmLocation
      )
      .withMapping(
        BeaconUse::getWindfarmPeopleCount,
        BeaconUse::setWindfarmPeopleCount
      )
      .withMapping(
        BeaconUse::getOtherActivityLocation,
        BeaconUse::setOtherActivityLocation
      )
      .withMapping(
        BeaconUse::getOtherActivityPeopleCount,
        BeaconUse::setOtherActivityPeopleCount
      )
      .withMapping(BeaconUse::getMoreDetails, BeaconUse::setMoreDetails);
  }
}
