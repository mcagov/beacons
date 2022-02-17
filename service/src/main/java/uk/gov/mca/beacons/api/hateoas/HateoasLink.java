package uk.gov.mca.beacons.api.hateoas;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class HateoasLink {

  private final String verb;

  private final String path;
}
