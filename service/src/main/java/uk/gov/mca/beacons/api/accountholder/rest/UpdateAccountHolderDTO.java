package uk.gov.mca.beacons.api.accountholder.rest;

import com.fasterxml.jackson.annotation.JsonUnwrapped;
import lombok.*;
import uk.gov.mca.beacons.api.dto.DomainDTO;
import uk.gov.mca.beacons.api.shared.rest.person.dto.AddressDTO;

/**
 * The shape of this DTO is meant to match the current api contract, it should be updated at a later date to something
 * simpler...
 */
public class UpdateAccountHolderDTO
  extends DomainDTO<UpdateAccountHolderDTO.Attributes> {

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

    private String email;
    private String fullName;
    private String telephoneNumber;
    private String alternativeTelephoneNumber;

    @JsonUnwrapped
    private AddressDTO addressDTO;
  }
}
