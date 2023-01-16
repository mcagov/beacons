package uk.gov.mca.beacons.api.export.mappers;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.nullValue;
import static org.junit.Assert.assertNull;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import uk.gov.mca.beacons.api.beacon.domain.Beacon;
import uk.gov.mca.beacons.api.beacon.domain.BeaconStatus;
import uk.gov.mca.beacons.api.beaconuse.domain.Activity;
import uk.gov.mca.beacons.api.beaconuse.domain.BeaconUse;
import uk.gov.mca.beacons.api.beaconuse.domain.Environment;
import uk.gov.mca.beacons.api.beaconuse.domain.Purpose;
import uk.gov.mca.beacons.api.export.rest.*;
import uk.gov.mca.beacons.api.legacybeacon.domain.*;
import uk.gov.mca.beacons.api.registration.domain.Registration;
import uk.gov.mca.beacons.api.shared.mappers.person.AddressMapper;
import uk.gov.mca.beacons.api.utils.BeaconsStringUtils;

class ExportMapperUnitTest {

  private ExportMapper mapper;
  private final DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern(
    "dd/MM/yyyy"
  );

  public ExportMapperUnitTest() {
    mapper = new ExportMapper(new AddressMapper());
  }

  @Test
  public void toLandUse_shouldMapToBeaconExportLandUseDTOCorrectly() {
    BeaconUse landUse = new BeaconUse();
    landUse.setEnvironment(Environment.LAND);
    landUse.setActivity(Activity.DRIVING);
    landUse.setPurpose(Purpose.COMMERCIAL);
    landUse.setMaxCapacity(55);
    landUse.setAreaOfOperation("I'm here!");
    landUse.setOtherCommunication(true);
    landUse.setOtherCommunicationValue("Smoke Signal");
    landUse.setPortableVhfRadio(true);
    landUse.setPortableVhfRadioValue("0123 456");
    landUse.setSatelliteTelephone(false);
    landUse.setMobileTelephone(false);
    landUse.setWindfarmLocation("On a Wind Farm");
    landUse.setRigPlatformLocation("On a Rig Platform");
    landUse.setBeaconPosition("In a field");

    BeaconExportLandUseDTO use = mapper.toLandUse(landUse);

    assertEquals(use.getEnvironment(), landUse.getEnvironment().toString());
    assertEquals(
      use.getDescriptionOfIntendedUse(),
      BeaconsStringUtils.enumAsString(landUse.getActivity())
    );

    assertEquals("Driving (COMMERCIAL)", use.getTypeOfUse());
    assertEquals("On a Wind Farm", use.getWindfarmLocation());
    assertEquals("On a Rig Platform", use.getRigPlatformLocation());
    assertEquals("In a field", use.getBeaconPosition());
    assertEquals(2, use.getRadioSystems().size());
    assertEquals("Smoke Signal", use.getRadioSystems().get("Other"));
    assertEquals(
      "0123 456",
      use.getRadioSystems().get("Portable VHF/DSC Radio")
    );

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

    BeaconExportLandUseDTO mappedLandUseDTO = mapper.toLandUse(landUse);

    assertEquals(0, mappedLandUseDTO.getNumberOfPersonsOnBoard());
  }

  @Test
  public void toUsesDTO_whenTheGivenUseListHasOneMaritimeUse_shouldMapTheBeaconUseToBeaconExportMaritimeUseDTO() {
    BeaconUse maritimeUse = new BeaconUse();
    maritimeUse.setEnvironment(Environment.MARITIME);
    maritimeUse.setActivity(Activity.FISHING_VESSEL);
    maritimeUse.setPurpose(Purpose.PLEASURE);
    maritimeUse.setMaxCapacity(55);
    maritimeUse.setAreaOfOperation("Shootin and fishin");
    maritimeUse.setOtherCommunicationValue("Pigeon");
    maritimeUse.setRigPlatformLocation("Atlantic Ocean");
    maritimeUse.setBeaconPosition("Port Gunwale");

    List<BeaconUse> beaconUses = new ArrayList<>();
    beaconUses.add(maritimeUse);

    List<BeaconExportUseDTO> useDTOs = mapper.toUsesDTO(beaconUses);
    BeaconExportMaritimeUseDTO mappedMaritimeUseDTO = (BeaconExportMaritimeUseDTO) useDTOs.get(
      0
    );

    assertEquals(true, useDTOs.get(0) instanceof BeaconExportMaritimeUseDTO);
    assertEquals(
      maritimeUse.getEnvironment().toString(),
      mappedMaritimeUseDTO.getEnvironment()
    );

    assertEquals(
      "Fishing Vessel (PLEASURE)",
      mappedMaritimeUseDTO.getTypeOfUse()
    );
    assertEquals(
      "Atlantic Ocean",
      mappedMaritimeUseDTO.getRigPlatformLocation()
    );
    assertEquals("Port Gunwale", mappedMaritimeUseDTO.getBeaconPosition());
  }

