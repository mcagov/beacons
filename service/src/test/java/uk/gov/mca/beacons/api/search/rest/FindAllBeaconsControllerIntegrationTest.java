package uk.gov.mca.beacons.api.search.rest;

import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Random;
import java.util.UUID;
import java.util.function.Function;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.reactive.function.BodyInserters;
import uk.gov.mca.beacons.api.WebIntegrationTest;

class FindAllBeaconsControllerIntegrationTest extends WebIntegrationTest {

  private static final String FIND_ALL_URI =
    "/spring-api/find-all-beacons/search";

  @Test
  void shouldFindTheLegacyBeaconByHexIdStatusAndUses() throws Exception {
    final var randomHexId = UUID.randomUUID().toString();
    createLegacyBeacon(randomHexId);

    webTestClient
      .get()
      .uri(uriBuilder ->
        uriBuilder
          .path(FIND_ALL_URI)
          .queryParam("status", "migrated")
          .queryParam("uses", "maritime")
          .queryParam("hexId", randomHexId)
          .queryParam("ownerName", "")
          .queryParam("cospasSarsatNumber", "")
          .queryParam("manufacturerSerialNumber", "")
          .build()
      )
      .exchange()
      .expectStatus()
      .isOk()
      .expectBody()
      .jsonPath("_embedded.beaconSearch[0].hexId")
      .isEqualTo(randomHexId)
      .jsonPath("page.totalElements")
      .isEqualTo(1);
  }

  @Test
  void shouldFindTheCreatedBeaconByHexIdStatusAndUses() throws Exception {
    final String accountHolderId = seedAccountHolder();
    final var randomHexId = UUID.randomUUID().toString();
    createBeacon(randomHexId, accountHolderId);

    webTestClient
      .get()
      .uri(uriBuilder ->
        uriBuilder
          .path(FIND_ALL_URI)
          .queryParam("status", "new")
          .queryParam("uses", "fishing vessel")
          .queryParam("hexId", randomHexId)
          .queryParam("ownerName", "")
          .queryParam("cospasSarsatNumber", "")
          .queryParam("manufacturerSerialNumber", "")
          .build()
      )
      .exchange()
      .expectStatus()
      .isOk()
      .expectBody()
      .jsonPath("_embedded.beaconSearch[0].hexId")
      .isEqualTo(randomHexId)
      .jsonPath("page.totalElements")
      .isEqualTo(1);
  }

  @Test
  void shouldFindTheCreatedLegacyBeaconWithAllFiltersSet() throws Exception {
    var legacyBeaconFixtureHexId = "9D0E1D1B8C00001";
    var legacyBeaconFixtureOwnerName = "Mr Beacon";
    var legacyBeaconFixtureCospasSarsatNumberValue = 476899;
    var legacyBeaconFixtureManufacturerSerialNumber =
      "manufacturer_serial_number_value";

    var random = new Random();
    var uniqueLegacyBeaconHexId = UUID.randomUUID().toString();
    var uniqueLegacyBeaconOwnerName = UUID.randomUUID().toString();
    var pseudoUniqueLegacyBeaconCospasSarsatNumber = random.nextInt(
      Integer.MAX_VALUE
    );
    var uniqueLegacyBeaconManufacturerSerialNumber = UUID.randomUUID()
      .toString();

    createLegacyBeacon(request ->
      request
        .replace(legacyBeaconFixtureHexId, uniqueLegacyBeaconHexId)
        .replace(legacyBeaconFixtureOwnerName, uniqueLegacyBeaconOwnerName)
        .replace(
          Integer.toString(legacyBeaconFixtureCospasSarsatNumberValue),
          Integer.toString(pseudoUniqueLegacyBeaconCospasSarsatNumber)
        )
        .replace(
          legacyBeaconFixtureManufacturerSerialNumber,
          uniqueLegacyBeaconManufacturerSerialNumber
        )
    );

    webTestClient
      .get()
      .uri(uriBuilder ->
        uriBuilder
          .path(FIND_ALL_URI)
          .queryParam("status", "MIGRATED")
          .queryParam("uses", "MARITIME")
          .queryParam("hexId", uniqueLegacyBeaconHexId)
          .queryParam("ownerName", uniqueLegacyBeaconOwnerName)
          .queryParam(
            "cospasSarsatNumber",
            pseudoUniqueLegacyBeaconCospasSarsatNumber
          )
          .queryParam(
            "manufacturerSerialNumber",
            uniqueLegacyBeaconManufacturerSerialNumber
          )
          .build()
      )
      .exchange()
      .expectStatus()
      .isOk()
      .expectBody()
      .jsonPath("page.totalElements")
      .isEqualTo(1)
      .jsonPath("_embedded.beaconSearch[0].hexId")
      .isEqualTo(uniqueLegacyBeaconHexId);
  }

