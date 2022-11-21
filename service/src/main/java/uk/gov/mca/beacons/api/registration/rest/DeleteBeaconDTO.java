package uk.gov.mca.beacons.api.registration.rest;

import java.util.UUID;
import javax.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DeleteBeaconDTO {

  private UUID beaconId;
  private UUID accountHolderId;

  @NotNull(message = "Reason for deleting a beacon must be defined")
  private String reason;
}