  @Test
  public void toUsesDTO_whenTheGivenUseListHasOneLandUse_shouldMapTheBeaconUseToBeaconExportLandUseDTO() {
    BeaconUse landUse = new BeaconUse();
    landUse.setEnvironment(Environment.LAND);
    landUse.setActivity(Activity.CLIMBING_MOUNTAINEERING);
    landUse.setMaxCapacity(1);
    landUse.setAreaOfOperation("Adventures");
    landUse.setOtherCommunicationValue("Pigeon");

    List<BeaconUse> beaconUses = new ArrayList<>();
    beaconUses.add(landUse);

    List<BeaconExportUseDTO> useDTOs = mapper.toUsesDTO(beaconUses);
    BeaconExportLandUseDTO mappedLandUseDTO = (BeaconExportLandUseDTO) useDTOs.get(
      0
    );

    assertEquals(true, useDTOs.get(0) instanceof BeaconExportLandUseDTO);
    assertEquals(
      landUse.getEnvironment().toString(),
      mappedLandUseDTO.getEnvironment()
    );
  }

  @Test
  public void toUsesDTO_whenTheGivenUseListHasOneAviationUse_shouldMapTheBeaconUseToBeaconExportAviationUseDTO() {
    BeaconUse aviationUse = new BeaconUse();
    aviationUse.setEnvironment(Environment.AVIATION);
    aviationUse.setActivity(Activity.HOT_AIR_BALLOON);
    aviationUse.setMaxCapacity(6);
    aviationUse.setAreaOfOperation("Floating");
    aviationUse.setOtherCommunicationValue("Balloon waves");
    aviationUse.setBeaconPosition("Left wing");
    aviationUse.setPurpose(Purpose.PLEASURE);
    aviationUse.setHexAddress("H3XADDR");
    aviationUse.setAircraftManufacturer("Cameron Balloons");

    List<BeaconUse> beaconUses = new ArrayList<>();
    beaconUses.add(aviationUse);

    List<BeaconExportUseDTO> useDTOs = mapper.toUsesDTO(beaconUses);
    BeaconExportAviationUseDTO mappedAviationUse = (BeaconExportAviationUseDTO) useDTOs.get(
      0
    );

    assertEquals(true, useDTOs.get(0) instanceof BeaconExportAviationUseDTO);
    assertEquals(
      aviationUse.getEnvironment().toString(),
      mappedAviationUse.getEnvironment()
    );

    assertEquals("H3XADDR", mappedAviationUse.getTwentyFourBitAddressInHex());
    assertEquals(
      "Hot Air Balloon (PLEASURE)",
      mappedAviationUse.getTypeOfUse()
    );
    assertEquals("Left wing", mappedAviationUse.getBeaconPosition());
    assertEquals(
      "Cameron Balloons",
      mappedAviationUse.getAircraftManufacturer()
    );
  }

