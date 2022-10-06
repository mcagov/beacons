package uk.gov.mca.beacons.api.export.mappers;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.nullValue;
import static org.hamcrest.Matchers.startsWith;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

import java.nio.file.Path;
import java.text.SimpleDateFormat;
import java.time.Instant;
import java.util.Date;
import org.checkerframework.checker.units.qual.A;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.stubbing.OngoingStubbing;
import uk.gov.mca.beacons.api.beaconuse.domain.Activity;
import uk.gov.mca.beacons.api.beaconuse.domain.BeaconUse;
import uk.gov.mca.beacons.api.beaconuse.domain.Environment;
import uk.gov.mca.beacons.api.export.rest.CertificateLandUseDTO;
import uk.gov.mca.beacons.api.export.rest.CertificateUseDTO;
import uk.gov.mca.beacons.api.shared.mappers.person.AddressMapper;

class ExportMapperUnitTest {

  private ExportMapper mapper;

  public ExportMapperUnitTest() {
    mapper = new ExportMapper(new AddressMapper());
  }

  @Test
  public void testThatModernLandUseMapsToCertificateLandUseDTOCorrectly() {
    // given
    BeaconUse landUse = new BeaconUse();
    landUse.setEnvironment(Environment.LAND);
    landUse.setActivity(Activity.DRIVING);
    landUse.setMaxCapacity(55);
    landUse.setAreaOfOperation("I'm here!");
    landUse.setOtherCommunicationValue("Tin can and string");
    //when
    CertificateLandUseDTO use = mapper.toLandUse(landUse);

    //then
    assertEquals(use.getEnvironment(), landUse.getEnvironment().toString());
    assertEquals(
      use.getDescriptionOfIntendedUse(),
      landUse.getActivity().toString()
    );
    assertEquals(use.getRadioSystem(), landUse.getOtherCommunicationValue());
    assertEquals(use.getNumberOfPersonsOnBoard(), landUse.getMaxCapacity());
    assertEquals(use.getAreaOfUse(), landUse.getAreaOfOperation());
  }
}
