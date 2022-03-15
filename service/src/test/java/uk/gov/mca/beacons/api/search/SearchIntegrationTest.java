package uk.gov.mca.beacons.api.search;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.web.reactive.server.WebTestClient;
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

    queryOpenSearch(searchQuery)
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

    queryOpenSearch(searchQuery)
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

    queryOpenSearch(searchQuery)
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

    queryOpenSearch(searchQuery)
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

      queryOpenSearch(searchQuery)
        .jsonPath("$.hits.hits[0]._id")
        .isEqualTo(beaconId)
        .jsonPath("$.hits.hits[0]._source.beaconUses[0].mmsi")
        .isEqualTo(mmsi);
    }
  }

  @Nested
  class BeaconSearchParameters {

    @Test
    public void whenTheBeaconHasAnAssociatedMaritimeUse_searchForBeaconUsingMmsiVesselNameCallSign()
      throws Exception {
      String mmsiNumber = "123456789";
      String vesselName = "My Vessel";
      String callSign = "GE123";
      String accountHolderId = seedAccountHolder();
      String beaconId = seedRegistration(
        RegistrationUseCase.SINGLE_BEACON,
        accountHolderId,
        fixture ->
          fixture
            .replace("this is my MMSI number", mmsiNumber)
            .replace("HMS Victory", vesselName)
            .replace("Fish and Ships", callSign)
      );

      String mmsiSearchQuery =
        "{\"query\": {\"match\": {\"mmsiNumbers\":\"" + mmsiNumber + "\"}}}";

      queryOpenSearch(mmsiSearchQuery)
        .jsonPath("$.hits.total.value")
        .isEqualTo(1)
        .jsonPath("$.hits.hits[0]._id")
        .isEqualTo(beaconId);

      String vesselNameSearchQuery =
        "{\"query\": {\"match\": {\"vesselNames\":\"" + vesselName + "\"}}}";

      queryOpenSearch(vesselNameSearchQuery)
        .jsonPath("$.hits.total.value")
        .isEqualTo(1)
        .jsonPath("$.hits.hits[0]._id")
        .isEqualTo(beaconId);

      String callSignSearchQuery =
        "{\"query\": {\"match\": {\"callSigns\":\"" + callSign + "\"}}}";

      queryOpenSearch(callSignSearchQuery)
        .jsonPath("$.hits.total.value")
        .isEqualTo(1)
        .jsonPath("$.hits.hits[0]._id")
        .isEqualTo(beaconId);
    }
  }

  @Nested
  class LegacyBeaconSearchParameters {

    @Test
    public void whenTheLegacyBeaconHasAnAssociatedMaritimeUse_searchForLegacyBeaconUsingMmsiVesselNameCallSign()
      throws Exception {
      String mmsiNumber = "123456789";
      String vesselName = "My Vessel";
      String callSign = "GE123";
      String legacyBeaconId = seedLegacyBeacon(
        fixture ->
          fixture
            .replace("235007399", mmsiNumber)
            .replace("KAYCEE", vesselName)
            .replace("VQAS7", callSign)
      );
      // seed non-matching legacy beacon
      seedLegacyBeacon(
        fixture ->
          fixture
            .replace("235007399", "222222222")
            .replace("KAYCEE", "Doesn't match")
            .replace("VQAS7", "DNMTC")
      );
      reindexSearch();

      String mmsiSearchQuery =
        "{\"query\": {\"match\": {\"mmsiNumbers\":\"" + mmsiNumber + "\"}}}";

      queryOpenSearch(mmsiSearchQuery)
        .jsonPath("$.hits.total.value")
        .isEqualTo(1)
        .jsonPath("$.hits.hits[0]._id")
        .isEqualTo(legacyBeaconId);

      String vesselNameSearchQuery =
        "{\"query\": {\"match\": {\"vesselNames\":\"" + vesselName + "\"}}}";

      queryOpenSearch(vesselNameSearchQuery)
        .jsonPath("$.hits.total.value")
        .isEqualTo(1)
        .jsonPath("$.hits.hits[0]._id")
        .isEqualTo(legacyBeaconId);

      String callSignSearchQuery =
        "{\"query\": {\"match\": {\"callSigns\":\"" + callSign + "\"}}}";

      queryOpenSearch(callSignSearchQuery)
        .jsonPath("$.hits.total.value")
        .isEqualTo(1)
        .jsonPath("$.hits.hits[0]._id")
        .isEqualTo(legacyBeaconId);
    }

    @Test
    public void whenTheLegacyBeaconHasAnAviationUse_findItUsingRegistrationMarkAndHexAddress()
      throws Exception {
      String aircraftRegistrationMark = "G-AXDN";
      String aircraft24bitHexAddress = "ABC123";
      String legacyBeaconId = seedLegacyBeacon(
        fixture ->
          fixture
            .replace("R-PLCM", aircraftRegistrationMark)
            .replace("F0FFFF", aircraft24bitHexAddress)
      );
      // seed non-matching legacy beacon
      seedLegacyBeacon(
        fixture ->
          fixture.replace("R-PLCM", "A-NOTH").replace("F0FFFF", "000000")
      );
      reindexSearch();

      String mmsiSearchQuery =
        "{\"query\": {\"match\": {\"aircraftRegistrationMarks\":\"" +
        aircraftRegistrationMark +
        "\"}}}";

      queryOpenSearch(mmsiSearchQuery)
        .jsonPath("$.hits.total.value")
        .isEqualTo(1)
        .jsonPath("$.hits.hits[0]._id")
        .isEqualTo(legacyBeaconId);

      String vesselNameSearchQuery =
        "{\"query\": {\"match\": {\"aircraft24bitHexAddresses\":\"" +
        aircraft24bitHexAddress +
        "\"}}}";

      queryOpenSearch(vesselNameSearchQuery)
        .jsonPath("$.hits.total.value")
        .isEqualTo(1)
        .jsonPath("$.hits.hits[0]._id")
        .isEqualTo(legacyBeaconId);
    }
  }

  private WebTestClient.BodyContentSpec queryOpenSearch(String query) {
    return webTestClient
      .post()
      .uri(OPENSEARCH_CONTAINER.getHttpHostAddress() + "/_search")
      .contentType(MediaType.APPLICATION_JSON)
      .bodyValue(query)
      .exchange()
      .expectStatus()
      .isOk()
      .expectBody();
  }
}
