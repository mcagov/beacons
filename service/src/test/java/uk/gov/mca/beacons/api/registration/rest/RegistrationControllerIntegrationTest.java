package uk.gov.mca.beacons.api.registration.rest;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import uk.gov.mca.beacons.api.WebIntegrationTest;

public class RegistrationControllerIntegrationTest extends WebIntegrationTest {

  private String accountHolderId;

  @BeforeEach
  void init() throws Exception {
    accountHolderId = seedAccountHolder();
  }

  @Nested
  class NewRegistration {

    @Test
    void shouldRegisterNewRegistration() throws Exception {
      final String registrationBody = getRegistrationBody(
        RegistrationUseCase.SINGLE_BEACON,
        accountHolderId
      );

      webTestClient
        .post()
        .uri(Endpoints.Registration.value + "/register")
        .contentType(MediaType.APPLICATION_JSON)
        .bodyValue(registrationBody)
        .exchange()
        .expectStatus()
        .isCreated()
        .expectHeader()
        .valueEquals("Content-Type", MediaType.APPLICATION_JSON_VALUE)
        .expectBody()
        .json(registrationBody);
    }
  }

  @Nested
  class UpdateRegistration {

    private String beaconId;

    @BeforeEach
    void init() throws Exception {
      beaconId =
        seedRegistration(RegistrationUseCase.SINGLE_BEACON, accountHolderId);
    }

    @Test
    void shouldUpdateTheBeacon() throws Exception {
      final String updateRegistrationBody = getRegistrationBody(
        RegistrationUseCase.BEACON_TO_UPDATE,
        accountHolderId
      );

      webTestClient
        .patch()
        .uri(Endpoints.Registration.value + "/register/" + beaconId)
        .contentType(MediaType.APPLICATION_JSON)
        .bodyValue(updateRegistrationBody)
        .exchange()
        .expectStatus()
        .isOk()
        .expectBody()
        .json(updateRegistrationBody);

      webTestClient
        .get()
        .uri(Endpoints.Registration.value + "/" + beaconId)
        .exchange()
        .expectStatus()
        .isOk()
        .expectBody()
        .json(updateRegistrationBody);
    }
  }

  @Nested
  class GetRegistrationByBeaconId {

    private String beaconId;

    @BeforeEach
    void init() throws Exception {
      beaconId =
        seedRegistration(RegistrationUseCase.SINGLE_BEACON, accountHolderId);
    }

    @Test
    void shouldGetTheRegistrationByBeaconId() throws Exception {
      final String registrationBody = getRegistrationBody(
        RegistrationUseCase.SINGLE_BEACON,
        accountHolderId
      );

      webTestClient
        .get()
        .uri(Endpoints.Registration.value + "/" + beaconId)
        .exchange()
        .expectStatus()
        .isOk()
        .expectBody()
        .json(registrationBody);
    }
  }

  @Nested
  class GetRegistrationsByAccountHolderId {

    String firstBeaconId;
    String secondBeaconId;

    @BeforeEach
    void init() throws Exception {
      firstBeaconId =
        seedRegistration(RegistrationUseCase.SINGLE_BEACON, accountHolderId);
      secondBeaconId =
        seedRegistration(RegistrationUseCase.BEACON_TO_UPDATE, accountHolderId);
    }

    @Test
    void shouldGetTheRegistrationsByAccountHolderId() {
      webTestClient
        .get()
        .uri(
          Endpoints.Registration.value + "?accountHolderId=" + accountHolderId
        )
        .exchange()
        .expectStatus()
        .isOk()
        .expectBody()
        .jsonPath("$[0].id")
        .isEqualTo(secondBeaconId)
        .jsonPath("$[1].id")
        .isEqualTo(firstBeaconId);
    }
  }

  @Nested
  class DeleteRegistration {

    String beaconId;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void init() throws Exception {
      beaconId =
        seedRegistration(RegistrationUseCase.SINGLE_BEACON, accountHolderId);
    }

    @Test
    void shouldDeleteRegistration() throws Exception {
      String reason = "I dN't WaNT It";
      String deleteRegistrationRequestBody = createDeleteRequest(
        accountHolderId,
        beaconId,
        reason
      );

      webTestClient
        .patch()
        .uri(Endpoints.Registration.value + "/" + beaconId + "/delete")
        .contentType(MediaType.APPLICATION_JSON)
        .bodyValue(deleteRegistrationRequestBody)
        .exchange()
        .expectStatus()
        .isOk();

      webTestClient
        .get()
        .uri(Endpoints.Registration.value + "/" + beaconId)
        .exchange()
        .expectStatus()
        .isOk()
        .expectBody()
        .jsonPath("$.id")
        .isEqualTo(beaconId)
        .jsonPath("$.status")
        .isEqualTo("DELETED")
        .jsonPath("$.owner")
        .isEmpty()
        .jsonPath("$.uses")
        .isEmpty()
        .jsonPath("$.emergencyContacts")
        .isEmpty();

      webTestClient
        .get()
        .uri(Endpoints.Note.value + "?beaconId=" + beaconId)
        .exchange()
        .expectStatus()
        .isOk()
        .expectBody()
        .jsonPath("$.meta.count")
        .isEqualTo(1)
        .jsonPath("$.data[0].attributes.beaconId")
        .isEqualTo(beaconId);
    }

    private String createDeleteRequest(
      String accountHolderId,
      String beaconId,
      String reason
    ) throws Exception {
      DeleteRegistrationDTO dto = DeleteRegistrationDTO
        .builder()
        .beaconId(UUID.fromString(beaconId))
        .userId(UUID.fromString(accountHolderId))
        .reason(reason)
        .build();

      return objectMapper.writeValueAsString(dto);
    }
  }

  @Nested
  class ClaimLegacyBeacon {

    @Test
    @DisplayName(
      "When a registration is made with a matching Beacon HexId and AccountHolder email, should claim a matching legacy beacon"
    )
    void shouldClaimMatchingLegacyBeacon() throws Exception {
      //setup
      String legacyBeaconId = seedLegacyBeacon(
        fixture ->
          fixture
            .replace("ownerbeacon@beacons.com", "testy@mctestface.com")
            .replace("9D0E1D1B8C00001", "1D0EA08C52FFBFF")
      );
      final String registrationBody = getRegistrationBody(
        RegistrationUseCase.SINGLE_BEACON,
        accountHolderId
      );

      // act
      webTestClient
        .post()
        .uri(Endpoints.Registration.value + "/register")
        .contentType(MediaType.APPLICATION_JSON)
        .bodyValue(registrationBody)
        .exchange()
        .expectStatus()
        .isCreated()
        .expectHeader()
        .valueEquals("Content-Type", MediaType.APPLICATION_JSON_VALUE)
        .expectBody()
        .json(registrationBody);

      // assert
      webTestClient
        .get()
        .uri(Endpoints.LegacyBeacon.value + "/" + legacyBeaconId)
        .exchange()
        .expectStatus()
        .isOk()
        .expectBody()
        .jsonPath("$.data.attributes.claimStatus")
        .isEqualTo("CLAIMED");
    }
  }
}
