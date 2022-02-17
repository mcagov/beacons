package uk.gov.mca.beacons.api.shared.mappers.person;

import org.springframework.stereotype.Component;
import uk.gov.mca.beacons.api.shared.domain.person.Address;
import uk.gov.mca.beacons.api.shared.rest.person.dto.AddressDTO;

@Component
public class AddressMapper {

  public Address fromDTO(AddressDTO addressDTO) {
    return Address
      .builder()
      .addressLine1(addressDTO.getAddressLine1())
      .addressLine2(addressDTO.getAddressLine2())
      .addressLine3(addressDTO.getAddressLine3())
      .addressLine4(addressDTO.getAddressLine4())
      .townOrCity(addressDTO.getTownOrCity())
      .county(addressDTO.getCounty())
      .postcode(addressDTO.getPostcode())
      .country(addressDTO.getCountry())
      .build();
  }

  public AddressDTO toDTO(Address address) {
    if (address == null) {
      return new AddressDTO("", "", "", "", "", "", "", "");
    }

    return AddressDTO
      .builder()
      .addressLine1(address.getAddressLine1())
      .addressLine2(address.getAddressLine2())
      .addressLine3(address.getAddressLine3())
      .addressLine4(address.getAddressLine4())
      .townOrCity(address.getTownOrCity())
      .county(address.getCounty())
      .postcode(address.getPostcode())
      .country(address.getCountry())
      .build();
  }
}
