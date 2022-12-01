package uk.gov.mca.beacons.api.utils;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.Objects;
import java.util.stream.Collectors;
import org.apache.commons.lang3.StringUtils;

public class BeaconsStringUtils {

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

  public static String getUppercaseValueOrEmpty(String value) {
    try {
      return Objects.requireNonNullElse(value.toUpperCase(), "");
    } catch (Exception e) {
      return "";
    }
  }

  public static String enumAsString(Enum value) {
    return Arrays
      .stream(value.name().split("_"))
      .map(s -> StringUtils.capitalize(s.toLowerCase()))
      .collect(Collectors.joining(" "));
  }

  public static String formatDate(
    String date,
    DateTimeFormatter dateTimeFormatter
  ) {
    if (date == null) {
      return "";
    } else if (date.contains("+")) {
      int indexOfOffsetChar = date.indexOf("+");
      date = date.substring(0, indexOfOffsetChar);
    }
    try {
      date = LocalDateTime.parse(date.trim()).format(dateTimeFormatter);
    } catch (Exception localDateTimeException) {
      try {
        date = LocalDate.parse(date.trim()).format(dateTimeFormatter);
      } catch (Exception localDateException) {
        OffsetDateTime offsetDate = OffsetDateTime.parse(date.trim());
        date = offsetDate.format(dateTimeFormatter);
      }
    } finally {
      return date;
    }
  }
}
