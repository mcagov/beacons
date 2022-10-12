package uk.gov.mca.beacons.api.export;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.nullValue;
import static org.hamcrest.Matchers.startsWith;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

import java.nio.file.Path;
import java.text.SimpleDateFormat;
import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import org.checkerframework.checker.units.qual.A;
import org.hibernate.type.OffsetDateTimeType;
import org.junit.Assert;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.api.function.Executable;
import org.mockito.stubbing.OngoingStubbing;
import uk.gov.mca.beacons.api.beacon.domain.Beacon;
import uk.gov.mca.beacons.api.beacon.domain.BeaconStatus;
import uk.gov.mca.beacons.api.beaconuse.domain.Activity;
import uk.gov.mca.beacons.api.beaconuse.domain.BeaconUse;
import uk.gov.mca.beacons.api.beaconuse.domain.Environment;
import uk.gov.mca.beacons.api.export.csv.SpreadsheetExportGenerator;
import uk.gov.mca.beacons.api.export.mappers.ExportMapper;
import uk.gov.mca.beacons.api.export.rest.*;
import uk.gov.mca.beacons.api.legacybeacon.domain.*;
import uk.gov.mca.beacons.api.registration.domain.Registration;
import uk.gov.mca.beacons.api.shared.mappers.person.AddressMapper;
import uk.gov.mca.beacons.api.shared.rest.person.dto.AddressDTO;

class SpreadsheetExportGeneratorUnitTest {

  private SpreadsheetExportGenerator generator;

  // inject dependencies
  public SpreadsheetExportGeneratorUnitTest() {
    //        generator = new SpreadsheetExportGenerator();
  }
  //    @Test
  //    public void toLandUse_shouldMapToCertificateLandUseDTOCorrectly() {
  //        BeaconUse landUse = new BeaconUse();
  //        landUse.setEnvironment(Environment.LAND);
  //        landUse.setActivity(Activity.DRIVING);
  //        landUse.setMaxCapacity(55);
  //        landUse.setAreaOfOperation("I'm here!");
  //        landUse.setOtherCommunicationValue("Tin can and string");
  //
  //        CertificateLandUseDTO use = mapper.toLandUse(landUse);
  //
  //        assertEquals(use.getEnvironment(), landUse.getEnvironment().toString());
  //        assertEquals(
  //                use.getDescriptionOfIntendedUse(),
  //                landUse.getActivity().toString()
  //        );
  //        assertEquals(landUse.getOtherCommunicationValue(), use.getRadioSystem());
  //        assertEquals(landUse.getMaxCapacity(), use.getNumberOfPersonsOnBoard());
  //        assertEquals(landUse.getAreaOfOperation(), use.getAreaOfUse());
  //    }
}
