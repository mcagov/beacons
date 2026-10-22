package uk.gov.mca.beacons.api.beacon.rest;

import static org.mockito.BDDMockito.given;

import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.reactive.server.WebTestClient;
import uk.gov.mca.beacons.api.WebIntegrationTest;
import uk.gov.mca.beacons.api.auth.application.BeaconRolesService;
import uk.gov.mca.beacons.api.auth.gateway.AuthGatewayImpl.SupportedPermissions;

public class BeaconControllerIntegrationTest extends WebIntegrationTest {

  private String beaconId;

  @MockBean
  private BeaconRolesService beaconRolesService;

  @BeforeEach
  void init() throws Exception {
    String accountHolderId = seedAccountHolder();
    beaconId = seedRegistration(
      RegistrationUseCase.SINGLE_BEACON,
      accountHolderId
    );
  }

  @Test
  void shouldUpdateTheBeacon() throws Exception {
    final String updateBeaconRequest = fixtureHelper.getFixture(
      "src/test/resources/fixtures/updateBeaconRequest.json",
      fixture -> fixture.replace("replace-with-beacon-id", beaconId)
    );

    webTestClient
      .patch()
      .uri(Endpoints.Beacon.value + "/" + beaconId)
      .contentType(MediaType.APPLICATION_JSON)
      .bodyValue(updateBeaconRequest)
      .exchange()
      .expectStatus()
      .isOk()
      .expectBody()
      .jsonPath("$.data.id")
      .isEqualTo(beaconId)
      .jsonPath("$.data.attributes.manufacturer")
      .isEqualTo("ACR (Artex)");
  }

  @Test
  void shouldUpdateTheHexIdWhenTheUserHasTheUpdateBeaconHexIdRole()
    throws Exception {
    given(beaconRolesService.getUserRoles()).willReturn(
      List.of(
        SupportedPermissions.APPROLE_UPDATE_RECORDS,
        SupportedPermissions.APPROLE_UPDATE_BEACON_HEX_ID
      )
    );

    patchHexId(" 1d0ea08c52ffbf0 ")
      .expectStatus()
      .isOk()
      .expectBody()
      .jsonPath("$.data.attributes.hexId")
      .isEqualTo("1D0EA08C52FFBF0");
  }

  @Test
  void shouldRejectAHexIdUpdateWhenTheUserDoesNotHaveTheUpdateBeaconHexIdRole()
    throws Exception {
    given(beaconRolesService.getUserRoles()).willReturn(
      List.of(SupportedPermissions.APPROLE_UPDATE_RECORDS)
    );

    patchHexId("1D0EA08C52FFBF0").expectStatus().isForbidden();
  }

  @Test
  void shouldRejectAnInvalidHexId() throws Exception {
    given(beaconRolesService.getUserRoles()).willReturn(
      List.of(SupportedPermissions.APPROLE_UPDATE_BEACON_HEX_ID)
    );

    patchHexId("NOT-A-HEX-ID").expectStatus().isBadRequest();
  }

  private WebTestClient.ResponseSpec patchHexId(String hexId) {
    final String updateHexIdRequest =
      "{\"data\":{\"type\":\"beacon\",\"id\":\"" +
      beaconId +
      "\",\"attributes\":{\"hexId\":\"" +
      hexId +
      "\"}}}";

    return webTestClient
      .patch()
      .uri(Endpoints.Beacon.value + "/" + beaconId)
      .contentType(MediaType.APPLICATION_JSON)
      .bodyValue(updateHexIdRequest)
      .exchange();
  }
}
