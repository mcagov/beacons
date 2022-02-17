package uk.gov.mca.beacons.api.emergencycontact.mappers;

import java.util.Objects;
import org.springframework.stereotype.Component;
import uk.gov.mca.beacons.api.emergencycontact.domain.EmergencyContact;
import uk.gov.mca.beacons.api.emergencycontact.rest.CreateEmergencyContactDTO;
import uk.gov.mca.beacons.api.emergencycontact.rest.EmergencyContactDTO;

@Component("EmergencyContactMapperV2")
public class EmergencyContactMapper {

  public EmergencyContact fromDTO(CreateEmergencyContactDTO dto) {
    EmergencyContact emergencyContact = new EmergencyContact();
    emergencyContact.setFullName(dto.getFullName());
    emergencyContact.setTelephoneNumber(dto.getTelephoneNumber());
    emergencyContact.setAlternativeTelephoneNumber(
      dto.getAlternativeTelephoneNumber()
    );

    return emergencyContact;
  }

  public EmergencyContactDTO toDTO(EmergencyContact emergencyContact) {
    return EmergencyContactDTO
      .builder()
      .id(Objects.requireNonNull(emergencyContact.getId()).unwrap())
      .fullName(emergencyContact.getFullName())
      .telephoneNumber(emergencyContact.getTelephoneNumber())
      .alternativeTelephoneNumber(
        emergencyContact.getAlternativeTelephoneNumber()
      )
      .beaconId(emergencyContact.getBeaconId().unwrap())
      .build();
  }
}
