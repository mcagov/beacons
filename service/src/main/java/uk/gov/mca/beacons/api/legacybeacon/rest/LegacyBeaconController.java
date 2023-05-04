package uk.gov.mca.beacons.api.legacybeacon.rest;

import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import uk.gov.mca.beacons.api.beacon.rest.UpdateBeaconDTO;
import uk.gov.mca.beacons.api.dto.WrapperDTO;
import uk.gov.mca.beacons.api.exceptions.ResourceNotFoundException;
import uk.gov.mca.beacons.api.legacybeacon.application.LegacyBeaconService;
import uk.gov.mca.beacons.api.legacybeacon.domain.LegacyBeaconId;
import uk.gov.mca.beacons.api.legacybeacon.mappers.LegacyBeaconMapper;
import uk.gov.mca.beacons.api.legacybeacon.rest.dto.LegacyBeaconDTO;
import uk.gov.mca.beacons.api.legacybeacon.rest.dto.UpdateRecoveryEmailDTO;
import uk.gov.mca.beacons.api.registration.application.RegistrationService;

@RestController
@RequestMapping("/spring-api/legacy-beacon")
@Tag(name = "Legacy Beacon Controller")
public class LegacyBeaconController {

  private final RegistrationService registrationService;
  private final LegacyBeaconService legacyBeaconService;
  private final LegacyBeaconMapper legacyBeaconMapper;

  @Autowired
  public LegacyBeaconController(
    RegistrationService registrationService,
    LegacyBeaconService legacyBeaconService,
    LegacyBeaconMapper legacyBeaconMapper
  ) {
    this.registrationService = registrationService;
    this.legacyBeaconService = legacyBeaconService;
    this.legacyBeaconMapper = legacyBeaconMapper;
  }

  @GetMapping(value = "/{uuid}")
  public WrapperDTO<LegacyBeaconDTO> findById(@PathVariable("uuid") UUID id) {
    final var legacyBeacon = legacyBeaconService
      .findById(new LegacyBeaconId(id))
      .orElseThrow(ResourceNotFoundException::new);

    return legacyBeaconMapper.toWrapperDTO(legacyBeacon);
  }

  @PreAuthorize("hasAuthority('APPROLE_UPDATE_RECORDS')")
  @PatchMapping(value = "/{uuid}")
  public WrapperDTO<UpdateRecoveryEmailDTO> updateRecoveryEmail(
    @PathVariable("uuid") UUID id,
    @RequestBody WrapperDTO<UpdateRecoveryEmailDTO> dto
  ) {
    LegacyBeaconId legacyBeaconId = new LegacyBeaconId(id);
    legacyBeaconService.updateRecoveryEmailByBeaconId(
      dto.getData().getRecoveryEmail(),
      legacyBeaconId
    );

    return dto;
  }
}
