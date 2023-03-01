package uk.gov.mca.beacons.api.duplicates.rest;

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
import uk.gov.mca.beacons.api.duplicates.application.DuplicatesService;
import uk.gov.mca.beacons.api.exceptions.ResourceNotFoundException;
import uk.gov.mca.beacons.api.registration.application.RegistrationService;
import uk.gov.mca.beacons.api.registration.domain.Registration;
import uk.gov.mca.beacons.api.registration.rest.DeleteBeaconDTO;
import uk.gov.mca.beacons.api.shared.domain.user.User;

@RestController
@RequestMapping("/spring-api/duplicates")
@Tag(name = "Duplicates Controller")
public class DuplicatesController {

  private final DuplicatesService duplicatesService;

  @Autowired
  public DuplicatesController(DuplicatesService duplicatesService) {
    this.duplicatesService = duplicatesService;
  }

  @PatchMapping(value = "/")
  @PreAuthorize("hasAuthority('APPROLE_DELETE_BEACONS')")
  public ResponseEntity<DuplicatesSummaryDTO> getDuplicates() {
    DuplicatesSummaryDTO duplicatesSummaryDTO;

    try {
      duplicatesSummaryDTO =
        new DuplicatesSummaryDTO(duplicatesService.getDuplicateSummaries());
    } catch (Exception ex) {
      return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    return ResponseEntity.ok(duplicatesSummaryDTO);
  }

  @PatchMapping(value = "/{hexId}")
  @PreAuthorize("hasAuthority('APPROLE_DELETE_BEACONS')")
  public ResponseEntity<DuplicateBeaconsDTO> getDuplicatesForHexId(
    String hexId
  ) {
    DuplicateBeaconsDTO duplicateBeaconsDTO;

    try {
      duplicateBeaconsDTO =
        new DuplicateBeaconsDTO(duplicatesService.getDuplicatesForHexId(hexId));
    } catch (Exception ex) {
      return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    return ResponseEntity.ok(duplicateBeaconsDTO);
  }
}
