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
import uk.gov.mca.beacons.api.export.rest.*;
import uk.gov.mca.beacons.api.legacybeacon.domain.*;
import uk.gov.mca.beacons.api.registration.domain.Registration;
import uk.gov.mca.beacons.api.shared.mappers.person.AddressMapper;
import uk.gov.mca.beacons.api.shared.rest.person.dto.AddressDTO;

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
  public void toLandUse_whenNoMaxCapacityIsProvided_shouldMapMaxCapacityTo0() {
    BeaconUse landUse = new BeaconUse();
    landUse.setEnvironment(Environment.LAND);
    landUse.setActivity(Activity.DRIVING);
    landUse.setAreaOfOperation("I'm here!");
    landUse.setOtherCommunicationValue("Tin can and string");

    CertificateLandUseDTO mappedLandUseDTO = mapper.toLandUse(landUse);

    assertEquals(0, mappedLandUseDTO.getNumberOfPersonsOnBoard());
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

  @Test
  public void toLegacyUsesDTO_whenTheGivenUseListHasOneMaritimeUseWhoseEnvironmentContainsWhitespace_shouldMapToCertificateMaritimeUseDTO() {
    LegacyUse maritimeUse = new LegacyUse();
    maritimeUse.setUseType("maritime ");
    maritimeUse.setVesselType("Dinghy");
    maritimeUse.setMaxPersons(10);
    maritimeUse.setAreaOfUse("Gliding");
    maritimeUse.setCommunications("Smoke signals");
    maritimeUse.setMmsiNumber(3);

    List<LegacyUse> legacyUses = new ArrayList<>();
    legacyUses.add(maritimeUse);

    List<CertificateUseDTO> useDTOs = mapper.toLegacyUsesDTO(legacyUses);
    CertificateMaritimeUseDTO mappedMaritimeUse = (CertificateMaritimeUseDTO) useDTOs.get(
      0
    );

    assertEquals(true, useDTOs.get(0) instanceof CertificateMaritimeUseDTO);
    assertEquals(
      maritimeUse.getEnvironment(),
      mappedMaritimeUse.getEnvironment()
    );
  }

  @Test
  public void toLegacyOwnerDTO_whenTheGivenLegacyGenericOwnerIsValid_shouldMapToCertificateOwnerDTO() {
    LegacyGenericOwner legacyOwner = new LegacyGenericOwner();
    legacyOwner.setOwnerName("Pharoah Sanders");
    legacyOwner.setPhone1("02833746199");
    legacyOwner.setPhone2("01477263499");
    legacyOwner.setMobile1("07899122344");
    legacyOwner.setMobile2("07344511288");
    legacyOwner.setAddress1("Jazz House");
    legacyOwner.setAddress2("Jazz Land");

    CertificateOwnerDTO mappedOwnerDTO = mapper.toLegacyOwnerDTO(legacyOwner);

    assertEquals(legacyOwner.getOwnerName(), mappedOwnerDTO.getOwnerName());
    assertEquals(
      "02833746199 / 01477263499",
      mappedOwnerDTO.getTelephoneNumbers()
    );
    assertEquals("07899122344 / 07344511288", mappedOwnerDTO.getMobiles());
  }

  @Test
  public void toLegacyOwnerDTO_whenTheGivenLegacyGenericOwnersMobilesAreEmptyString_shouldMapToCertificateOwnerDTO() {
    LegacyGenericOwner legacyOwner = new LegacyGenericOwner();
    legacyOwner.setOwnerName("Pharoah Sanders");
    legacyOwner.setPhone1("02833746199");
    legacyOwner.setPhone2("01477263499");
    legacyOwner.setMobile1("");
    legacyOwner.setMobile2("");
    legacyOwner.setAddress1("Jazz House");
    legacyOwner.setAddress2("Jazz Land");

    CertificateOwnerDTO mappedOwnerDTO = mapper.toLegacyOwnerDTO(legacyOwner);

    assertEquals(legacyOwner.getOwnerName(), mappedOwnerDTO.getOwnerName());
    assertEquals(
      "02833746199 / 01477263499",
      mappedOwnerDTO.getTelephoneNumbers()
    );
    assertEquals("", mappedOwnerDTO.getMobiles());
  }

  @Test
  public void toLabelDTO_whenTheGivenRegistrationHasNoLastModifiedDate_shouldMapProofOfRegistrationDateAsDefaultDate() {
    Registration registration = new Registration();
    Beacon beacon = new Beacon();
    BeaconUse mainUse = new BeaconUse();
    ArrayList<BeaconUse> uses = new ArrayList<>();

    beacon.setBeaconStatus(BeaconStatus.DELETED);
    beacon.setBeaconType("LAND");
    beacon.setCoding("1246483935");
    beacon.setManufacturer("HONDA");

    mainUse.setMainUse(true);
    mainUse.setBeaconLocation("In my backpack");
    mainUse.setEnvironment(Environment.LAND);
    uses.add(mainUse);

    registration.setBeacon(beacon);
    registration.setBeaconUses(uses);

    LabelDTO mappedLabelDTO = mapper.toLabelDTO(registration);

    assertEquals(null, mappedLabelDTO.getProofOfRegistrationDate());
  }

  @Test
  public void toLabelDTO_whenTheGivenRegistrationIsValid_shouldMapToLabelDTO() {
    Registration registration = new Registration();
    Beacon beacon = new Beacon();
    BeaconUse mainUse = new BeaconUse();
    ArrayList<BeaconUse> uses = new ArrayList<BeaconUse>();

    beacon.setBeaconStatus(BeaconStatus.DELETED);
    beacon.setBeaconType("LAND");
    beacon.setCoding("1246483935");
    beacon.setManufacturer("HONDA");
    beacon.setHexId("1DHF648485N");

    mainUse.setMainUse(true);
    mainUse.setBeaconLocation("In my backpack");
    mainUse.setEnvironment(Environment.LAND);
    uses.add(mainUse);

    registration.setBeacon(beacon);
    registration.setBeaconUses(uses);

    LabelDTO mappedLabelDTO = mapper.toLabelDTO(registration);

    assertEquals("+44 (0)1326 317575", mappedLabelDTO.getMcaContactNumber());
    assertEquals(mainUse.getName(), mappedLabelDTO.getBeaconUse());
    assertEquals(beacon.getHexId(), mappedLabelDTO.getHexId());
    assertEquals(beacon.getCoding(), mappedLabelDTO.getCoding());
  }

  @Test
  public void toLegacyLabelDTO_whenTheGivenRegistrationIsValid_shouldMapToLabelDTO() {
    LegacyBeacon legacyBeacon = new LegacyBeacon();
    LegacyUse legacyUse = new LegacyUse();
    ArrayList<LegacyUse> legacyUses = new ArrayList<LegacyUse>();
    LegacyData legacyData = new LegacyData();
    LegacyBeaconDetails legacyBeaconDetails = new LegacyBeaconDetails();

    legacyBeaconDetails.setBeaconType("AVIATION");
    legacyBeaconDetails.setCoding("738248246");

    legacyData.setBeacon(legacyBeaconDetails);

    legacyBeacon.setData(legacyData);
    legacyBeacon.setHexId("1DHF74UBFBF");
    legacyBeacon.setLastModifiedDate(OffsetDateTime.now());

    legacyUse.setAircraftRegistrationMark("Spitfire");
    legacyUses.add(legacyUse);
    legacyData.setUses(legacyUses);

    DateTimeFormatter dtf = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    LabelDTO mappedLegacyLabelDTO = mapper.toLegacyLabelDTO(legacyBeacon);

    assertEquals(
      "+44 (0)1326 317575",
      mappedLegacyLabelDTO.getMcaContactNumber()
    );
    assertEquals(legacyUse.getName(), mappedLegacyLabelDTO.getBeaconUse());
    assertEquals(legacyBeacon.getHexId(), mappedLegacyLabelDTO.getHexId());
    assertEquals(
      legacyBeaconDetails.getCoding(),
      mappedLegacyLabelDTO.getCoding()
    );
    assertEquals(
      legacyBeacon.getLastModifiedDate().format(dtf),
      mappedLegacyLabelDTO.getProofOfRegistrationDate()
    );
  }
}
