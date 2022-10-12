package uk.gov.mca.beacons.api.export;

import static org.junit.Assert.assertEquals;

import java.time.LocalDateTime;
import java.time.Month;
import java.util.List;
import net.minidev.json.JSONArray;
import net.minidev.json.JSONObject;
import org.junit.jupiter.api.Test;
import uk.gov.mca.beacons.api.export.csv.JsonSerialiser;
import uk.gov.mca.beacons.api.export.rest.BeaconExportNoteDTO;
import uk.gov.mca.beacons.api.export.rest.BeaconExportOwnerDTO;
import uk.gov.mca.beacons.api.shared.rest.person.dto.AddressDTO;

public class JsonSerialiserUnitTest {

  @Test
  public void mapModernBeaconNotesToJsonArray_shouldSerialiseListOfCertificateNoteDTOsToJsonArray() {
    BeaconExportNoteDTO note = new BeaconExportNoteDTO();
    note.setDate(LocalDateTime.of(2022, Month.MARCH, 28, 14, 33));

    note.setNote("Breakfast Club Coco");
    List<BeaconExportNoteDTO> notes = List.of(note);
    JSONArray jsonNotesArray = JsonSerialiser.mapModernBeaconNotesToJsonArray(
      notes
    );
    JSONObject firstMappedNote = (JSONObject) jsonNotesArray.get(0);

    assertEquals("BREAKFAST CLUB COCO", firstMappedNote.get("note"));
    assertEquals("28/03/2022", firstMappedNote.get("date created"));
  }

  @Test
  public void mapModernBeaconOwnersToJsonArray_shouldCapitaliseAllSentenceCaseText() {
    BeaconExportOwnerDTO owner = new BeaconExportOwnerDTO();
    AddressDTO ownerAddress = new AddressDTO();

    ownerAddress.setAddressLine1("10 Via Coco");

    owner.setOwnerName("Coco Maria");
    owner.setCompanyAgent("Cocositos");
    owner.setCareOf("Haseeb Iqbal");
    owner.setAddress(ownerAddress);
    owner.setTelephoneNumbers("01577836277 / 01179822366");
    owner.setMobiles("07782146399 / 07344800934 / 07321873457");
    owner.setEmail("cocomaria@gmail.com");

    List<BeaconExportOwnerDTO> owners = List.of(owner);
    JSONArray jsonOwnersArray = JsonSerialiser.mapModernBeaconOwnersToJsonArray(
      owners
    );
    JSONObject firstMappedOwner = (JSONObject) jsonOwnersArray.get(0);

    assertEquals("COCO MARIA", firstMappedOwner.get("owner name"));
    assertEquals("COCOSITOS", firstMappedOwner.get("company agent"));
    assertEquals("HASEEB IQBAL", firstMappedOwner.get("care of"));
    assertEquals("COCOMARIA@GMAIL.COM", firstMappedOwner.get("email"));
  }

  @Test
  public void mapModernBeaconOwnersToJsonArray_shouldSeparateMultiplePhoneNumbersWithASemicolon() {
    BeaconExportOwnerDTO owner = new BeaconExportOwnerDTO();
    AddressDTO ownerAddress = new AddressDTO();

    ownerAddress.setAddressLine1("10 Via Coco");

    owner.setOwnerName("Coco Maria");
    owner.setCompanyAgent("Cocositos");
    owner.setCareOf("Haseeb Iqbal");
    owner.setAddress(ownerAddress);
    owner.setTelephoneNumbers("01577836277 / 01179822366");
    owner.setMobiles("07782146399 / 07344800934 / 07321873457");
    owner.setEmail("cocomaria@gmail.com");

    List<BeaconExportOwnerDTO> owners = List.of(owner);
    JSONArray jsonOwnersArray = JsonSerialiser.mapModernBeaconOwnersToJsonArray(
      owners
    );
    JSONObject firstMappedOwner = (JSONObject) jsonOwnersArray.get(0);

    assertEquals(
      "01577836277 ; 01179822366",
      firstMappedOwner.get("telephone numbers")
    );
    assertEquals(
      "07782146399 ; 07344800934 ; 07321873457",
      firstMappedOwner.get("mobiles")
    );
  }

  @Test
  public void mapModernBeaconOwnerAddressToJson_whenAnAddressLineIsNull_shouldReturnEmptyStringForThatLine() {
    AddressDTO ownerAddress = new AddressDTO();

    ownerAddress.setAddressLine1("10 Via Coco");

    JSONObject mappedAddress = JsonSerialiser.mapModernBeaconOwnerAddressToJson(
      ownerAddress
    );

    assertEquals("", mappedAddress.get("address line 2"));
  }

  @Test
  public void mapModernBeaconOwnerAddressToJson_shouldCapitaliseAllSentenceCaseText() {
    AddressDTO ownerAddress = new AddressDTO();

    ownerAddress.setAddressLine1("10 Via Coco");
    ownerAddress.setAddressLine2("Ciudad de Mexico");
    ownerAddress.setCountry("Mexico");

    JSONObject mappedAddress = JsonSerialiser.mapModernBeaconOwnerAddressToJson(
      ownerAddress
    );

    assertEquals("10 VIA COCO", mappedAddress.get("address line 1"));
    assertEquals("CIUDAD DE MEXICO", mappedAddress.get("address line 2"));
    assertEquals("MEXICO", mappedAddress.get("country"));
  }
}
