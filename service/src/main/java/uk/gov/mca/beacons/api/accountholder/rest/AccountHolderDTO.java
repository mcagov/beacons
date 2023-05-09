package uk.gov.mca.beacons.api.accountholder.rest;

import com.fasterxml.jackson.annotation.JsonUnwrapped;
import java.time.OffsetDateTime;
import java.util.UUID;
import javax.validation.constraints.NotNull;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
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

    private UUID id;

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

    private OffsetDateTime createdDate;

    private OffsetDateTime lastModifiedDate;
  }
}
