package uk.gov.mca.beacons.api.utils;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.core.IsEqual.equalTo;
import static org.hamcrest.core.IsNull.nullValue;

import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

public class LegacyDataSanitiserUnitTest {

  @Nested
  class ShouldReplaceNoneWithNull {

    @Test
    void whenStringNone_ShouldReplaceNoneWithNull() {
      String field = "None";
      String result = LegacyDataSanitiser.replaceStringNoneWithNull(field);
      assertThat(result, nullValue());
    }

    @Test
    void whenNull_ShouldReturnNull() {
      String field = null;
      String result = LegacyDataSanitiser.replaceStringNoneWithNull(field);
      assertThat(result, nullValue());
    }

    @Test
    void whenNeitherNullNorStringNone_ShouldReturnField() {
      String field = "Not None or null";
      String result = LegacyDataSanitiser.replaceStringNoneWithNull(field);
      assertThat(result, equalTo(field));
    }
  }

  @Nested
  class ChooseField {

    @Test
    void whenGivenMultipleFields_ShouldChooseFirstNonNullField() {
      String first = null;
      String second = "None";
      String third = null;
      String fourth = "NonNull";

      String result = LegacyDataSanitiser.chooseField(
        first,
        second,
        third,
        fourth
      );

      assertThat(result, equalTo(fourth));
    }

    @Test
    void whenAllFieldsNoneOrNull_ShouldReturnNull() {
      String first = null;
      String second = "None";

      String result = LegacyDataSanitiser.chooseField(first, second);

      assertThat(result, nullValue());
    }
  }
}
