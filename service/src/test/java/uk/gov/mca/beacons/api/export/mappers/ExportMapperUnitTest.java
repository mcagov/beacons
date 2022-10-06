package uk.gov.mca.beacons.api.export.mappers;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.nullValue;
import static org.hamcrest.Matchers.startsWith;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

import java.nio.file.Path;
import java.text.SimpleDateFormat;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import org.checkerframework.checker.units.qual.A;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.api.function.Executable;
import org.mockito.stubbing.OngoingStubbing;
import uk.gov.mca.beacons.api.beaconuse.domain.Activity;
import uk.gov.mca.beacons.api.beaconuse.domain.BeaconUse;
import uk.gov.mca.beacons.api.beaconuse.domain.Environment;
import uk.gov.mca.beacons.api.export.rest.*;
import uk.gov.mca.beacons.api.legacybeacon.domain.LegacyUse;
import uk.gov.mca.beacons.api.shared.mappers.person.AddressMapper;

class ExportMapperUnitTest {

  private ExportMapper mapper;

  public ExportMapperUnitTest() {
    mapper = new ExportMapper(new AddressMapper());
  }

  @Test
  public void toLandUse_shouldMapToCertificateLandUseDTOCorrectly() {
    BeaconUse landUse = new BeaconUse();
    landUse.setEnvironment(Environment.LAND);
    landUse.setActivity(Activity.DRIVING);
    landUse.setMaxCapacity(55);
    landUse.setAreaOfOperation("I'm here!");
    landUse.setOtherCommunicationValue("Tin can and string");

    CertificateLandUseDTO use = mapper.toLandUse(landUse);

    assertEquals(use.getEnvironment(), landUse.getEnvironment().toString());
    assertEquals(
      use.getDescriptionOfIntendedUse(),
      landUse.getActivity().toString()
    );
    assertEquals(landUse.getOtherCommunicationValue(), use.getRadioSystem());
    assertEquals(landUse.getMaxCapacity(), use.getNumberOfPersonsOnBoard());
    assertEquals(landUse.getAreaOfOperation(), use.getAreaOfUse());
  }

  @Test
  public void toLandUse_whenNoMaxCapacityIsProvided_shouldThrowNullPointerException() {
    BeaconUse landUse = new BeaconUse();
    landUse.setEnvironment(Environment.LAND);
    landUse.setActivity(Activity.DRIVING);
    landUse.setAreaOfOperation("I'm here!");
    landUse.setOtherCommunicationValue("Tin can and string");

    assertThrows(
      NullPointerException.class,
      () -> {
        CertificateLandUseDTO use = mapper.toLandUse(landUse);
      }
    );
  }

  @Test
  public void toUsesDTO_whenTheGivenUseListHasOneMaritimeUse_shouldMapTheBeaconUseToCertificateMaritimeUseDTO() {
    BeaconUse maritimeUse = new BeaconUse();
    maritimeUse.setEnvironment(Environment.MARITIME);
    maritimeUse.setActivity(Activity.FISHING_VESSEL);
    maritimeUse.setMaxCapacity(55);
    maritimeUse.setAreaOfOperation("Shootin and fishin");
    maritimeUse.setOtherCommunicationValue("Pigeon");

    List<BeaconUse> beaconUses = new ArrayList<>();
    beaconUses.add(maritimeUse);

    List<CertificateUseDTO> useDTOs = mapper.toUsesDTO(beaconUses);
    CertificateMaritimeUseDTO mappedMaritimeUseDTO = (CertificateMaritimeUseDTO) useDTOs.get(
      0
    );

    assertEquals(true, useDTOs.get(0) instanceof CertificateMaritimeUseDTO);
    assertEquals(
      maritimeUse.getEnvironment().toString(),
      mappedMaritimeUseDTO.getEnvironment()
    );
  }

  @Test
  public void toUsesDTO_whenTheGivenUseListHasOneLandUse_shouldMapTheBeaconUseToCertificateLandUseDTO() {
    BeaconUse landUse = new BeaconUse();
    landUse.setEnvironment(Environment.LAND);
    landUse.setActivity(Activity.CLIMBING_MOUNTAINEERING);
    landUse.setMaxCapacity(1);
    landUse.setAreaOfOperation("Adventures");
    landUse.setOtherCommunicationValue("Pigeon");

    List<BeaconUse> beaconUses = new ArrayList<>();
    beaconUses.add(landUse);

    List<CertificateUseDTO> useDTOs = mapper.toUsesDTO(beaconUses);
    CertificateLandUseDTO mappedLandUseDTO = (CertificateLandUseDTO) useDTOs.get(
      0
    );

    assertEquals(true, useDTOs.get(0) instanceof CertificateLandUseDTO);
    assertEquals(
      landUse.getEnvironment().toString(),
      mappedLandUseDTO.getEnvironment()
    );
  }

