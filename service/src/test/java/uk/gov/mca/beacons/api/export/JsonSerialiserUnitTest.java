package uk.gov.mca.beacons.api.export;

import static org.junit.Assert.assertEquals;

import java.time.LocalDateTime;
import java.time.Month;
import java.util.List;
import net.minidev.json.JSONArray;
import net.minidev.json.JSONObject;
import org.junit.jupiter.api.Test;
import uk.gov.mca.beacons.api.export.rest.*;
import uk.gov.mca.beacons.api.export.xlsx.backup.JsonSerialiser;
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
    assertEquals("28-03-2022", firstMappedNote.get("date created"));
  }

  // legacy notes

  @Test
  public void mapBeaconOwnersToJsonArray_shouldCapitaliseAllSentenceCaseText() {
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
    JSONArray jsonOwnersArray = JsonSerialiser.mapBeaconOwnersToJsonArray(
      owners
    );
    JSONObject firstMappedOwner = (JSONObject) jsonOwnersArray.get(0);

    assertEquals("COCO MARIA", firstMappedOwner.get("owner name"));
    assertEquals("COCOSITOS", firstMappedOwner.get("company agent"));
    assertEquals("HASEEB IQBAL", firstMappedOwner.get("care of"));
    assertEquals("COCOMARIA@GMAIL.COM", firstMappedOwner.get("email"));
  }

  @Test
  public void mapBeaconOwnersToJsonArray_shouldSeparateMultiplePhoneNumbersWithASemicolon() {
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
    JSONArray jsonOwnersArray = JsonSerialiser.mapBeaconOwnersToJsonArray(
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
  public void mapBeaconOwnerAddressToJson_whenAnAddressLineIsNull_shouldReturnEmptyStringForThatLine() {
    AddressDTO ownerAddress = new AddressDTO();

    ownerAddress.setAddressLine1("10 Via Coco");

    JSONObject mappedAddress = JsonSerialiser.mapBeaconOwnerAddressToJson(
      ownerAddress
    );

    assertEquals("", mappedAddress.get("address line 2"));
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

  @Test
  public void mapUsesToJsonArray_whenTheUsesListHasOneLandUseAndOneMaritimeUse_ShouldMapTheCorrectValues() {
    BeaconExportLandUseDTO landUse = new BeaconExportLandUseDTO();
    BeaconExportMaritimeUseDTO maritimeUse = new BeaconExportMaritimeUseDTO();

    landUse.setAreaOfUse("Backpacking");
    landUse.setDescriptionOfIntendedUse("Going on a trip to Thailand");
    landUse.setEnvironment("LAND");
    landUse.setRadioSystem("Vhf");

    List<BeaconExportUseDTO> uses = List.of(landUse, maritimeUse);

    JSONArray mappedUses = JsonSerialiser.mapUsesToJsonArray(uses);
    JSONObject mappedLandUse = (JSONObject) mappedUses.get(0);
    JSONObject mappedMaritimeUse = (JSONObject) mappedUses.get(1);

    assertEquals("BACKPACKING", landUse.getAreaOfUse());
  }
  // uses
  // to maritime use
  // to land use
  // to aviation use
  // to generic use
  // when environment is null/empty string
  // when environment is something weird
  // emerg contacts less imp
}
