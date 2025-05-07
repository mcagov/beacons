package uk.gov.mca.beacons.api.accountholder.rest;

import java.util.UUID;
import javax.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransferBeaconsDTO {

  @NotNull
  private UUID[] beaconIds;

  @NotNull
  private UUID recipientAccountHolderId;
}
