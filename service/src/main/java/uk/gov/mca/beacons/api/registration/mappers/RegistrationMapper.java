package uk.gov.mca.beacons.api.registration.mappers;

import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import uk.gov.mca.beacons.api.accountholder.mappers.AccountHolderMapper;
import uk.gov.mca.beacons.api.beacon.mappers.BeaconMapper;
import uk.gov.mca.beacons.api.beaconowner.mappers.BeaconOwnerMapper;
import uk.gov.mca.beacons.api.beaconuse.mappers.BeaconUseMapper;
import uk.gov.mca.beacons.api.emergencycontact.mappers.EmergencyContactMapper;
import uk.gov.mca.beacons.api.export.mappers.ExportMapper;
import uk.gov.mca.beacons.api.note.mappers.NoteMapper;
import uk.gov.mca.beacons.api.registration.domain.Registration;
import uk.gov.mca.beacons.api.registration.rest.CreateRegistrationDTO;
import uk.gov.mca.beacons.api.registration.rest.RegistrationDTO;

@Component("RegistrationMapperV2")
public class RegistrationMapper {

  private final BeaconMapper beaconMapper;
  private final BeaconUseMapper beaconUseMapper;
  private final BeaconOwnerMapper beaconOwnerMapper;
  private final AccountHolderMapper accountHolderMapper;
  private final EmergencyContactMapper emergencyContactMapper;
  private final NoteMapper noteMapper;
  private final ExportMapper certificateMapper;

  @Autowired
  public RegistrationMapper(
    BeaconMapper beaconMapper,
    BeaconUseMapper beaconUseMapper,
    BeaconOwnerMapper beaconOwnerMapper,
    AccountHolderMapper accountHolderMapper,
    EmergencyContactMapper emergencyContactMapper,
    NoteMapper noteMapper,
    ExportMapper certificateMapper
  ) {
    this.beaconMapper = beaconMapper;
    this.beaconUseMapper = beaconUseMapper;
    this.beaconOwnerMapper = beaconOwnerMapper;
    this.accountHolderMapper = accountHolderMapper;
    this.emergencyContactMapper = emergencyContactMapper;
    this.noteMapper = noteMapper;
    this.certificateMapper = certificateMapper;
  }

  public Registration fromDTO(CreateRegistrationDTO dto) {
    return Registration
      .builder()
      .beacon(beaconMapper.fromDTO(dto.getCreateBeaconDTO()))
      .beaconUses(
        dto
          .getCreateBeaconUseDTOs()
          .stream()
          .map(beaconUseMapper::fromDTO)
          .collect(Collectors.toList())
      )
      .beaconOwner(beaconOwnerMapper.fromDTO(dto.getCreateBeaconOwnerDTO()))
      .emergencyContacts(
        dto
          .getCreateEmergencyContactDTOs()
          .stream()
          .map(emergencyContactMapper::fromDTO)
          .collect(Collectors.toList())
      )
      .build();
  }

  public RegistrationDTO toDTO(Registration registration) {
    return RegistrationDTO
      .builder()
      .beaconDTO(beaconMapper.toRegistrationDTO(registration.getBeacon()))
      .beaconOwnerDTO(
        // special case for handling deleted beacon owners, this won't be necessary with a resource oriented API
        registration.getBeaconOwner() == null
          ? null
          : beaconOwnerMapper.toDTO(registration.getBeaconOwner())
      )
      .accountHolderDTO(
        registration.getAccountHolder() == null
          ? null
          : accountHolderMapper.toDTO(registration.getAccountHolder())
      )
      .beaconUseDTOs(
        registration
          .getBeaconUses()
          .stream()
          .map(beaconUseMapper::toDTO)
          .collect(Collectors.toList())
      )
      .emergencyContactDTOs(
        registration
          .getEmergencyContacts()
          .stream()
          .map(emergencyContactMapper::toDTO)
          .collect(Collectors.toList())
      )
      .build();
  }
}
