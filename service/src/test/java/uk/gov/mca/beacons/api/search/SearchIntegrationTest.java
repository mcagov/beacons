package uk.gov.mca.beacons.api.search;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.reactive.function.BodyInserters;
import uk.gov.mca.beacons.api.WebIntegrationTest;

public class SearchIntegrationTest extends WebIntegrationTest {

  @Test
  public void whenANewBeaconIsRegistered_thenItIsSearchable() throws Exception {
    String accountHolderId = seedAccountHolder();
    seedRegistration(RegistrationUseCase.SINGLE_BEACON, accountHolderId);
    String fixtureHexId = "1D0EA08C52FFBFF";

    String searchQuery =
      "{\"query\": {\"match\": {\"hexId\":\"" + fixtureHexId + "\"}}}";

    webTestClient
      .post()
      .uri(OPENSEARCH_CONTAINER.getHttpHostAddress() + "/_search")
      .body(BodyInserters.fromValue(searchQuery))
      .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
      .exchange()
      .expectStatus()
      .isOk()
      .expectBody()
      .jsonPath("$.hits.hits[0]._source.hexId")
      .isEqualTo(fixtureHexId);
  }
}
