package uk.gov.mca.beacons.api.duplicates.rest;

import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import javax.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import uk.gov.mca.beacons.api.auth.application.GetUserService;
import uk.gov.mca.beacons.api.beacon.domain.BeaconId;
import uk.gov.mca.beacons.api.duplicates.application.DuplicatesService;
import uk.gov.mca.beacons.api.duplicates.domain.DuplicateBeacon;
import uk.gov.mca.beacons.api.duplicates.domain.DuplicatesSummary;
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

  @GetMapping(value = "/")
  @PreAuthorize("hasAuthority('APPROLE_DELETE_BEACONS')")
  public ResponseEntity<List<DuplicatesSummary>> getDuplicates(
    @RequestParam int pageNumber,
    @RequestParam int duplicateSummariesPerPage
  ) {
    List<DuplicatesSummary> duplicateSummaries;

    try {
      duplicateSummaries =
        duplicatesService.getDuplicateSummaries(
          pageNumber,
          duplicateSummariesPerPage
        );
    } catch (Exception ex) {
      return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    return ResponseEntity.ok(duplicateSummaries);
  }

  @GetMapping(value = "/{hexId}")
  @PreAuthorize("hasAuthority('APPROLE_DELETE_BEACONS')")
  public ResponseEntity<List<DuplicateBeaconDTO>> getDuplicatesForHexId(
    @PathVariable String hexId
  ) {
    List<DuplicateBeaconDTO> duplicatesForHexId;

    try {
      duplicatesForHexId = duplicatesService.getDuplicatesForHexId(hexId);
    } catch (Exception ex) {
      return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    return ResponseEntity.ok(duplicatesForHexId);
  }
}
