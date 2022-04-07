package uk.gov.mca.beacons.api.search.jobs.rest;

import javax.batch.runtime.BatchStatus;
import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class JobOutputDTO {

  private BatchStatus status;
}
