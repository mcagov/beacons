package uk.gov.mca.beacons.api.export;

import static org.junit.Assert.assertEquals;

import io.swagger.v3.core.util.Json;
import java.time.LocalDateTime;
import java.util.List;
import net.minidev.json.JSONArray;
import net.minidev.json.JSONObject;
import org.junit.jupiter.api.Test;
import uk.gov.mca.beacons.api.export.csv.JsonSerialiser;
import uk.gov.mca.beacons.api.export.rest.CertificateDTO;
import uk.gov.mca.beacons.api.export.rest.CertificateNoteDTO;

public class JsonSerialiserUnitTest {

  @Test
  public void mapModernBeaconNotesToJsonString_ShouldSerialiseListOfCertificateNoteDTOsToJsonArray() {
    CertificateNoteDTO note = new CertificateNoteDTO();
    note.setDate(LocalDateTime.now());
    note.setNote("Breakfast Club Coco");
    List<CertificateNoteDTO> notes = List.of(note);
    JSONArray jsonNotesArray = JsonSerialiser.mapModernBeaconNotesToJsonString(
      notes
    );
    JSONObject firstNote = (JSONObject) jsonNotesArray.get(0);

    assertEquals(note.getNote(), firstNote.get("note"));
  }
}
