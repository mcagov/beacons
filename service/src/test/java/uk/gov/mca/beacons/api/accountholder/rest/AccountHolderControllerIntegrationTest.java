package uk.gov.mca.beacons.api.accountholder.rest;

import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.reactive.function.BodyInserters;
import uk.gov.mca.beacons.api.WebIntegrationTest;

public class AccountHolderControllerIntegrationTest extends WebIntegrationTest {

  private final String testAuthId = UUID.randomUUID().toString();

  @Test
  public void shouldRespondWithTheCreatedAccountHolder() throws Exception {
    final var createAccountHolderRequest = createAccountHolderRequest(
      testAuthId
    );
    final var createAccountHolderResponse = createAccountHolderResponse(
      testAuthId
    );

    webTestClient
      .post()
      .uri(Endpoints.AccountHolder.value)
      .body(BodyInserters.fromValue(createAccountHolderRequest))
      .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
      .exchange()
      .expectStatus()
      .isCreated()
      .expectBody()
      .json(createAccountHolderResponse)
      .jsonPath("$.data.id")
      .isNotEmpty();
  }

  @Test
  public void shouldFindTheCreatedAccountHolderById() throws Exception {
    final String id = seedAccountHolder(testAuthId);
    final var createAccountHolderResponse = createAccountHolderResponse(
      testAuthId
    );

    webTestClient
      .get()
      .uri(Endpoints.AccountHolder.value + "/" + id)
      .exchange()
      .expectStatus()
      .isOk()
      .expectBody()
      .json(createAccountHolderResponse);
  }

  @Test
  public void shouldFindTheAccountHolderByAuthId() throws Exception {
    seedAccountHolder(testAuthId);
    final var createAccountHolderResponse = createAccountHolderResponse(
      testAuthId
    );

    webTestClient
      .get()
      .uri(Endpoints.AccountHolder.value + "?authId=" + testAuthId)
      .exchange()
      .expectStatus()
      .isOk()
      .expectBody()
      .json(createAccountHolderResponse);
  }

  private String createAccountHolderRequest(String authId) throws Exception {
    return fixtureHelper.getFixture(
      "src/test/resources/fixtures/createAccountHolderRequest.json",
      fixture -> fixture.replace("replace-with-test-auth-id", authId)
    );
  }

  private String createAccountHolderResponse(String authId) throws Exception {
    return fixtureHelper.getFixture(
      "src/test/resources/fixtures/createAccountHolderResponse.json",
      fixture -> fixture.replace("replace-with-test-auth-id", authId)
    );
  }
}