  @Test
  public void toUsesDTO_whenTheGivenUseListHasOneOfEachUse_shouldMapTheBeaconUsesToTheCorrectBeaconExportUseDTOs() {
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

    List<BeaconExportUseDTO> useDTOs = mapper.toUsesDTO(beaconUses);

    assertEquals(true, useDTOs.get(0) instanceof BeaconExportAviationUseDTO);
    assertEquals(true, useDTOs.get(1) instanceof BeaconExportLandUseDTO);
    assertEquals(true, useDTOs.get(2) instanceof BeaconExportMaritimeUseDTO);
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

    List<BeaconExportUseDTO> useDTOs = mapper.toLegacyUsesDTO(legacyUses);
    BeaconExportGenericUseDTO mappedGenericUse = (BeaconExportGenericUseDTO) useDTOs.get(
      0
    );

    assertEquals(true, useDTOs.get(0) instanceof BeaconExportGenericUseDTO);
    assertEquals(
      aviationUse.getEnvironment(),
      mappedGenericUse.getEnvironment()
    );
  }

  @Test
  public void toLegacyUsesDTO_whenTheGivenUseListHasOneMaritimeUseWhoseEnvironmentContainsWhitespace_shouldMapToBeaconExportMaritimeUseDTO() {
    LegacyUse maritimeUse = new LegacyUse();
    maritimeUse.setUseType("maritime ");
    maritimeUse.setVesselType("Dinghy");
    maritimeUse.setMaxPersons(10);
    maritimeUse.setAreaOfUse("Gliding");
    maritimeUse.setCommunications("Smoke signals");
    maritimeUse.setMmsiNumber(3);

    List<LegacyUse> legacyUses = new ArrayList<>();
    legacyUses.add(maritimeUse);

    List<BeaconExportUseDTO> useDTOs = mapper.toLegacyUsesDTO(legacyUses);
    BeaconExportMaritimeUseDTO mappedMaritimeUse = (BeaconExportMaritimeUseDTO) useDTOs.get(
      0
    );

    assertEquals(true, useDTOs.get(0) instanceof BeaconExportMaritimeUseDTO);
    assertEquals(
      maritimeUse.getEnvironment(),
      mappedMaritimeUse.getEnvironment()
    );
  }

  @Test
  public void toLegacyOwnerDTO_whenTheGivenLegacyGenericOwnerIsValid_shouldMapToBeaconExportOwnerDTO() {
    LegacyGenericOwner legacyOwner = new LegacyGenericOwner();
    legacyOwner.setOwnerName("Pharoah Sanders");
    legacyOwner.setPhone1("02833746199");
    legacyOwner.setPhone2("01477263499");
    legacyOwner.setMobile1("07899122344");
    legacyOwner.setMobile2("07344511288");
    legacyOwner.setAddress1("Jazz House");
    legacyOwner.setAddress2("Jazz Land");

    BeaconExportOwnerDTO mappedOwnerDTO = mapper.toLegacyOwnerDTO(legacyOwner);

    assertEquals(legacyOwner.getOwnerName(), mappedOwnerDTO.getOwnerName());
    assertEquals(
      "02833746199 - 01477263499 - 07899122344 - 07344511288",
      mappedOwnerDTO.getTelephoneNumbers()
    );
  }

  @Test
  public void toLegacyOwnerDTO_whenTheGivenLegacyGenericOwnersMobilesAreEmptyString_shouldMapToBeaconExportOwnerDTO() {
    LegacyGenericOwner legacyOwner = new LegacyGenericOwner();
    legacyOwner.setOwnerName("Pharoah Sanders");
    legacyOwner.setPhone1("02833746199");
    legacyOwner.setPhone2("01477263499");
    legacyOwner.setMobile1("");
    legacyOwner.setMobile2("");
    legacyOwner.setAddress1("Jazz House");
    legacyOwner.setAddress2("Jazz Land");

    BeaconExportOwnerDTO mappedOwnerDTO = mapper.toLegacyOwnerDTO(legacyOwner);

    assertEquals(legacyOwner.getOwnerName(), mappedOwnerDTO.getOwnerName());
    assertEquals(
      "02833746199 - 01477263499",
      mappedOwnerDTO.getTelephoneNumbers()
    );
    Assertions.assertNull(mappedOwnerDTO.getMobiles());
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

    assertEquals(
      OffsetDateTime.now().format(dateFormatter),
      mappedLabelDTO.getProofOfRegistrationDate()
    );
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
    legacyUse.setIsMain("Yes");
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
