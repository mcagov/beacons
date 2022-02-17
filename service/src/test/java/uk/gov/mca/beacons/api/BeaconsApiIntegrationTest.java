package uk.gov.mca.beacons.api;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.reactive.AutoConfigureWebTestClient;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.reactive.server.WebTestClient;

class BeaconsApiIntegrationTest extends WebIntegrationTest {

  private static final String ACTUATOR_ENDPOINT = "/actuator";
  private static final String ACTUATOR_HEALTH_ENDPOINT =
    ACTUATOR_ENDPOINT + "/health";
  private static final String ACTUATOR_INFO_ENDPOINT =
    ACTUATOR_ENDPOINT + "/info";

  @Test
  void contextLoads() {}

  @Test
  void actuatorEndpointShouldReturnUp() {
    makeGetRequest(ACTUATOR_HEALTH_ENDPOINT)
      .expectBody()
      .json("{\"status\": \"UP\"}");
  }

  @Test
  void actuatorGitInfoEndpointShouldReturnGitInfo() {
    makeGetRequest(ACTUATOR_INFO_ENDPOINT)
      .expectBody()
      .jsonPath("$.git")
      .exists();
  }

  private WebTestClient.ResponseSpec makeGetRequest(String url) {
    return webTestClient
      .get()
      .uri(url)
      .exchange()
      .expectStatus()
      .is2xxSuccessful();
  }
}
