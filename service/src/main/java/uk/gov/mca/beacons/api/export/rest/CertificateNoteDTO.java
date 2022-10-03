package uk.gov.mca.beacons.api.export.rest;

import java.time.LocalDateTime;
import java.util.Date;
import javax.validation.Valid;
import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CertificateNoteDTO {

  @Valid
  private LocalDateTime date;

  @Valid
  private String note;
}
