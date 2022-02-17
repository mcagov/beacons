package uk.gov.mca.beacons.api.beacon.rest;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import uk.gov.mca.beacons.api.WebIntegrationTest;

public class BeaconControllerIntegrationTest extends WebIntegrationTest {

  private String beaconId;

  @BeforeEach
  void init() throws Exception {
    String accountHolderId = seedAccountHolder();
    beaconId =
      seedRegistration(RegistrationUseCase.SINGLE_BEACON, accountHolderId);
  }

  @Test
  void shouldUpdateTheBeacon() throws Exception {
    final String updateBeaconRequest = fixtureHelper.getFixture(
      "src/test/resources/fixtures/updateBeaconRequest.json",
      fixture -> fixture.replace("replace-with-beacon-id", beaconId)
    );

    webTestClient
      .patch()
      .uri(Endpoints.Beacon.value + "/" + beaconId)
      .contentType(MediaType.APPLICATION_JSON)
      .bodyValue(updateBeaconRequest)
      .exchange()
      .expectStatus()
      .isOk()
      .expectBody()
      .jsonPath("$.data.id")
      .isEqualTo(beaconId)
      .jsonPath("$.data.attributes.manufacturer")
      .isEqualTo("ACR (Artex)");
  }
}
