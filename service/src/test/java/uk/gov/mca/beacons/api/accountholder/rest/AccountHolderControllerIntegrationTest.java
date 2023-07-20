package uk.gov.mca.beacons.api.accountholder.rest;

import java.util.UUID;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.web.reactive.function.BodyInserters;
import uk.gov.mca.beacons.api.WebIntegrationTest;

@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class AccountHolderControllerIntegrationTest extends WebIntegrationTest {

  private final String testAuthId = UUID.randomUUID().toString();

  @Test
  @Order(1)
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
  @Order(2)
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
  @Order(3)
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

  @Test
  @Order(4)
  public void shouldRespondWithTheUpdateAccountHolderDetails()
    throws Exception {
    String id = seedAccountHolder(testAuthId);
    String updateAccountHolderRequest = updateAccountHolderRequest(
      id,
      testAuthId
    );

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

  private String updateAccountHolderRequest(String id, String authId)
    throws Exception {
    return fixtureHelper.getFixture(
      "src/test/resources/fixtures/updateAccountHolderRequest.json",
      fixture ->
        fixture
          .replace("replace-with-test-account-id", id)
          .replace("replace-with-test-auth-id", authId)
    );
  }

  private String updateAccountHolderResponse(String id) throws Exception {
    return fixtureHelper.getFixture(
      "src/test/resources/fixtures/updateAccountHolderResponse.json",
      fixture -> fixture.replace("replace-with-test-account-id", id)
    );
  }
}
