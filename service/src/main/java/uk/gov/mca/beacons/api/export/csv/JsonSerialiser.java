package uk.gov.mca.beacons.api.export.csv;

import java.time.format.DateTimeFormatter;
import java.util.List;
import net.minidev.json.JSONArray;
import net.minidev.json.JSONObject;
import uk.gov.mca.beacons.api.emergencycontact.rest.EmergencyContactDTO;
import uk.gov.mca.beacons.api.export.rest.BeaconExportNoteDTO;
import uk.gov.mca.beacons.api.export.rest.BeaconExportOwnerDTO;
import uk.gov.mca.beacons.api.shared.rest.person.dto.AddressDTO;

public class JsonSerialiser {

  private static final DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern(
    "dd-MM-yyyy"
  );

  public static JSONArray mapModernBeaconNotesToJsonArray(
    List<BeaconExportNoteDTO> notes
  ) {
    var jsonArray = new JSONArray();
    for (BeaconExportNoteDTO note : notes) {
      var json = new JSONObject();
      json.put("date created", note.getDate().format(dateFormatter));
      json.put("note", note.getNote().toUpperCase());
      jsonArray.add(json);
    }

    return jsonArray;
  }

  public static JSONArray mapBeaconOwnersToJsonArray(
    List<BeaconExportOwnerDTO> owners
  ) {
    var jsonArray = new JSONArray();
    for (BeaconExportOwnerDTO owner : owners) {
      var json = new JSONObject();
      json.put("owner name", owner.getOwnerName().toUpperCase());
      json.put(
        "company agent",
        owner.getCompanyAgent() != null
          ? owner.getCompanyAgent().toUpperCase()
          : ""
      );
      json.put(
        "care of",
        owner.getCareOf() != null ? owner.getCareOf().toUpperCase() : ""
      );
      json.put("address", mapBeaconOwnerAddressToJson(owner.getAddress()));
      json.put(
        "telephone numbers",
        owner.getTelephoneNumbers().replace('/', ';')
      );
      json.put(
        "mobiles",
        owner.getMobiles() != null ? owner.getMobiles().replace('/', ';') : ""
      );
      json.put(
        "email",
        owner.getEmail() != null ? owner.getEmail().toUpperCase() : ""
      );

      jsonArray.add(json);
    }

    return jsonArray;
  }

  public static JSONObject mapBeaconOwnerAddressToJson(AddressDTO address) {
    var json = new JSONObject();
    json.put(
      "address line 1",
      address.getAddressLine1() != null
        ? address.getAddressLine1().toUpperCase()
        : ""
    );
    json.put(
      "address line 2",
      address.getAddressLine2() != null
        ? address.getAddressLine2().toUpperCase()
        : ""
    );
    json.put(
      "address line 3",
      address.getAddressLine3() != null
        ? address.getAddressLine3().toUpperCase()
        : ""
    );
    json.put(
      "address line 4",
      address.getAddressLine4() != null
        ? address.getAddressLine4().toUpperCase()
        : ""
    );
    json.put(
      "town or city",
      address.getTownOrCity() != null
        ? address.getTownOrCity().toUpperCase()
        : ""
    );
    json.put(
      "postcode",
      address.getPostcode() != null ? address.getPostcode().toUpperCase() : ""
    );
    json.put(
      "county",
      address.getCounty() != null ? address.getCounty().toUpperCase() : ""
    );
    json.put(
      "country",
      address.getCountry() != null ? address.getCountry().toUpperCase() : ""
    );

    return json;
  }

  public static JSONArray mapEmergencyContactsToJsonArray(
    List<EmergencyContactDTO> emergencyContacts
  ) {
    JSONArray jsonArray = new JSONArray();
    for (EmergencyContactDTO emergencyContact : emergencyContacts) {
      var json = new JSONObject();
      json.put("id", emergencyContact.getId());
      json.put("full name", emergencyContact.getFullName().toUpperCase());
      json.put(
        "telephone number",
        emergencyContact.getTelephoneNumber() != null
          ? emergencyContact.getTelephoneNumber().replace('/', ';')
          : ""
      );
      json.put(
        "alternative telephone number",
        emergencyContact.getAlternativeTelephoneNumber() != null
          ? emergencyContact.getAlternativeTelephoneNumber().replace('/', ';')
          : ""
      );
      json.put(
        "beacon id",
        emergencyContact.getBeaconId() != null
          ? emergencyContact.getBeaconId()
          : ""
      );

      jsonArray.add(json);
    }
    return jsonArray;
  }
  // uses
  //  List<CertificateUseDTO> toUsesDTO(List<BeaconUse> uses) {
  //    List<CertificateUseDTO> usesDTO = new ArrayList<>();
  //    for (BeaconUse use : uses) {
  //      switch (use.getEnvironment()) {
  //        case MARITIME:
  //          usesDTO.add(toMaritimeUse(use));
  //          break;
  //        case AVIATION:
  //          usesDTO.add(toAviationUse(use));
  //          break;
  //        case LAND:
  //          usesDTO.add(toLandUse(use));
  //          break;
  //      }
  //    }
  //    return usesDTO;
  //  }
}
