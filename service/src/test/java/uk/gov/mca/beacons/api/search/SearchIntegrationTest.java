package uk.gov.mca.beacons.api.search;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.reactive.function.BodyInserters;
import uk.gov.mca.beacons.api.WebIntegrationTest;

public class SearchIntegrationTest extends WebIntegrationTest {

  @Test
  public void whenANewBeaconIsRegistered_thenItIsSearchable() throws Exception {
    String accountHolderId = seedAccountHolder();
    String beaconId = seedRegistration(
      RegistrationUseCase.SINGLE_BEACON,
      accountHolderId
    );
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
      .jsonPath("$.hits.hits[0]._id")
      .isEqualTo(beaconId)
      .jsonPath("$.hits.hits[0]._source.hexId")
      .isEqualTo(fixtureHexId);
  }

  @Test
  public void whenABeaconIsUpdated_ThenTheChangesAreReflectedWhenSearching()
    throws Exception {
    String accountHolderId = seedAccountHolder();
    String beaconId = seedRegistration(
      RegistrationUseCase.SINGLE_BEACON,
      accountHolderId
    );
    updateRegistration(beaconId, accountHolderId);

    String ownerEmailAfterUpdate = "sergio@royalnavy.esp";
    String searchQuery =
      "{\"query\": {\"nested\": {\"path\": \"beaconOwner\", \"query\": { \"match\": {\"beaconOwner.ownerEmail\":\"" +
      ownerEmailAfterUpdate +
      "\"}}}}}";

    webTestClient
      .post()
      .uri(OPENSEARCH_CONTAINER.getHttpHostAddress() + "/_search")
      .body(BodyInserters.fromValue(searchQuery))
      .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
      .exchange()
      .expectStatus()
      .isOk()
      .expectBody()
      .jsonPath("$.hits.hits[0]._id")
      .isEqualTo(beaconId)
      .jsonPath("$.hits.hits[0]._source.beaconOwner.ownerEmail")
      .isEqualTo(ownerEmailAfterUpdate);
  }

  @Test
  public void whenABeaconIsDeleted_ThenTheChangesAreReflectedWhenSearching()
    throws Exception {
    String accountHolderId = seedAccountHolder();
    String beaconId = seedRegistration(
      RegistrationUseCase.SINGLE_BEACON,
      accountHolderId
    );
    deleteRegistration(beaconId, accountHolderId);

    String beaconStatus = "DELETED";

    String searchQuery =
      "{\"query\": {\"match\": {\"beaconStatus\":\"" + beaconStatus + "\"}}}";
    String fixtureHexId = "1D0EA08C52FFBFF";

    webTestClient
      .post()
      .uri(OPENSEARCH_CONTAINER.getHttpHostAddress() + "/_search")
      .body(BodyInserters.fromValue(searchQuery))
      .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
      .exchange()
      .expectStatus()
      .isOk()
      .expectBody()
      .jsonPath("$.hits.hits[0]._id")
      .isEqualTo(beaconId)
      .jsonPath("$.hits.hits[0]._source.beaconStatus")
      .isEqualTo(beaconStatus)
      .jsonPath("$.hits.hits[0]._source.hexId")
      .isEqualTo(fixtureHexId);
  }

  @Test
  public void whenALegacyBeaconIsClaimed_ThenTheChangesAreReflectedWhenSearching()
    throws Exception {
    String accountHolderId = seedAccountHolder();

    String legacyBeaconId = seedLegacyBeacon(
      fixture ->
        fixture
          .replace("ownerbeacon@beacons.com", "testy@mctestface.com")
          .replace("9D0E1D1B8C00001", "1D0EA08C52FFBFF")
    );
    seedRegistration(RegistrationUseCase.SINGLE_BEACON, accountHolderId);

    String beaconStatus = "CLAIMED";
    String searchQuery =
      "{\"query\": {\"match\": {\"beaconStatus\":\"" + beaconStatus + "\"}}}";

    webTestClient
      .post()
      .uri(OPENSEARCH_CONTAINER.getHttpHostAddress() + "/_search")
      .body(BodyInserters.fromValue(searchQuery))
      .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
      .exchange()
      .expectStatus()
      .isOk()
      .expectBody()
      .jsonPath("$.hits.hits[0]._id")
      .isEqualTo(legacyBeaconId)
      .jsonPath("$.hits.hits[0]._source.beaconStatus")
      .isEqualTo(beaconStatus);
  }

  @Nested
  class SearchParameters {

    private String accountHolderId;

    @BeforeEach
    void init() throws Exception {
      accountHolderId = seedAccountHolder();
    }

    @Test
    public void searchForBeaconUsingMmsi() throws Exception {
      String mmsi = "235 762000";
      String beaconId = seedRegistration(
        RegistrationUseCase.SINGLE_BEACON,
        accountHolderId,
        fixture -> fixture.replace("this is my MMSI number", mmsi)
      );

      String searchQuery =
        "{\"query\": {\"nested\": {\"path\": \"beaconUses\", \"query\": { \"match\": {\"beaconUses.mmsi\":\"" +
        mmsi +
        "\"}}}}}";

      webTestClient
        .post()
        .uri(OPENSEARCH_CONTAINER.getHttpHostAddress() + "/_search")
        .contentType(MediaType.APPLICATION_JSON)
        .bodyValue(searchQuery)
        .exchange()
        .expectStatus()
        .isOk()
        .expectBody()
        .jsonPath("$.hits.hits[0]._id")
        .isEqualTo(beaconId)
        .jsonPath("$.hits.hits[0]._source.beaconUses[0].mmsi")
        .isEqualTo(mmsi);
    }
  }
}
