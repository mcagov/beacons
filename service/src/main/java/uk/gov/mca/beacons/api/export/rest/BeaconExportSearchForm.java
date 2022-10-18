package uk.gov.mca.beacons.api.export.rest;

import java.util.Date;
import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BeaconExportSearchForm {

  private String name;
  private Date registrationFrom;
  private Date registrationTo;
  private Date lastModifiedFrom;
  private Date lastModifiedTo;
}
