package uk.gov.mca.beacons.api.export;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertThrows;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.swagger.v3.core.util.Json;
import java.time.LocalDateTime;
import java.time.Month;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import net.minidev.json.JSONArray;
import net.minidev.json.JSONObject;
import org.junit.jupiter.api.Test;
import uk.gov.mca.beacons.api.beacon.domain.BeaconId;
import uk.gov.mca.beacons.api.beaconowner.domain.BeaconOwner;
import uk.gov.mca.beacons.api.beaconuse.domain.*;
import uk.gov.mca.beacons.api.beaconuse.mappers.BeaconUseMapper;
import uk.gov.mca.beacons.api.beaconuse.rest.BeaconUseDTO;
import uk.gov.mca.beacons.api.export.rest.*;
import uk.gov.mca.beacons.api.export.xlsx.backup.JsonSerialiser;
import uk.gov.mca.beacons.api.note.domain.Note;
import uk.gov.mca.beacons.api.shared.domain.person.Address;
import uk.gov.mca.beacons.api.shared.rest.person.dto.AddressDTO;

public class JsonSerialiserUnitTest {

  @Test
  public void mapModernBeaconNotesToJsonArray_shouldSerialiseListOfNotesToJsonArray() {
    Note note = new Note();

    note.setText("Breakfast Club Coco");
    note.setFullName("Coco Maria");
    List<Note> notes = List.of(note);
    JSONArray jsonNotesArray = JsonSerialiser.mapModernBeaconNotesToJsonArray(
      notes
    );
    JSONObject firstMappedNote = (JSONObject) jsonNotesArray.get(0);

    assertEquals("BREAKFAST CLUB COCO", firstMappedNote.get("note"));
    assertEquals("COCO MARIA", firstMappedNote.get("noted by"));
  }

  @Test
  public void mapModernBeaconNotesToJsonArray_whenTheNoteTextContainsEllipsis_shouldSerialiseEllipsisAsIs() {
    Note note = new Note();

    note.setText("I love beacons...");
    note.setFullName("Coco Maria");
    List<Note> notes = List.of(note);
    JSONArray jsonNotesArray = JsonSerialiser.mapModernBeaconNotesToJsonArray(
      notes
    );
    JSONObject firstMappedNote = (JSONObject) jsonNotesArray.get(0);

    assertEquals("I LOVE BEACONS...", firstMappedNote.get("note"));
    assertEquals("COCO MARIA", firstMappedNote.get("noted by"));
  }

  @Test
  public void mapModernBeaconOwnersToJsonArray_shouldCapitaliseAllSentenceCaseText() {
    BeaconOwner owner = new BeaconOwner();
    Address ownerAddress = new Address();

    owner.setFullName("Coco Maria");
    owner.setEmail("cocositos@gmail.com");
    owner.setAddress(ownerAddress);
    owner.setEmail("cocomaria@gmail.com");

    List<BeaconOwner> owners = List.of(owner);
    JSONArray jsonOwnersArray = JsonSerialiser.mapModernBeaconOwnersToJsonArray(
      owners
    );
    JSONObject firstMappedOwner = (JSONObject) jsonOwnersArray.get(0);

    assertEquals("COCO MARIA", firstMappedOwner.get("owner name"));
    assertEquals("COCOSITOS@GMAIL.COM", firstMappedOwner.get("email"));
  }

