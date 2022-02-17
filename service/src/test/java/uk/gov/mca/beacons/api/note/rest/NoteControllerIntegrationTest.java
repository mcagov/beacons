package uk.gov.mca.beacons.api.note.rest;

import java.util.UUID;
import org.junit.Before;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.reactive.function.BodyInserters;
import uk.gov.mca.beacons.api.WebIntegrationTest;
import uk.gov.mca.beacons.api.auth.application.GetUserService;
import uk.gov.mca.beacons.api.auth.domain.BackOfficeUser;

public class NoteControllerIntegrationTest extends WebIntegrationTest {

  private String beaconId;

  private final BackOfficeUser user = BackOfficeUser
    .builder()
    .id(UUID.fromString("344848b9-8a5d-4818-a57d-1815528d543e"))
    .fullName("Jean ValJean")
    .email("24601@jail.fr")
    .build();

  @MockBean
  private GetUserService getUserService;

  @BeforeEach
  void init() throws Exception {
    String accountHolderId = seedAccountHolder();
    beaconId =
      seedRegistration(RegistrationUseCase.SINGLE_BEACON, accountHolderId);
  }

  @Test
  void shouldCreateNoteForBeacon() throws Exception {
    String createNoteRequest = getCreateNoteRequest(beaconId);
    String createNoteResponse = getCreateNoteResponse(beaconId);

    Mockito.when(getUserService.getUser()).thenReturn(user);

    webTestClient
      .post()
      .uri(Endpoints.Note.value)
      .body(BodyInserters.fromValue(createNoteRequest))
      .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
      .exchange()
      .expectStatus()
      .isCreated()
      .expectBody()
      .json(createNoteResponse);
  }

  private String getCreateNoteRequest(String beaconId) throws Exception {
    return fixtureHelper.getFixture(
      "src/test/resources/fixtures/createNoteRequest.json",
      fixture -> fixture.replace("replace-with-test-beacon-id", beaconId)
    );
  }

  private String getCreateNoteResponse(String beaconId) throws Exception {
    return fixtureHelper.getFixture(
      "src/test/resources/fixtures/createNoteResponse.json",
      fixture -> fixture.replace("replace-with-test-beacon-id", beaconId)
    );
  }
}
