package uk.gov.mca.beacons.api.export.rest;

import com.fasterxml.jackson.annotation.JsonUnwrapped;
import javax.validation.Valid;
import lombok.*;
import uk.gov.mca.beacons.api.shared.rest.person.dto.AddressDTO;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BeaconExportOwnerDTO {

  @Valid
  private String ownerName;

  @Valid
  private String companyAgent;

  @Valid
  private String careOf;

  @JsonUnwrapped
  private AddressDTO address;

  @Valid
  // format: telephone / alternativeTelephoneNumber
  private String telephoneNumbers;

  @Valid
  private String mobiles;

  @Valid
  private String email;
}
