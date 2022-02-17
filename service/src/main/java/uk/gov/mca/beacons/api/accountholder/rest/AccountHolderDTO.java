package uk.gov.mca.beacons.api.accountholder.rest;

import com.fasterxml.jackson.annotation.JsonUnwrapped;
import javax.validation.constraints.NotNull;
import lombok.*;
import uk.gov.mca.beacons.api.dto.DomainDTO;
import uk.gov.mca.beacons.api.shared.rest.person.dto.AddressDTO;

public class AccountHolderDTO extends DomainDTO<AccountHolderDTO.Attributes> {

  private final String type = "accountHolder";

  @Override
  public String getType() {
    return type;
  }

  @Getter
  @Setter
  @Builder
  @NoArgsConstructor
  @AllArgsConstructor
  public static class Attributes {

    @NotNull
    private String authId;

    @NotNull
    private String email;

    @NotNull
    private String fullName;

    private String telephoneNumber;

    private String alternativeTelephoneNumber;

    @JsonUnwrapped
    private AddressDTO addressDTO;
  }
}
