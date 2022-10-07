package uk.gov.mca.beacons.api.utils;

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
}
