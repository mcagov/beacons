package uk.gov.mca.beacons.api.export.rest;

import java.time.LocalDateTime;
import javax.validation.Valid;
import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BeaconExportNoteDTO {

  @Valid
  private LocalDateTime date;

  @Valid
  private String note;
}
