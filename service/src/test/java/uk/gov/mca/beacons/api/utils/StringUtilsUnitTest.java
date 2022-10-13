package uk.gov.mca.beacons.api.utils;

import java.time.format.DateTimeFormatter;
import org.junit.Assert;
import org.junit.jupiter.api.Test;

public class StringUtilsUnitTest {

  @Test
  public void test_getMultipleValuesAsString_expectValid() {
    //given
    String value1 = "test";
    String value2 = "me";
    String value3 = "please";
    String delimiter = " / ";
    //when
    String output = StringUtils.getMultipleValuesAsString(
      delimiter,
      value1,
      value2,
      value3
    );

    //then
    Assert.assertEquals("test / me / please", output);
  }

  @Test
  public void test_getMultipleValuesAsString_expectSkippedArg() {
    //given
    String value1 = "test";
    String value2 = null;
    String value3 = "please";
    String delimiter = " / ";
    //when
    String output = StringUtils.getMultipleValuesAsString(
      delimiter,
      value1,
      value2,
      value3
    );

    //then
    Assert.assertEquals("test / please", output);
  }

  @Test
  public void test_getMultipleValuesAsString_expectSkippedBlankArg() {
    //given
    String value1 = "test";
    String value2 = null;
    String value3 = " ";
    String delimiter = " / ";
    //when
    String output = StringUtils.getMultipleValuesAsString(
      delimiter,
      value1,
      value2,
      value3
    );

    //then
    Assert.assertEquals("test", output);
  }

  @Test
  public void test_getMultipleValuesAsString_expectNoNulls() {
    //given
    String value1 = "test";
    String value2 = null;
    String delimiter = " / ";
    //when
    String output = StringUtils.getMultipleValuesAsString(
      delimiter,
      value1,
      value2
    );

    //then
    Assert.assertEquals("test", output);
  }

  @Test
  public void test_getMultipleValuesAsString_expectTrimmedValues() {
    //given
    String value1 = "    test     ";
    String value2 = "     me      ";
    String value3 = "    please    ";
    String delimiter = " / ";
    //when
    String output = StringUtils.getMultipleValuesAsString(
      delimiter,
      value1,
      value2,
      value3
    );

    //then
    Assert.assertEquals("test / me / please", output);
  }

  @Test
  public void formatDate_whenTheDateIsAStringRepresentingALocalDateWithSlashes_shouldNotFormatTheDate() {
    DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern(
      "dd-MM-yyyy"
    );
    String dateTimeString = "2008/12/05";

    String formattedDate = StringUtils.formatDate(
      dateTimeString,
      dateTimeFormatter
    );

    Assert.assertEquals("2008/12/05", formattedDate);
  }

  @Test
  public void formatDate_whenTheDateIsAStringRepresentingAValidLocalDateTime_shouldRemoveTheTimestamp() {
    DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern(
      "dd-MM-yyyy"
    );
    String dateTimeString = "2007-12-03T10:15:30";

    String formattedDate = StringUtils.formatDate(
      dateTimeString,
      dateTimeFormatter
    );

    Assert.assertEquals("03-12-2007", formattedDate);
  }

  @Test
  public void formatDate_whenTheDateIsAStringRepresentingADateTimeWithOffset_shouldRemoveTheTimestampAndOffsetCharacters() {
    DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern(
      "dd-MM-yyyy"
    );
    String offsetDateTimeString = "2021-03-25T02:43:33+00:00";

    String formattedDate = StringUtils.formatDate(
      offsetDateTimeString,
      dateTimeFormatter
    );

    Assert.assertEquals("25-03-2021", formattedDate);
  }

  @Test
  public void formatDate_whenTheDateIsAStringRepresentingAnOffsetDateTime_shouldRemoveTheTimestampAndOffsetCharacters() {
    DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern(
      "dd-MM-yyyy"
    );
    String offsetDateTimeString = "2020-03-02T08:51:32Z";

    String formattedDate = StringUtils.formatDate(
      offsetDateTimeString,
      dateTimeFormatter
    );

    Assert.assertEquals("02-03-2020", formattedDate);
  }
}
