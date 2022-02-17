package uk.gov.mca.beacons.api.legacybeacon.rest;

import static org.hamcrest.Matchers.hasItems;

import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.reactive.AutoConfigureWebTestClient;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.web.reactive.server.WebTestClient;
import org.springframework.web.reactive.function.BodyInserters;
import uk.gov.mca.beacons.api.BaseIntegrationTest;
import uk.gov.mca.beacons.api.WebIntegrationTest;

public class MigrationControllerIntegrationTest extends WebIntegrationTest {

  @Nested
  class CreateLegacyBeacon {

    @Test
    void shouldRespondWithTheCreatedResource() throws Exception {
      final String createLegacyBeaconRequest = fixtureHelper.getFixture(
        "src/test/resources/fixtures/createLegacyBeaconRequest.json"
      );

      final String createLegacyBeaconResponse = fixtureHelper.getFixture(
        "src/test/resources/fixtures/createLegacyBeaconResponse.json"
      );

      webTestClient
        .post()
        .uri(Endpoints.Migration.value + "/legacy-beacon")
        .body(BodyInserters.fromValue(createLegacyBeaconRequest))
        .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
        .exchange()
        .expectStatus()
        .isCreated()
        .expectBody()
        .jsonPath("$.data.id")
        .isNotEmpty()
        .json(createLegacyBeaconResponse);
    }

    @Test
    void shouldReturnWithBadRequestAndTheValidationErrors() throws Exception {
      final String createLegacyBeaconInvalidRequest = fixtureHelper.getFixture(
        "src/test/resources/fixtures/createLegacyBeaconInvalidRequest.json"
      );

      webTestClient
        .post()
        .uri(Endpoints.Migration.value + "/legacy-beacon")
        .body(BodyInserters.fromValue(createLegacyBeaconInvalidRequest))
        .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
        .exchange()
        .expectStatus()
        .isBadRequest()
        .expectBody()
        .jsonPath("$.errors.length()")
        .isEqualTo(2)
        .jsonPath("$.errors[*].field")
        .value(
          hasItems(
            "data.attributes.beacon.lastModifiedDate",
            "data.attributes.beacon.createdDate"
          )
        );
    }
  }
}
