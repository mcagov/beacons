package uk.gov.mca.beacons.api.registration.application;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.util.Optional;
import java.util.UUID;
import org.junit.Assert;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import uk.gov.mca.beacons.api.accountholder.application.AccountHolderService;
import uk.gov.mca.beacons.api.beacon.application.BeaconService;
import uk.gov.mca.beacons.api.beacon.domain.Beacon;
import uk.gov.mca.beacons.api.beacon.domain.BeaconId;
import uk.gov.mca.beacons.api.beaconowner.application.BeaconOwnerService;
import uk.gov.mca.beacons.api.beaconuse.application.BeaconUseService;
import uk.gov.mca.beacons.api.emergencycontact.application.EmergencyContactService;
import uk.gov.mca.beacons.api.legacybeacon.application.LegacyBeaconService;
import uk.gov.mca.beacons.api.note.application.NoteService;

public class RegistrationServiceUnitTest {

  @Mock
  AccountHolderService mockAccountHolderService = mock(
    AccountHolderService.class
  );

  @Mock
  BeaconService mockBeaconService = mock(BeaconService.class);

  @Mock
  BeaconOwnerService mockBeaconOwnerService = mock(BeaconOwnerService.class);

  @Mock
  BeaconUseService mockBeaconUseService = mock(BeaconUseService.class);

  @Mock
  EmergencyContactService mockEmergencyContactService = mock(
    EmergencyContactService.class
  );

  @Mock
  LegacyBeaconService mockLegacyBeaconService = mock(LegacyBeaconService.class);

  @Mock
  NoteService mockNoteService = mock(NoteService.class);

  @InjectMocks
  RegistrationService registrationService = new RegistrationService(
    mockAccountHolderService,
    mockBeaconService,
    mockBeaconOwnerService,
    mockBeaconUseService,
    mockEmergencyContactService,
    mockLegacyBeaconService,
    mockNoteService
  );

  @Test
  public void modernBeaconExists_whenAModernBeaconWithTheGivenIdDoesNotExist_shouldReturnFalse() {
    BeaconId beaconId = new BeaconId(UUID.randomUUID());
    when(mockBeaconService.findById(beaconId)).thenReturn(Optional.empty());

    boolean beaconExists = registrationService.modernBeaconExists(beaconId);

    Assert.assertEquals(false, beaconExists);
  }
}
