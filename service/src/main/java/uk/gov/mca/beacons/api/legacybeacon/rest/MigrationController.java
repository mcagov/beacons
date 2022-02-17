package uk.gov.mca.beacons.api.legacybeacon.rest;

import io.swagger.v3.oas.annotations.tags.Tag;
import javax.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import uk.gov.mca.beacons.api.dto.WrapperDTO;
import uk.gov.mca.beacons.api.legacybeacon.application.LegacyBeaconService;
import uk.gov.mca.beacons.api.legacybeacon.domain.LegacyBeacon;
import uk.gov.mca.beacons.api.legacybeacon.mappers.LegacyBeaconMapper;
import uk.gov.mca.beacons.api.legacybeacon.rest.dto.LegacyBeaconDTO;

@RestController
@RequestMapping("/spring-api/migrate")
@Tag(name = "Migration Controller")
@Profile("migration | dev")
public class MigrationController {

  private final LegacyBeaconMapper legacyBeaconMapper;
  private final LegacyBeaconService legacyBeaconService;

  @Autowired
  public MigrationController(
    LegacyBeaconMapper legacyBeaconMapper,
    LegacyBeaconService legacyBeaconService
  ) {
    this.legacyBeaconMapper = legacyBeaconMapper;
    this.legacyBeaconService = legacyBeaconService;
  }

  @GetMapping(value = "/")
  public String base() {
    return "Migration Controller";
  }

  @PostMapping(value = "/legacy-beacon")
  @ResponseStatus(HttpStatus.CREATED)
  public WrapperDTO<LegacyBeaconDTO> createLegacyBeacon(
    @RequestBody @Valid WrapperDTO<LegacyBeaconDTO> wrapperDTO
  ) {
    final LegacyBeacon legacyBeacon = legacyBeaconMapper.fromDTO(
      wrapperDTO.getData()
    );

    return legacyBeaconMapper.toWrapperDTO(
      legacyBeaconService.create(legacyBeacon)
    );
  }
  // TODO: Assess whether it's still necessary/safe to expose a delete-all endpoint for legacy beacons
}
