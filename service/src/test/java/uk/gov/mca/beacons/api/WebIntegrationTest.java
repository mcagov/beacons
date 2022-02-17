package uk.gov.mca.beacons.api;

import com.jayway.jsonpath.JsonPath;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.reactive.AutoConfigureWebTestClient;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.web.reactive.server.WebTestClient;
import org.springframework.web.reactive.function.BodyInserters;
import org.testcontainers.shaded.com.fasterxml.jackson.databind.ObjectMapper;

@AutoConfigureWebTestClient
public abstract class WebIntegrationTest extends BaseIntegrationTest {

  @Autowired
  protected WebTestClient webTestClient;

  protected enum Endpoints {
    AccountHolder("/spring-api/account-holder"),
    Beacon("/spring-api/beacons"),
    LegacyBeacon("/spring-api/legacy-beacon"),
    Migration("/spring-api/migrate"),
    Note("/spring-api/note"),
    Registration("/spring-api/registrations"),
    Job("/spring-api/job");

    public final String value;

    Endpoints(String value) {
      this.value = value;
    }
  }

  // TEST SEEDERS

  /**
   *
   * @param authId random UUID as String
   * @return AccountHolderId as String
   * @throws Exception from reading fixture
   */
  protected String seedAccountHolder(String authId) throws Exception {
    final String createAccountHolderRequest = fixtureHelper.getFixture(
      "src/test/resources/fixtures/createAccountHolderRequest.json",
      fixture -> fixture.replace("replace-with-test-auth-id", authId)
    );

    return JsonPath.read(
      webTestClient
        .post()
        .uri(Endpoints.AccountHolder.value)
        .body(BodyInserters.fromValue(createAccountHolderRequest))
        .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
        .exchange()
        .returnResult(String.class)
        .getResponseBody()
        .blockFirst(),
      "$.data.id"
    );
  }

  /**
   *
   * @return AccountHolderId as String
   * @throws Exception From reading fixture
   */
  protected String seedAccountHolder() throws Exception {
    return seedAccountHolder(UUID.randomUUID().toString());
  }

  /**
   *
   * @return LegacyBeaconId as String
   * @throws Exception from reading fixture
   */
  protected String seedLegacyBeacon() throws Exception {
    return seedLegacyBeacon(fixture -> fixture);
  }

  protected String seedLegacyBeacon(Function<String, String> replacer)
    throws Exception {
    String createLegacyBeaconRequest = fixtureHelper.getFixture(
      "src/test/resources/fixtures/createLegacyBeaconRequest.json",
      replacer
    );

    return JsonPath.read(
      webTestClient
        .post()
        .uri(Endpoints.Migration.value + "/legacy-beacon")
        .body(BodyInserters.fromValue(createLegacyBeaconRequest))
        .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
        .exchange()
        .returnResult(String.class)
        .getResponseBody()
        .blockFirst(),
      "$.data.id"
    );
  }

  protected enum RegistrationUseCase {
    SINGLE_BEACON,
    BEACON_TO_UPDATE,
    NO_HEX_ID,
    NO_USES,
    NO_EMERGENCY_CONTACTS,
  }

  /**
   *
   * @param useCase RegistrationUseCase
   * @param accountHolderId AccountHolderId to associate with registration
   * @return id of the registered Beacon
   * @throws Exception from reading fixture
   */
  protected String seedRegistration(
    RegistrationUseCase useCase,
    String accountHolderId
  ) throws Exception {
    final String registrationBody = getRegistrationBody(
      useCase,
      accountHolderId
    );
    return JsonPath.read(
      webTestClient
        .post()
        .uri(Endpoints.Registration.value + "/register")
        .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
        .contentType(MediaType.APPLICATION_JSON)
        .bodyValue(registrationBody)
        .exchange()
        .returnResult(String.class)
        .getResponseBody()
        .blockFirst(),
      "$.id"
    );
  }

  protected String getRegistrationBody(
    RegistrationUseCase useCase,
    String accountHolderId
  ) throws Exception {
    final String REGISTRATION_JSON_RESOURCE =
      "src/test/resources/fixtures/registrations.json";

    final ObjectMapper mapper = new ObjectMapper();

    @SuppressWarnings("unchecked")
    final Map<String, Map<String, Object>> registrationMap = mapper.readValue(
      fixtureHelper.getFixture(
        REGISTRATION_JSON_RESOURCE,
        fixture ->
          fixture.replace(
            "replace-with-test-account-holder-id",
            accountHolderId
          )
      ),
      HashMap.class
    );

    return mapper.writeValueAsString(registrationMap.get(useCase.toString()));
  }
}
