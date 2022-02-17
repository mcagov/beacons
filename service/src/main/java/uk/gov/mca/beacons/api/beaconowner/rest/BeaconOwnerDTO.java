package uk.gov.mca.beacons.api.beaconowner.rest;

import com.fasterxml.jackson.annotation.JsonUnwrapped;
import java.time.OffsetDateTime;
import java.util.UUID;
import javax.validation.constraints.NotNull;
import lombok.*;
import uk.gov.mca.beacons.api.shared.rest.person.dto.AddressDTO;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BeaconOwnerDTO {

  @NotNull
  private UUID id;

  @NotNull
  private String fullName;

  @NotNull
  private String email;

  private String telephoneNumber;

  private String alternativeTelephoneNumber;

  @JsonUnwrapped
  private AddressDTO addressDTO;

  private OffsetDateTime createdDate;

  private OffsetDateTime lastModifiedDate;

  @NotNull
  private UUID beaconId;
}
