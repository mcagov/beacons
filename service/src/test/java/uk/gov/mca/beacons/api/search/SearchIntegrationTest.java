package uk.gov.mca.beacons.api.search;

import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.reactive.server.WebTestClient;
import uk.gov.mca.beacons.api.WebIntegrationTest;

public class SearchIntegrationTest extends WebIntegrationTest {

  @Nested
  class GivenChangesToTransactionalRecordsShouldBeReflectedInSearchRecords {

    @Test
    public void whenANewBeaconIsRegistered_thenItIsSearchable()
      throws Exception {
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

      String legacyBeaconId = seedLegacyBeacon(fixture ->
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
  }

  @Nested
  class GivenABeacon {

    @Test
    public void whenTheBeaconHasAnAssociatedMaritimeUse_searchForBeaconUsingMmsiVesselNameCallSign()
      throws Exception {
      String vesselMmsiNumber = "123456789";
      String vesselName = "My Vessel";
      String vesselCallsign = "GE123";
      String accountHolderId = seedAccountHolder();
      String beaconId = seedRegistration(
        RegistrationUseCase.SINGLE_BEACON,
        accountHolderId,
        fixture ->
          fixture
            .replace("this is my MMSI number", vesselMmsiNumber)
            .replace("HMS Victory", vesselName)
            .replace("Fish and Ships", vesselCallsign)
      );

      String vesselMmsiSearchQuery =
        "{\"query\": {\"match\": {\"vesselMmsiNumbers\":\"" +
        vesselMmsiNumber +
        "\"}}}";

      queryOpenSearch(vesselMmsiSearchQuery)
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

      String vesselCallsignSearchQuery =
        "{\"query\": {\"match\": {\"vesselCallsigns\":\"" +
        vesselCallsign +
        "\"}}}";

      queryOpenSearch(vesselCallsignSearchQuery)
        .jsonPath("$.hits.total.value")
        .isEqualTo(1)
        .jsonPath("$.hits.hits[0]._id")
        .isEqualTo(beaconId);
    }

    @Test
    public void whenTheBeaconHasAnAviationUse_findItUsingRegistrationMarkAndHexAddress()
      throws Exception {
      String aircraftRegistrationMark = "G-AXDN";
      String aircraft24bitHexAddress = "ABC123";
      String accountHolderId = seedAccountHolder();
      String beaconId = seedRegistration(
        RegistrationUseCase.SINGLE_BEACON,
        accountHolderId,
        fixture ->
          fixture
            .replace("R-PLCM", aircraftRegistrationMark)
            .replace("F0FFFF", aircraft24bitHexAddress)
      );

      String mmsiSearchQuery =
        "{\"query\": {\"match\": {\"aircraftRegistrationMarks\":\"" +
        aircraftRegistrationMark +
        "\"}}}";

      queryOpenSearch(mmsiSearchQuery)
        .jsonPath("$.hits.total.value")
        .isEqualTo(1)
        .jsonPath("$.hits.hits[0]._id")
        .isEqualTo(beaconId);

      String aircraft24bitHexAddressQuery =
        "{\"query\": {\"match\": {\"aircraft24bitHexAddresses\":\"" +
        aircraft24bitHexAddress +
        "\"}}}";

      queryOpenSearch(aircraft24bitHexAddressQuery)
        .jsonPath("$.hits.total.value")
        .isEqualTo(1)
        .jsonPath("$.hits.hits[0]._id")
        .isEqualTo(beaconId);
    }
  }

  @Nested
  class GivenALegacyBeacon {

    @Test
    public void whenTheLegacyBeaconHasAnAssociatedMaritimeUse_searchForLegacyBeaconUsingMmsiVesselNameCallSign()
      throws Exception {
      String vesselMmsiNumber = "123456789";
      String vesselName = "My Vessel";
      String vesselCallsign = "GE123";
      String legacyBeaconId = seedLegacyBeacon(fixture ->
        fixture
          .replace("235007399", vesselMmsiNumber)
          .replace("KAYCEE", vesselName)
          .replace("VQAS7", vesselCallsign)
      );
      // seed non-matching legacy beacon
      seedLegacyBeacon(fixture ->
        fixture
          .replace("235007399", "222222222")
          .replace("KAYCEE", "Doesn't match")
          .replace("VQAS7", "DNMTC")
      );
      reindexSearch();

      String vesselMmsiSearchQuery =
        "{\"query\": {\"match\": {\"vesselMmsiNumbers\":\"" +
        vesselMmsiNumber +
        "\"}}}";

      queryOpenSearch(vesselMmsiSearchQuery)
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

      String vesselCallsignSearchQuery =
        "{\"query\": {\"match\": {\"vesselCallsigns\":\"" +
        vesselCallsign +
        "\"}}}";

      queryOpenSearch(vesselCallsignSearchQuery)
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
      String legacyBeaconId = seedLegacyBeacon(fixture ->
        fixture
          .replace("R-PLCM", aircraftRegistrationMark)
          .replace("F0FFFF", aircraft24bitHexAddress)
      );
      // seed non-matching legacy beacon
      seedLegacyBeacon(fixture ->
        fixture.replace("R-PLCM", "A-NOTH").replace("F0FFFF", "000000")
      );
      reindexSearch();

      String aircraftRegistrationMarkQuery =
        "{\"query\": {\"match\": {\"aircraftRegistrationMarks\":\"" +
        aircraftRegistrationMark +
        "\"}}}";

      queryOpenSearch(aircraftRegistrationMarkQuery)
        .jsonPath("$.hits.total.value")
        .isEqualTo(1)
        .jsonPath("$.hits.hits[0]._id")
        .isEqualTo(legacyBeaconId);

      String aircraft24bitHexAddressQuery =
        "{\"query\": {\"match\": {\"aircraft24bitHexAddresses\":\"" +
        aircraft24bitHexAddress +
        "\"}}}";

      queryOpenSearch(aircraft24bitHexAddressQuery)
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
