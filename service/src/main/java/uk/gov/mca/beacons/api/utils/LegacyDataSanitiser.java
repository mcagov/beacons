package uk.gov.mca.beacons.api.utils;

public class LegacyDataSanitiser {

  public static String replaceStringNoneWithNull(String legacyField) {
    if (legacyField == null) {
      return null;
    }
    if (legacyField.equals("None")) {
      return null;
    }
    return legacyField;
  }

  /**
   * @param fields to combine into one field
   * @return The first field that is neither "None" nor null. If no fields satisfy this then return null.
   */
  public static String chooseField(String... fields) {
    for (String field : fields) {
      String sanitised = replaceStringNoneWithNull(field);
      if (sanitised != null) {
        return sanitised;
      }
    }

    return null;
  }
}
