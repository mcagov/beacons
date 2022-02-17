package uk.gov.mca.beacons.api.utils;

import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeFormatterBuilder;
import java.time.temporal.ChronoField;

public class OffsetDateTimeOptionalZoneParser {

  private static final DateTimeFormatter formatter = new DateTimeFormatterBuilder()
    .parseLenient()
    .append(DateTimeFormatter.ISO_LOCAL_DATE_TIME)
    .optionalStart()
    .appendOffsetId()
    .optionalEnd()
    .parseDefaulting(ChronoField.OFFSET_SECONDS, 0)
    .toFormatter();

  public static OffsetDateTime parse(String dateTimeString) {
    return OffsetDateTime.parse(dateTimeString, formatter);
  }
}
