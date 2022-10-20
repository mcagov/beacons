package uk.gov.mca.beacons.api.export.xlsx.backup;

import java.time.format.DateTimeFormatter;
import java.util.List;
import net.minidev.json.JSONArray;
import net.minidev.json.JSONObject;
import org.apache.commons.lang3.StringEscapeUtils;
import uk.gov.mca.beacons.api.emergencycontact.rest.EmergencyContactDTO;
import uk.gov.mca.beacons.api.export.rest.*;
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

      jsonArray.add(json);
    }
    return jsonArray;
  }

  public static JSONArray mapUsesToJsonArray(List<BeaconExportUseDTO> uses) {
    JSONArray jsonArray = new JSONArray();
    for (BeaconExportUseDTO use : uses) {
      switch (use.getEnvironment().trim()) {
        case "MARITIME":
          jsonArray.add(mapMaritimeUseToJson((BeaconExportMaritimeUseDTO) use));
          break;
        case "AVIATION":
          jsonArray.add(mapAviationUseToJson((BeaconExportAviationUseDTO) use));
          break;
        case "LAND":
          jsonArray.add(mapLandUseToJson((BeaconExportLandUseDTO) use));
          break;
        case "RIG/PLATFORM":
        case "MOD":
        default:
          jsonArray.add(mapGenericUseToJson((BeaconExportGenericUseDTO) use));
          break;
      }
    }
    return jsonArray;
  }

  public static JSONObject mapMaritimeUseToJson(
    BeaconExportMaritimeUseDTO maritimeUse
  ) {
    JSONObject json = new JSONObject();
    json.appendField("environment", maritimeUse.getEnvironment());
    json.appendField("vessel name", maritimeUse.getVesselName().toUpperCase());
    json.appendField("home port", maritimeUse.getHomePort().toUpperCase());
    json.appendField("vessel", maritimeUse.getVessel().toUpperCase());
    json.appendField(
      "max number of persons on board",
      maritimeUse.getMaxPersonOnBoard()
    );
    json.appendField(
      "vessel callsign",
      maritimeUse.getVesselCallsign().toUpperCase()
    );
    json.appendField("mmsi number", maritimeUse.getMmsiNumber());
    json.appendField(
      "radio system",
      maritimeUse.getRadioSystem() != null
        ? maritimeUse.getRadioSystem().toUpperCase().replace('/', ';')
        : ""
    );
    json.appendField(
      "notes",
      maritimeUse.getNotes() != null
        ? StringEscapeUtils.escapeCsv(maritimeUse.getNotes().toUpperCase())
        : ""
    );
    json.appendField(
      "fishing vessel port id and numbers",
      maritimeUse.getFishingVesselPortIdAndNumbers()
    );
    json.appendField("official number", maritimeUse.getOfficialNumber());
    json.appendField("imo number", maritimeUse.getImoNumber());
    // might need ot replace slash
    json.appendField("rss and ssr number", maritimeUse.getRssAndSsrNumber());
    json.appendField("hull id number", maritimeUse.getHullIdNumber());
    json.appendField(
      "coastguard cg ref number",
      maritimeUse.getCoastguardCGRefNumber()
    );

    return json;
  }

  public static JSONObject mapAviationUseToJson(
    BeaconExportAviationUseDTO aviationUse
  ) {
    JSONObject json = new JSONObject();
    json.put("environment", aviationUse.getEnvironment());
    json.put("aircraft type", aviationUse.getAircraftType().toUpperCase());
    json.put(
      "max number of persons on board",
      aviationUse.getMaxPersonOnBoard()
    );
    json.put(
      "aircraft registration mark",
      aviationUse.getAircraftRegistrationMark()
    );
    json.put(
      "twenty four bit address in hex",
      aviationUse.getTwentyFourBitAddressInHex()
    );
    json.put(
      "principal airport",
      aviationUse.getPrincipalAirport().toUpperCase()
    );
    json.put(
      "radio system",
      aviationUse.getRadioSystem() != null
        ? aviationUse.getRadioSystem().toUpperCase().replace('/', ';')
        : ""
    );
    json.put(
      "aircraft operators designator and serial no",
      aviationUse.getAircraftOperatorsDesignatorAndSerialNo()
    );
    json.put(
      "notes",
      aviationUse.getNotes() != null
        ? StringEscapeUtils.escapeCsv(aviationUse.getNotes().toUpperCase())
        : ""
    );

    return json;
  }

  public static JSONObject mapLandUseToJson(BeaconExportLandUseDTO landUse) {
    JSONObject json = new JSONObject();
    json.put("environment", landUse.getEnvironment());
    json.put(
      "description of intended use",
      landUse.getDescriptionOfIntendedUse().toUpperCase()
    );
    json.put(
      "max number of persons on board",
      landUse.getNumberOfPersonsOnBoard()
    );
    json.put(
      "area of use",
      landUse.getAreaOfUse() != null ? landUse.getAreaOfUse().toUpperCase() : ""
    );
    json.put(
      "trip information",
      landUse.getTripInformation() != null
        ? landUse.getTripInformation().toUpperCase()
        : ""
    );
    json.put(
      "radio system",
      landUse.getRadioSystem() != null
        ? landUse.getRadioSystem().toUpperCase().replace('/', ';')
        : ""
    );
    json.put(
      "notes",
      landUse.getNotes() != null
        ? StringEscapeUtils.escapeCsv(landUse.getNotes().toUpperCase())
        : ""
    );

    return json;
  }

  public static JSONObject mapGenericUseToJson(
    BeaconExportGenericUseDTO genericUse
  ) {
    JSONObject json = new JSONObject();
    json.put("environment", genericUse.getEnvironment());
    json.put(
      "vessel name",
      genericUse.getVesselName() != null
        ? genericUse.getVesselName().toUpperCase()
        : ""
    );
    json.put(
      "home port",
      genericUse.getHomePort() != null
        ? genericUse.getHomePort().toUpperCase()
        : ""
    );
    json.put(
      "vessel",
      genericUse.getVessel() != null ? genericUse.getVessel().toUpperCase() : ""
    );
    json.put("vessel callsign", genericUse.getVesselCallsign().toUpperCase());
    json.put("mmsi number", genericUse.getMmsiNumber());
    json.put(
      "radio system",
      genericUse.getRadioSystem() != null
        ? genericUse.getRadioSystem().toUpperCase().replace('/', ';')
        : ""
    );
    json.put(
      "notes",
      genericUse.getNotes() != null
        ? StringEscapeUtils.escapeCsv(genericUse.getNotes().toUpperCase())
        : ""
    );
    json.put(
      "fishing vessel port id and numbers",
      genericUse.getFishingVesselPortIdAndNumbers()
    );
    json.put("official number", genericUse.getOfficialNumber());
    json.put("imo number", genericUse.getImoNumber());
    json.put("rss and ssr number", genericUse.getRssAndSsrNumber());
    json.put("hull id number", genericUse.getHullIdNumber());
    json.put("coastguard cg ref number", genericUse.getCoastguardCGRefNumber());
    json.put(
      "aircraft type",
      genericUse.getAircraftType() != null
        ? genericUse.getAircraftType().toUpperCase()
        : ""
    );
    json.put(
      "aircraft registration mark",
      genericUse.getAircraftRegistrationMark()
    );
    json.put(
      "twenty four bit address in hex",
      genericUse.getTwentyFourBitAddressInHex()
    );
    json.put(
      "principal airport",
      genericUse.getPrincipalAirport() != null
        ? genericUse.getPrincipalAirport().toUpperCase()
        : ""
    );
    json.put(
      "aircraft operators designator and serial no",
      genericUse.getAircraftOperatorsDesignatorAndSerialNo()
    );
    json.put(
      "description of intended use",
      genericUse.getDescriptionOfIntendedUse() != null
        ? genericUse.getDescriptionOfIntendedUse().toUpperCase()
        : ""
    );
    json.put(
      "max number of persons on board",
      genericUse.getNumberOfPersonsOnBoard()
    );
    json.put(
      "area of use",
      genericUse.getAreaOfUse() != null
        ? genericUse.getAreaOfUse().toUpperCase()
        : ""
    );
    json.put(
      "trip information",
      genericUse.getTripInformation() != null
        ? genericUse.getTripInformation().toUpperCase()
        : ""
    );

    return json;
  }
}
