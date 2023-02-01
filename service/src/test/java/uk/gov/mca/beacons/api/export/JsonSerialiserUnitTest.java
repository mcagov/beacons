package uk.gov.mca.beacons.api.export;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertThrows;

import io.swagger.v3.core.util.Json;
import java.time.LocalDateTime;
import java.time.Month;
import java.util.List;
import net.minidev.json.JSONArray;
import net.minidev.json.JSONObject;
import org.junit.jupiter.api.Test;
import uk.gov.mca.beacons.api.export.rest.*;
import uk.gov.mca.beacons.api.export.xlsx.backup.JsonSerialiser;
import uk.gov.mca.beacons.api.note.domain.Note;
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
  public void mapBeaconOwnersToJsonArray_shouldCapitaliseAllSentenceCaseText() {
    BeaconExportOwnerDTO owner = new BeaconExportOwnerDTO();
    AddressDTO ownerAddress = new AddressDTO();

    ownerAddress.setAddressLine1("10 Via Coco");

    owner.setOwnerName("Coco Maria");
    owner.setCompanyName("Cocositos");
    owner.setCareOf("Haseeb Iqbal");
    owner.setAddress(ownerAddress);
    owner.setTelephoneNumbers("01577836277 / 01179822366");
    owner.setEmail("cocomaria@gmail.com");

    List<BeaconExportOwnerDTO> owners = List.of(owner);
    JSONArray jsonOwnersArray = JsonSerialiser.mapBeaconOwnersToJsonArray(
      owners
    );
    JSONObject firstMappedOwner = (JSONObject) jsonOwnersArray.get(0);

    assertEquals("COCO MARIA", firstMappedOwner.get("owner name"));
    assertEquals("COCOSITOS", firstMappedOwner.get("company name"));
    assertEquals("HASEEB IQBAL", firstMappedOwner.get("care of"));
    assertEquals("COCOMARIA@GMAIL.COM", firstMappedOwner.get("email"));
  }

  @Test
  public void mapBeaconOwnersToJsonArray_shouldSeparateMultiplePhoneNumbersWithASemicolon() {
    BeaconExportOwnerDTO owner = new BeaconExportOwnerDTO();
    AddressDTO ownerAddress = new AddressDTO();

    ownerAddress.setAddressLine1("10 Via Coco");

    owner.setOwnerName("Coco Maria");
    owner.setCompanyName("Cocositos");
    owner.setCareOf("Haseeb Iqbal");
    owner.setAddress(ownerAddress);
    owner.setTelephoneNumbers("01577836277 / 01179822366");
    owner.setEmail("cocomaria@gmail.com");

    List<BeaconExportOwnerDTO> owners = List.of(owner);
    JSONArray jsonOwnersArray = JsonSerialiser.mapBeaconOwnersToJsonArray(
      owners
    );
    JSONObject firstMappedOwner = (JSONObject) jsonOwnersArray.get(0);

    assertEquals(
      "01577836277 ; 01179822366",
      firstMappedOwner.get("telephone numbers")
    );
  }

  @Test
  public void mapBeaconOwnersToJsonArray_whenTheOwnersInformationIsBlank_shouldLeaveTheOwnersBlank() {
    BeaconExportOwnerDTO blankOwner = new BeaconExportOwnerDTO();
    AddressDTO blankOwnerAddress = new AddressDTO();
    blankOwner.setAddress(blankOwnerAddress);

    List<BeaconExportOwnerDTO> owners = List.of(blankOwner);
    JSONArray jsonOwnersArray = JsonSerialiser.mapBeaconOwnersToJsonArray(
      owners
    );

    JSONObject firstMappedOwner = (JSONObject) jsonOwnersArray.get(0);
    String stringifiedMappedAddress = firstMappedOwner
      .get("address")
      .toString();

    assertEquals("", firstMappedOwner.get("owner name"));
    assertEquals("", firstMappedOwner.get("company name"));
    assertEquals("", firstMappedOwner.get("care of"));
    assertEquals(
      "{\"address line 1\":\"\",\"country\":\"\",\"address line 2\":\"\",\"address line 3\":\"\",\"address line 4\":\"\",\"postcode\":\"\",\"county\":\"\",\"town or city\":\"\"}",
      stringifiedMappedAddress
    );
  }

  @Test
  public void mapBeaconOwnersToJsonArray_whenTheOwnersAddressIsNull_shouldReturnEmptyString() {
    BeaconExportOwnerDTO blankOwner = new BeaconExportOwnerDTO();

    List<BeaconExportOwnerDTO> owners = List.of(blankOwner);
    JSONArray jsonOwnersArray = JsonSerialiser.mapBeaconOwnersToJsonArray(
      owners
    );

    JSONObject firstMappedOwner = (JSONObject) jsonOwnersArray.get(0);

    assertEquals("", firstMappedOwner.get("address"));
  }

  @Test
  public void mapBeaconOwnerAddressToJson_whenAnAddressLineIsNull_shouldReturnEmptyStringForThatLine() {
    AddressDTO ownerAddress = new AddressDTO();

    ownerAddress.setAddressLine1("10 Via Coco");

    JSONObject mappedAddress = JsonSerialiser.mapBeaconOwnerAddressToJson(
      ownerAddress
    );

    assertEquals("", mappedAddress.get("address line 2"));
  }

  @Test
  public void mapBeaconOwnerAddressToJson_whenTheAddressIsBlank_shouldLeaveTheAddressBlank() {
    AddressDTO blankOwnerAddress = new AddressDTO();

    JSONObject mappedAddress = JsonSerialiser.mapBeaconOwnerAddressToJson(
      blankOwnerAddress
    );

    assertEquals("", mappedAddress.get("address"));
  }

  @Test
  public void mapBeaconOwnerAddressToJson_shouldCapitaliseAllSentenceCaseText() {
    AddressDTO ownerAddress = new AddressDTO();

    ownerAddress.setAddressLine1("10 Via Coco");
    ownerAddress.setAddressLine2("Ciudad de Mexico");
    ownerAddress.setCountry("Mexico");

    JSONObject mappedAddress = JsonSerialiser.mapBeaconOwnerAddressToJson(
      ownerAddress
    );

    assertEquals("10 VIA COCO", mappedAddress.get("address line 1"));
    assertEquals("CIUDAD DE MEXICO", mappedAddress.get("address line 2"));
    assertEquals("MEXICO", mappedAddress.get("country"));
  }
  // owners: for deleted records, owners is just blank rather than []
  // might be better for them all to be blank to save some bytes
  // uses
  // emergency contacts
}
