package uk.gov.mca.beacons.api.export;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.nullValue;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import uk.gov.mca.beacons.api.export.xlsx.backup.SpreadsheetExportGenerator;

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
