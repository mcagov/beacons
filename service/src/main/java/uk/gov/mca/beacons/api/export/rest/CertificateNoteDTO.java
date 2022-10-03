package uk.gov.mca.beacons.api.export.rest;

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
  private Date date;

  @Valid
  private String note;
}
