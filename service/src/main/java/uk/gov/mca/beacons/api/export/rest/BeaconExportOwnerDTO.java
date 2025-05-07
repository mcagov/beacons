package uk.gov.mca.beacons.api.export.rest;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonUnwrapped;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
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
  @NotNull
  @JsonProperty("isMain")
  private boolean isMain;

  @Valid
  private String companyName;

  @Valid
  private String careOf;

  @JsonUnwrapped
  private AddressDTO address;

  @Valid
  // format: telephone / alternativeTelephoneNumber / mobiles
  private String telephoneNumbers;

  @Valid
  private String fax;

  @Valid
  private String email;
}