  @Test
  public void toUsesDTO_whenTheGivenUseListHasOneAviationUse_shouldMapTheBeaconUseToCertificateAviationUseDTO() {
    BeaconUse aviationUse = new BeaconUse();
    aviationUse.setEnvironment(Environment.AVIATION);
    aviationUse.setActivity(Activity.HOT_AIR_BALLOON);
    aviationUse.setMaxCapacity(6);
    aviationUse.setAreaOfOperation("Floating");
    aviationUse.setOtherCommunicationValue("Balloon waves");

    List<BeaconUse> beaconUses = new ArrayList<>();
    beaconUses.add(aviationUse);

    List<CertificateUseDTO> useDTOs = mapper.toUsesDTO(beaconUses);
    CertificateAviationUseDTO mappedAviationUse = (CertificateAviationUseDTO) useDTOs.get(
      0
    );

    assertEquals(true, useDTOs.get(0) instanceof CertificateAviationUseDTO);
    assertEquals(
      aviationUse.getEnvironment().toString(),
      mappedAviationUse.getEnvironment()
    );
  }

  @Test
  public void toUsesDTO_whenTheGivenUseListHasOneOfEachUse_shouldMapTheBeaconUsesToTheCorrectCertificateUseDTOs() {
    BeaconUse aviationUse = new BeaconUse();
    aviationUse.setEnvironment(Environment.AVIATION);
    aviationUse.setActivity(Activity.HOT_AIR_BALLOON);
    aviationUse.setMaxCapacity(6);
    aviationUse.setAreaOfOperation("Floating");
    aviationUse.setOtherCommunicationValue("Balloon waves");

    BeaconUse landUse = new BeaconUse();
    landUse.setEnvironment(Environment.LAND);
    landUse.setActivity(Activity.CLIMBING_MOUNTAINEERING);
    landUse.setMaxCapacity(1);
    landUse.setAreaOfOperation("Adventures");
    landUse.setOtherCommunicationValue("Pigeon");

    BeaconUse maritimeUse = new BeaconUse();
    maritimeUse.setEnvironment(Environment.MARITIME);
    maritimeUse.setActivity(Activity.FISHING_VESSEL);
    maritimeUse.setMaxCapacity(55);
    maritimeUse.setAreaOfOperation("Shootin and fishin");
    maritimeUse.setOtherCommunicationValue("Pigeon");

    List<BeaconUse> beaconUses = new ArrayList<>();
    beaconUses.add(aviationUse);
    beaconUses.add(landUse);
    beaconUses.add(maritimeUse);

    List<CertificateUseDTO> useDTOs = mapper.toUsesDTO(beaconUses);

    assertEquals(true, useDTOs.get(0) instanceof CertificateAviationUseDTO);
    assertEquals(true, useDTOs.get(1) instanceof CertificateLandUseDTO);
    assertEquals(true, useDTOs.get(2) instanceof CertificateMaritimeUseDTO);
  }

  @Test
  public void toLegacyUsesDTO_whenTheGivenUseListHasOneAviationUseWhoseEnvironmentIsEmptyString_shouldMapToGenericLegacyUse() {
    LegacyUse aviationUse = new LegacyUse();
    aviationUse.setUseType("");
    aviationUse.setAircraftType("Glider");
    aviationUse.setMaxPersons(2);
    aviationUse.setAreaOfUse("Gliding");
    aviationUse.setCommunications("Smoke signals");
    aviationUse.setMmsiNumber(3);

    List<LegacyUse> legacyUses = new ArrayList<>();
    legacyUses.add(aviationUse);

    List<CertificateUseDTO> useDTOs = mapper.toLegacyUsesDTO(legacyUses);
    CertificateGenericUseDTO mappedGenericUse = (CertificateGenericUseDTO) useDTOs.get(
      0
    );

    assertEquals(true, useDTOs.get(0) instanceof CertificateGenericUseDTO);
    assertEquals(
      aviationUse.getEnvironment(),
      mappedGenericUse.getEnvironment()
    );
  }
}
