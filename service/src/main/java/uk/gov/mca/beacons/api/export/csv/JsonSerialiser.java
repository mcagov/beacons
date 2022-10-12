package uk.gov.mca.beacons.api.export.csv;

import com.fasterxml.jackson.annotation.JsonUnwrapped;
import java.util.List;
import java.util.Map;
import javax.validation.Valid;
import net.minidev.json.JSONArray;
import net.minidev.json.JSONObject;
import uk.gov.mca.beacons.api.export.rest.CertificateNoteDTO;
import uk.gov.mca.beacons.api.export.rest.CertificateOwnerDTO;
import uk.gov.mca.beacons.api.shared.rest.person.dto.AddressDTO;

public class JsonSerialiser {

  public static JSONArray mapModernBeaconNotesToJson(
    List<CertificateNoteDTO> notes
  ) {
    var jsonArray = new JSONArray();
    for (CertificateNoteDTO note : notes) {
      var json = new JSONObject();
      json.put("date created", note.getDate());
      json.put("note", note.getNote().toUpperCase());
      jsonArray.add(json);
    }

    return jsonArray;
  }

  public static JSONArray mapModernBeaconOwnersToJson(
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

  // want all UK date formats
  // all uppercase
  public static JSONObject mapModernBeaconOwnerAddressToJson(
    AddressDTO address
  ) {
    var json = new JSONObject();
    json.put("owner name", owner.getOwnerName());
    json.put("company agent", owner.getCompanyAgent());
    json.put("company agent", owner.getCompanyAgent());
    json.put("care of", owner.getCareOf());
    json.put("company agent", owner.getCompanyAgent());
    json.put("company agent", owner.getCompanyAgent());
    json.put("company agent", owner.getCompanyAgent());

    return json;
  }

  @JsonUnwrapped
  private AddressDTO address;

  private String addressLine1;
  private String addressLine2;
  private String addressLine3;
  private String addressLine4;
  private String townOrCity;
  private String postcode;
  private String county;
  private String country;

  @Valid
  // format: telephone / alternativeTelephoneNumber
  private String telephoneNumbers;

  @Valid
  private String mobiles;

  @Valid
  private String email;
}
