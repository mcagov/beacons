package uk.gov.mca.beacons.api.delete.rest;

import io.swagger.v3.oas.annotations.tags.Tag;
import javax.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import uk.gov.mca.beacons.api.auth.application.GetUserService;
import uk.gov.mca.beacons.api.beacon.domain.BeaconId;
import uk.gov.mca.beacons.api.exceptions.ResourceNotFoundException;
import uk.gov.mca.beacons.api.registration.application.RegistrationService;
import uk.gov.mca.beacons.api.registration.domain.Registration;
import uk.gov.mca.beacons.api.registration.rest.DeleteBeaconDTO;
import uk.gov.mca.beacons.api.shared.domain.user.User;

@RestController
@RequestMapping("/spring-api/delete")
@Tag(name = "Delete Controller")
public class DeleteController {

  private final RegistrationService registrationService;
  private final GetUserService getUserService;

  @Autowired
  public DeleteController(
    RegistrationService registrationService,
    GetUserService getUserService
  ) {
    this.registrationService = registrationService;
    this.getUserService = getUserService;
  }

  @PatchMapping(value = "/backoffice")
  @PreAuthorize("hasAuthority('APPROLE_DELETE_BEACONS')")
  public ResponseEntity<Void> softDeleteRecord(
    @RequestBody @Valid DeleteBeaconDTO dto
  ) {
    User brtUser = getUserService.getUser();
    BeaconId beaconId = new BeaconId(dto.getBeaconId());

    try {
      Registration registration = registrationService.getByBeaconId(beaconId);
      registrationService.delete(dto, brtUser);
    } catch (ResourceNotFoundException ex) {
      registrationService.deleteLegacyBeacon(dto);
    }

    return new ResponseEntity<>(HttpStatus.OK);
  }
}
