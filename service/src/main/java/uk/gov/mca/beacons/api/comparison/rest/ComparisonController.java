package uk.gov.mca.beacons.api.comparison.rest;

import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import java.util.UUID;
import javax.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import uk.gov.mca.beacons.api.dto.WrapperDTO;
import uk.gov.mca.beacons.api.exceptions.InvalidBeaconDeleteException;
import uk.gov.mca.beacons.api.exceptions.ResourceNotFoundException;
import uk.gov.mca.beacons.api.legacybeacon.application.LegacyBeaconService;
import uk.gov.mca.beacons.api.legacybeacon.domain.LegacyBeacon;
import uk.gov.mca.beacons.api.legacybeacon.domain.LegacyBeaconId;
import uk.gov.mca.beacons.api.legacybeacon.mappers.LegacyBeaconMapper;
import uk.gov.mca.beacons.api.legacybeacon.rest.dto.LegacyBeaconDTO;
import uk.gov.mca.beacons.api.registration.application.RegistrationService;
import uk.gov.mca.beacons.api.registration.rest.DeleteBeaconDTO;
import uk.gov.mca.beacons.api.search.documents.BeaconSearchDocument;

@RestController
@RequestMapping("/spring-api/comparison")
@Tag(name = "comparison Controller")
public class ComparisonController {

  private final RegistrationService registrationService;
  private final LegacyBeaconService legacyBeaconService;
  private final LegacyBeaconMapper legacyBeaconMapper;

  @Autowired
  public ComparisonController(
    RegistrationService registrationService,
    LegacyBeaconService legacyBeaconService,
    LegacyBeaconMapper legacyBeaconMapper
  ) {
    this.registrationService = registrationService;
    this.legacyBeaconService = legacyBeaconService;
    this.legacyBeaconMapper = legacyBeaconMapper;
  }

  @GetMapping(value = "/")
  public ResponseEntity<List<BeaconSearchDocument>> get() {
    List<LegacyBeacon> legacyBeacons = legacyBeaconService.findAll();

    List<BeaconSearchDocument> beacons = List.of(new BeaconSearchDocument());

    return ResponseEntity.ok(beacons);
  }
}
