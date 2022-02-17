package uk.gov.mca.beacons.api.registration.rest;

import java.util.UUID;
import javax.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DeleteRegistrationDTO {

  private UUID beaconId;
  private UUID userId;

  @NotNull(message = "Reason for deleting a beacon must be defined")
  private String reason;
}
