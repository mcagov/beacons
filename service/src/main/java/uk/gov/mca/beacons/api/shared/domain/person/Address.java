package uk.gov.mca.beacons.api.shared.domain.person;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import javax.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import uk.gov.mca.beacons.api.shared.domain.base.ValueObject;

@Getter
@Builder
@Embeddable
@NoArgsConstructor
@AllArgsConstructor
public class Address implements ValueObject {

  @Column(name = "address_line_1")
  private String addressLine1;

  @Column(name = "address_line_2")
  private String addressLine2;

  @Column(name = "address_line_3")
  private String addressLine3;

  @Column(name = "address_line_4")
  private String addressLine4;

  @Column(name = "town_or_city")
  private String townOrCity;

  @Column(name = "postcode")
  private String postcode;

  @Column(name = "county")
  private String county;

  @Column(name = "country")
  private String country;
}
