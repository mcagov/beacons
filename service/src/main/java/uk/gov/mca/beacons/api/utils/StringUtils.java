package uk.gov.mca.beacons.api.utils;

import java.util.Arrays;
import java.util.stream.Collectors;

public class StringUtils {

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
}