  @Test
  void shouldFindTheHATEOASLink() throws Exception {
    final String accountHolderId = seedAccountHolder();
    final var randomHexId = UUID.randomUUID().toString();
    createBeacon(randomHexId, accountHolderId);

    webTestClient
      .get()
      .uri(uriBuilder ->
        uriBuilder
          .path(FIND_ALL_URI)
          .queryParam("status", "new")
          .queryParam("uses", "fishing vessel")
          .queryParam("hexId", randomHexId)
          .queryParam("ownerName", "")
          .queryParam("cospasSarsatNumber", "")
          .queryParam("manufacturerSerialNumber", "")
          .build()
      )
      .exchange()
      .expectStatus()
      .isOk()
      .expectBody()
      .jsonPath("_links.self.href")
      .isNotEmpty();
  }

  @Test
  void shouldFindTheHATEOASEntityLink() throws Exception {
    final String accountHolderId = seedAccountHolder();
    final var randomHexId = UUID.randomUUID().toString();
    createBeacon(randomHexId, accountHolderId);

    webTestClient
      .get()
      .uri(uriBuilder ->
        uriBuilder
          .path(FIND_ALL_URI)
          .queryParam("status", "new")
          .queryParam("uses", "fishing vessel")
          .queryParam("hexId", randomHexId)
          .queryParam("ownerName", "")
          .queryParam("cospasSarsatNumber", "")
          .queryParam("manufacturerSerialNumber", "")
          .build()
      )
      .exchange()
      .expectStatus()
      .isOk()
      .expectBody()
      .jsonPath("_embedded.beaconSearch[0]._links.beaconSearchEntity.href")
      .isNotEmpty();
  }

  private String readFile(String filePath) throws Exception {
    return Files.readString(Paths.get(filePath));
  }

  private void createLegacyBeacon(Function<String, String> mapRequestObject)
    throws Exception {
    final var createLegacyBeaconRequest = mapRequestObject.apply(
      readFile("src/test/resources/fixtures/createLegacyBeaconRequest.json")
    );

    webTestClient
      .post()
      .uri("/spring-api/migrate/legacy-beacon")
      .bodyValue(createLegacyBeaconRequest)
      .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
      .exchange()
      .expectStatus()
      .isCreated();
  }

  private void createLegacyBeacon(String hexId) throws Exception {
    createLegacyBeacon(request -> request.replace("9D0E1D1B8C00001", hexId));
  }

  private void createBeacon(String hexId, String accountHolderId)
    throws Exception {
    createBeacon(request ->
      request
        .replace("1D0EA08C52FFBFF", hexId)
        .replace("account-holder-id-placeholder", accountHolderId)
    );
  }

  private void createBeacon(Function<String, String> mapRequestObject)
    throws Exception {
    final var createBeaconRequest = mapRequestObject.apply(
      readFile("src/test/resources/fixtures/createBeaconRequest.json")
    );

    webTestClient
      .post()
      .uri("/spring-api/registrations/register")
      .body(BodyInserters.fromValue(createBeaconRequest))
      .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
      .exchange()
      .expectStatus()
      .isCreated();
  }
}
