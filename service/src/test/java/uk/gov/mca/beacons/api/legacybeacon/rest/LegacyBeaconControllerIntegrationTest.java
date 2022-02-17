package uk.gov.mca.beacons.api.legacybeacon.rest;

import org.junit.jupiter.api.Test;
import uk.gov.mca.beacons.api.WebIntegrationTest;

public class LegacyBeaconControllerIntegrationTest extends WebIntegrationTest {

  @Test
  void shouldFindTheLegacyBeaconById() throws Exception {
    final String createLegacyBeaconResponse = fixtureHelper.getFixture(
      "src/test/resources/fixtures/createLegacyBeaconResponse.json"
    );

    final String legacyBeaconId = seedLegacyBeacon();

    webTestClient
      .get()
      .uri(Endpoints.LegacyBeacon.value + "/" + legacyBeaconId)
      .exchange()
      .expectStatus()
      .isOk()
      .expectBody()
      .json(createLegacyBeaconResponse);
  }
}
