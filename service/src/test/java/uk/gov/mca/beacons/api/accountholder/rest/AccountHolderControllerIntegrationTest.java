package uk.gov.mca.beacons.api.accountholder.rest;

import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.reactive.function.BodyInserters;
import uk.gov.mca.beacons.api.WebIntegrationTest;

public class AccountHolderControllerIntegrationTest extends WebIntegrationTest {

  @Test
  public void shouldRespondWithTheCreatedAccountHolder() throws Exception {
    final String authId = UUID.randomUUID().toString();
    final var createAccountHolderRequest = createAccountHolderRequest(authId);
    final var createAccountHolderResponse = createAccountHolderResponse(authId);

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
    final String authId = UUID.randomUUID().toString();
    final String id = seedAccountHolder(authId);
    final var createAccountHolderResponse = createAccountHolderResponse(authId);

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
    final String authId = UUID.randomUUID().toString();
    seedAccountHolder(authId);
    final var createAccountHolderResponse = createAccountHolderResponse(authId);

    webTestClient
      .get()
      .uri(Endpoints.AccountHolder.value + "?authId=" + authId)
      .exchange()
      .expectStatus()
      .isOk()
      .expectBody()
      .json(createAccountHolderResponse);
  }

  @Test
  public void shouldRespondWithTheUpdateAccountHolderDetails()
    throws Exception {
    final String authId = UUID.randomUUID().toString();
    String id = seedAccountHolder(authId);

    String updateAccountHolderRequest = updateAccountHolderRequest(id);
    String updateAccountHolderResponse = updateAccountHolderResponse(id);

    webTestClient
      .patch()
      .uri(Endpoints.AccountHolder.value + "/" + id)
      .body(BodyInserters.fromValue(updateAccountHolderRequest))
      .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
      .exchange()
      .expectStatus()
      .isOk()
      .expectBody()
      .json(updateAccountHolderResponse);
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

  private String updateAccountHolderRequest(String id) throws Exception {
    return fixtureHelper.getFixture(
      "src/test/resources/fixtures/updateAccountHolderResponse.json",
      fixture -> fixture.replace("replace-with-test-account-id", id)
    );
  }

  private String updateAccountHolderResponse(String id) throws Exception {
    return fixtureHelper.getFixture(
      "src/test/resources/fixtures/updateAccountHolderResponse.json",
      fixture -> fixture.replace("replace-with-test-account-id", id)
    );
  }
}
