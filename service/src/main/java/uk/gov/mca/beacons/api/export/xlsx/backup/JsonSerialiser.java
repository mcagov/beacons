package uk.gov.mca.beacons.api.export.xlsx.backup;

import com.fasterxml.jackson.databind.MapperFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.text.MessageFormat;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import net.minidev.json.JSONArray;
import net.minidev.json.JSONObject;
import org.apache.commons.lang3.StringEscapeUtils;
import uk.gov.mca.beacons.api.beaconuse.domain.BeaconUse;
import uk.gov.mca.beacons.api.emergencycontact.rest.EmergencyContactDTO;
import uk.gov.mca.beacons.api.export.rest.*;
import uk.gov.mca.beacons.api.note.domain.Note;
import uk.gov.mca.beacons.api.shared.rest.person.dto.AddressDTO;
import uk.gov.mca.beacons.api.utils.BeaconsStringUtils;

public class JsonSerialiser {

  private static final DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern(
    "dd-MM-yyyy"
  );

  public static JSONArray mapModernBeaconNotesToJsonArray(List<Note> notes) {
    var jsonArray = new JSONArray();

    if (notes.size() > 0) {
      for (Note note : notes) {
        if (note == null) {
          continue;
        }

        var json = new JSONObject();
        json.put("type of note", note.getType());
        json.put(
          "note",
          BeaconsStringUtils.getUppercaseValueOrEmpty(note.getText())
        );
        json.put(
          "noted by",
          BeaconsStringUtils.getUppercaseValueOrEmpty(note.getFullName())
        );
        json.put(
          "noted by email address",
          BeaconsStringUtils.getUppercaseValueOrEmpty(note.getEmail())
        );
        json.put(
          "date",
          note.getCreatedDate() != null ? note.getCreatedDate().toString() : ""
        );
        jsonArray.add(json);
      }
    }

    return jsonArray;
  }

  public static JSONArray mapBeaconOwnersToJsonArray(
    List<BeaconExportOwnerDTO> owners
  ) {
    var jsonArray = new JSONArray();

    if (owners.size() > 0) {
      for (BeaconExportOwnerDTO owner : owners) {
        if (owner == null) {
          continue;
        }

        var json = new JSONObject();
        json.put(
          "owner name",
          owner.getOwnerName() != null ? owner.getOwnerName().toUpperCase() : ""
        );
        json.put(
          "company name",
          owner.getCompanyName() != null
            ? owner.getCompanyName().toUpperCase()
            : ""
        );
        json.put(
          "care of",
          owner.getCareOf() != null ? owner.getCareOf().toUpperCase() : ""
        );
        json.put(
          "address",
          owner.getAddress() != null
            ? mapBeaconOwnerAddressToString(owner.getAddress())
            : ""
        );
        json.put(
          "telephone numbers",
          owner.getTelephoneNumbers() != null
            ? owner.getTelephoneNumbers().replace('/', ';')
            : ""
        );
        json.put(
          "email",
          owner.getEmail() != null ? owner.getEmail().toUpperCase() : ""
        );

        jsonArray.add(json);
      }
    }

    return jsonArray;
  }

  public static String mapBeaconOwnerAddressToString(AddressDTO address) {
    String amalgamatedAddress = "";

    if (address != null) {
      amalgamatedAddress =
        BeaconsStringUtils
          .getMultipleValuesAsString(
            "-",
            address.getAddressLine1(),
            address.getAddressLine2(),
            address.getAddressLine3(),
            address.getAddressLine4(),
            address.getTownOrCity(),
            address.getPostcode(),
            address.getCounty(),
            address.getCountry()
          )
          .toUpperCase();
    }

    return amalgamatedAddress;
  }

  public static JSONArray mapEmergencyContactsToJsonArray(
    List<EmergencyContactDTO> emergencyContacts
  ) {
    JSONArray jsonArray = new JSONArray();

    if (emergencyContacts.size() > 0) {
      for (EmergencyContactDTO emergencyContact : emergencyContacts) {
        if (emergencyContact == null) {
          continue;
        }

        var json = new JSONObject();
        json.put(
          "full name",
          emergencyContact.getFullName() != null
            ? emergencyContact.getFullName().toUpperCase()
            : ""
        );
        json.put(
          "telephone number",
          emergencyContact.getTelephoneNumber() != null
            ? emergencyContact.getTelephoneNumber().replace('/', ';')
            : ""
        );

        jsonArray.add(json);
      }
    }

    return jsonArray;
  }

  public static JSONArray mapUsesToJsonArray(List<BeaconUse> uses) {
    JSONArray jsonArray = new JSONArray();

    // todo: I don't want to bloat the file by having all
    // fields when some uses only need some fields
    // however, looks like we do want all use fields even if they
    // are irrelevant based on Louise's feedback
    if (uses.size() > 0) {
      for (BeaconUse use : uses) {
        if (use == null) {
          continue;
        }
        jsonArray.add(mapUseToJson(use));
      }
    }

    return jsonArray;
  }

  public static JSONArray mapBeaconExportUsesToJsonArray(
    List<BeaconExportUseDTO> uses
  ) {
    JSONArray jsonArray = new JSONArray();

    // todo: I don't want to bloat the file by having all
    // fields when some uses only need some fields
    // however, looks like we do want all use fields even if they
    // are irrelevant based on Louise's feedback
    if (uses.size() > 0) {
      for (BeaconExportUseDTO use : uses) {
        if (use == null) {
          continue;
        }
        jsonArray.add(mapBeaconExportUseToJson(use));
      }
    }

    return jsonArray;
  }

  // environment specific objects with a common parent BeaconUse which we pass here
  // reflection takes only the relevant properties
  // new specific uses inherit from
  public static JSONObject mapUseToJson(BeaconUse use) {
    JSONObject json = new JSONObject();
    ObjectMapper objectMapper = new ObjectMapper();
    Map<String, Object> useMap = objectMapper.convertValue(use, Map.class);

    json.putAll(useMap);

    return json;
  }

  public static JSONObject mapBeaconExportUseToJson(BeaconExportUseDTO use) {
    JSONObject json = new JSONObject();
    ObjectMapper objectMapper = new ObjectMapper();
    Map<String, Object> useMap = objectMapper.convertValue(use, Map.class);

    json.putAll(useMap);

    return json;
  }
}
