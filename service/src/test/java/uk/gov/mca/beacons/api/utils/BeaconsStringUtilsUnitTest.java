package uk.gov.mca.beacons.api.utils;

import org.junit.Assert;
import org.junit.jupiter.api.Test;
import uk.gov.mca.beacons.api.beaconuse.domain.Activity;

public class BeaconsStringUtilsUnitTest {

  @Test
  public void test_getMultipleValuesAsString_expectValid() {
    //given
    String value1 = "test";
    String value2 = "me";
    String value3 = "please";
    String delimiter = " / ";
    //when
    String output = BeaconsStringUtils.getMultipleValuesAsString(
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
    String output = BeaconsStringUtils.getMultipleValuesAsString(
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
    String output = BeaconsStringUtils.getMultipleValuesAsString(
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
    String output = BeaconsStringUtils.getMultipleValuesAsString(
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
    String output = BeaconsStringUtils.getMultipleValuesAsString(
      delimiter,
      value1,
      value2,
      value3
    );

    //then
    Assert.assertEquals("test / me / please", output);
  }

  @Test
  public void test_getActivityCARGO_AIRPLANEAsString_expectReadableValue() {
    //given
    Activity activity = Activity.CARGO_AIRPLANE;

    String activityName = BeaconsStringUtils.enumAsString(activity);
    //then
    Assert.assertEquals("Cargo Airplane", activityName);
  }

  @Test
  public void test_getActivity_HOT_AIR_BALLOON_AsString_expectReadableValue() {
    //given
    Activity activity = Activity.HOT_AIR_BALLOON;

    String activityName = BeaconsStringUtils.enumAsString(activity);
    //then
    Assert.assertEquals("Hot Air Balloon", activityName);
  }

  @Test
  public void test_getActivity_CYCLING_AsString_expectReadableValue() {
    //given
    Activity activity = Activity.CYCLING;

    String activityName = BeaconsStringUtils.enumAsString(activity);
    //then
    Assert.assertEquals("Cycling", activityName);
  }

  @Test
  public void test_getActivity_DRIVING_AsString_expectReadableValue() {
    //given
    Activity activity = Activity.DRIVING;

    String activityName = BeaconsStringUtils.enumAsString(activity);
    //then
    Assert.assertEquals("Driving", activityName);
  }
}
