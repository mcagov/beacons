package uk.gov.mca.beacons.api.utils;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.core.Is.is;

import java.time.OffsetDateTime;
import org.junit.jupiter.api.Test;

class OffsetDateTimeOptionalZoneParserUnitTest {

  @Test
  void shouldParseOffsetDateTimeStringToOffsetDateTime() {
    String offsetDateTimeString = "2022-02-01T00:00+01:00";

    OffsetDateTime offsetDateTime = OffsetDateTimeOptionalZoneParser.parse(
      offsetDateTimeString
    );
    assertThat(offsetDateTime.toString(), is(offsetDateTimeString));
  }

  @Test
  void shouldParseOffsetDateTimeWithOffsetIdToOffsetDateTime() {
    String offsetDateTimeString = "2022-02-01T00:00Z";
    OffsetDateTime offsetDateTime = OffsetDateTimeOptionalZoneParser.parse(
      offsetDateTimeString
    );
    assertThat(offsetDateTime.toString(), is(offsetDateTimeString));
  }

  @Test
  void shouldParseLocalDateTimeToOffsetDateTimeWithZuluOffset() {
    String localDateTimeString = "2022-02-01T00:00";
    String offsetDateTimeString = "2022-02-01T00:00Z";

    OffsetDateTime offsetDateTime = OffsetDateTimeOptionalZoneParser.parse(
      localDateTimeString
    );
    assertThat(offsetDateTime.toString(), is(offsetDateTimeString));
  }
}