  //  @Test
  //  public void mapModernBeaconOwnersToJsonArray_shouldSeparateMultiplePhoneNumbersWithASemicolon() {
  //    BeaconExportOwnerDTO owner = new BeaconExportOwnerDTO();
  //    AddressDTO ownerAddress = new AddressDTO();
  //
  //    ownerAddress.setAddressLine1("10 Via Coco");
  //
  //    owner.setOwnerName("Coco Maria");
  //    owner.setCompanyName("Cocositos");
  //    owner.setCareOf("Haseeb Iqbal");
  //    owner.setAddress(ownerAddress);
  //    owner.setTelephoneNumbers("01577836277 / 01179822366");
  //    owner.setEmail("cocomaria@gmail.com");
  //
  //    List<BeaconExportOwnerDTO> owners = List.of(owner);
  //    JSONArray jsonOwnersArray = JsonSerialiser.mapBeaconOwnersToJsonArray(
  //      owners
  //    );
  //    JSONObject firstMappedOwner = (JSONObject) jsonOwnersArray.get(0);
  //
  //    assertEquals(
  //      "01577836277 ; 01179822366",
  //      firstMappedOwner.get("telephone numbers")
  //    );
  //  }
  //
  //  @Test
  //  public void mapBeaconOwnersToJsonArray_whenTheOwnersInformationIsBlank_shouldLeaveTheOwnersBlank() {
  //    BeaconExportOwnerDTO blankOwner = new BeaconExportOwnerDTO();
  //    AddressDTO blankOwnerAddress = new AddressDTO();
  //    blankOwner.setAddress(blankOwnerAddress);
  //
  //    List<BeaconExportOwnerDTO> owners = List.of(blankOwner);
  //    JSONArray jsonOwnersArray = JsonSerialiser.mapBeaconOwnersToJsonArray(
  //      owners
  //    );
  //
  //    JSONObject firstMappedOwner = (JSONObject) jsonOwnersArray.get(0);
  //    String stringifiedMappedAddress = firstMappedOwner
  //      .get("address")
  //      .toString();
  //
  //    assertEquals("", firstMappedOwner.get("owner name"));
  //    assertEquals("", firstMappedOwner.get("company name"));
  //    assertEquals("", firstMappedOwner.get("care of"));
  //    assertEquals("", stringifiedMappedAddress);
  //  }
  //
  //  @Test
  //  public void mapBeaconOwnersToJsonArray_whenTheOwnersAddressIsNull_shouldReturnEmptyString() {
  //    BeaconExportOwnerDTO blankOwner = new BeaconExportOwnerDTO();
  //
  //    List<BeaconExportOwnerDTO> owners = List.of(blankOwner);
  //    JSONArray jsonOwnersArray = JsonSerialiser.mapBeaconOwnersToJsonArray(
  //      owners
  //    );
  //
  //    JSONObject firstMappedOwner = (JSONObject) jsonOwnersArray.get(0);
  //
  //    assertEquals("", firstMappedOwner.get("address"));
  //  }
  //
  //  @Test
  //  public void mapBeaconOwnerAddressToString_whenTheAddressIsNull_shouldReturnEmptyJSONObject() {
  //    AddressDTO ownerAddress = null;
  //
  //    String mappedAddress = JsonSerialiser.mapBeaconOwnerAddressToString(
  //      ownerAddress
  //    );
  //
  //    assertEquals("", mappedAddress);
  //  }
  //
  //  @Test
  //  public void mapBeaconOwnerAddressToString_whenTheAddressIsBlank_shouldLeaveTheAddressBlank() {
  //    AddressDTO blankOwnerAddress = new AddressDTO();
  //
  //    String mappedAddress = JsonSerialiser.mapBeaconOwnerAddressToString(
  //      blankOwnerAddress
  //    );
  //
  //    assertEquals("", mappedAddress);
  //  }
  //
  //  @Test
  //  public void mapBeaconOwnerAddressToString_shouldCapitaliseAllSentenceCaseText() {
  //    AddressDTO ownerAddress = new AddressDTO();
  //
  //    ownerAddress.setAddressLine1("10 Via Coco");
  //    ownerAddress.setAddressLine2("Ciudad de Mexico");
  //    ownerAddress.setCountry("Mexico");
  //
  //    String mappedAddress = JsonSerialiser.mapBeaconOwnerAddressToString(
  //      ownerAddress
  //    );
  //
  //    assertEquals("10 VIA COCO-CIUDAD DE MEXICO-MEXICO", mappedAddress);
  //  }

  @Test
  public void mapModernUseToJson_whenTheEnvironmentIsAviation_shouldMapAllAviationFields()
    throws JsonProcessingException {
    BeaconUseMapper beaconUseMapper = new BeaconUseMapper();
    BeaconUse aviationUse = new BeaconUse();

    aviationUse.setRandomId(new BeaconUseId(UUID.randomUUID()));
    aviationUse.setBeaconId(new BeaconId(UUID.randomUUID()));
    aviationUse.setEnvironment(Environment.AVIATION);
    aviationUse.setBeaconLocation("On the nose of my plane");
    aviationUse.setAircraftManufacturer("Boeing");
    aviationUse.setPurpose(Purpose.PLEASURE);
    aviationUse.setActivity(Activity.LIGHT_AIRCRAFT);
    aviationUse.setVhfRadio(true);
    aviationUse.setPortableVhfRadio(true);
    aviationUse.setPortableVhfRadioValue("PORTABLE VHF RADIO");
    aviationUse.setSatelliteTelephone(true);
    aviationUse.setSatelliteTelephoneValue("interplanetary phone");

    BeaconUseDTO aviationUseDTO = beaconUseMapper.toDTO(aviationUse);

    JSONObject mappedUse = JsonSerialiser.mapModernUseToJson(aviationUseDTO);

    assertEquals("LIGHT_AIRCRAFT", mappedUse.get("activity"));
    assertEquals("Boeing", mappedUse.get("aircraftManufacturer"));
    assertEquals("AVIATION", mappedUse.get("environment"));
  }
  // owners: for deleted records, owners is just blank rather than []
  // might be better for them all to be blank to save some bytes
  // uses
  // emergency contacts
}
