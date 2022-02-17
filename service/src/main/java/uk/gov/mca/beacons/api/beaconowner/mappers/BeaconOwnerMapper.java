package uk.gov.mca.beacons.api.beaconowner.mappers;

import java.util.Objects;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import uk.gov.mca.beacons.api.beaconowner.domain.BeaconOwner;
import uk.gov.mca.beacons.api.beaconowner.rest.BeaconOwnerDTO;
import uk.gov.mca.beacons.api.beaconowner.rest.CreateBeaconOwnerDTO;
import uk.gov.mca.beacons.api.shared.mappers.person.AddressMapper;

@Component("BeaconOwnerMapperV2")
public class BeaconOwnerMapper {

  private final AddressMapper addressMapper;

  @Autowired
  public BeaconOwnerMapper(AddressMapper addressMapper) {
    this.addressMapper = addressMapper;
  }

  public BeaconOwner fromDTO(CreateBeaconOwnerDTO dto) {
    BeaconOwner beaconOwner = new BeaconOwner();

    beaconOwner.setFullName(dto.getFullName());
    beaconOwner.setEmail(dto.getEmail());
    beaconOwner.setTelephoneNumber(dto.getTelephoneNumber());
    beaconOwner.setAlternativeTelephoneNumber(
      dto.getAlternativeTelephoneNumber()
    );
    beaconOwner.setAddress(addressMapper.fromDTO(dto.getAddressDTO()));

    return beaconOwner;
  }

  public BeaconOwnerDTO toDTO(BeaconOwner beaconOwner) {
    return BeaconOwnerDTO
      .builder()
      .id(Objects.requireNonNull(beaconOwner.getId()).unwrap())
      .fullName(beaconOwner.getFullName())
      .email(beaconOwner.getEmail())
      .telephoneNumber(beaconOwner.getTelephoneNumber())
      .alternativeTelephoneNumber(beaconOwner.getAlternativeTelephoneNumber())
      .addressDTO(addressMapper.toDTO(beaconOwner.getAddress()))
      .createdDate(beaconOwner.getCreatedDate())
      .lastModifiedDate(beaconOwner.getLastModifiedDate())
      .beaconId(beaconOwner.getBeaconId().unwrap())
      .build();
  }
}
