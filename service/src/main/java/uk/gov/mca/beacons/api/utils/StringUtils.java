package uk.gov.mca.beacons.api.utils;

import java.util.Arrays;
import java.util.Objects;
import java.util.stream.Collectors;
import org.apache.commons.lang3.StringUtils;

public class MCAStringUtils extends org.apache.commons.lang3.StringUtils {

  public static String getMultipleValuesAsString(
    String delimiter,
    String... values
  ) {
    return Arrays
      .stream(values)
      .filter(s -> !org.apache.commons.lang3.StringUtils.isBlank(s))
      .map(s -> s.trim())
      .collect(Collectors.joining(delimiter));
  }

  public static String valueOrEmpty(String value) {
    try {
      return Objects.requireNonNullElse(value, "");
    } catch (Exception e) {
      return "";
    }
  }
}
