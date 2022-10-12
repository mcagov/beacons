package uk.gov.mca.beacons.api.export.csv;

import com.fasterxml.jackson.annotation.JsonUnwrapped;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import javax.validation.Valid;
import net.minidev.json.JSONArray;
import net.minidev.json.JSONObject;
import uk.gov.mca.beacons.api.beaconuse.domain.BeaconUse;
import uk.gov.mca.beacons.api.export.rest.CertificateNoteDTO;
import uk.gov.mca.beacons.api.export.rest.CertificateOwnerDTO;
import uk.gov.mca.beacons.api.export.rest.CertificateUseDTO;
import uk.gov.mca.beacons.api.shared.rest.person.dto.AddressDTO;

public class JsonSerialiser {

  private static final DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern(
    "dd/MM/yyyy"
  );

  public static JSONArray mapModernBeaconNotesToJsonArray(
    List<CertificateNoteDTO> notes
  ) {
    var jsonArray = new JSONArray();
    for (CertificateNoteDTO note : notes) {
      var json = new JSONObject();
      json.put("date created", note.getDate().format(dateFormatter));
      json.put("note", note.getNote().toUpperCase());
      jsonArray.add(json);
    }

    return jsonArray;
  }

  public static JSONArray mapModernBeaconOwnersToJsonArray(
    List<CertificateOwnerDTO> owners
  ) {
    var jsonArray = new JSONArray();
    for (CertificateOwnerDTO owner : owners) {
      var json = new JSONObject();
      json.put("owner name", owner.getOwnerName().toUpperCase());
      json.put("company agent", owner.getCompanyAgent().toUpperCase());
      json.put("company agent", owner.getCompanyAgent().toUpperCase());
      json.put("care of", owner.getCareOf().toUpperCase());
      json.put(
        "address",
        mapModernBeaconOwnerAddressToJson(owner.getAddress())
      );
      json.put(
        "telephone numbers",
        owner.getTelephoneNumbers().replace('/', ';')
      );
      json.put("mobiles", owner.getMobiles().replace('/', ';'));
      json.put("email", owner.getEmail().toUpperCase());

      jsonArray.add(json);
    }

    return jsonArray;
  }

  public static JSONObject mapModernBeaconOwnerAddressToJson(
    AddressDTO address
  ) {
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
