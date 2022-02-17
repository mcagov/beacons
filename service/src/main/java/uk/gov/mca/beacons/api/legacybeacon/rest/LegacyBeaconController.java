package uk.gov.mca.beacons.api.legacybeacon.rest;

import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import uk.gov.mca.beacons.api.dto.WrapperDTO;
import uk.gov.mca.beacons.api.exceptions.ResourceNotFoundException;
import uk.gov.mca.beacons.api.legacybeacon.application.LegacyBeaconService;
import uk.gov.mca.beacons.api.legacybeacon.domain.LegacyBeaconId;
import uk.gov.mca.beacons.api.legacybeacon.mappers.LegacyBeaconMapper;
import uk.gov.mca.beacons.api.legacybeacon.rest.dto.LegacyBeaconDTO;

@RestController
@RequestMapping("/spring-api/legacy-beacon")
@Tag(name = "Legacy Beacon Controller")
public class LegacyBeaconController {

  private final LegacyBeaconService legacyBeaconService;
  private final LegacyBeaconMapper legacyBeaconMapper;

  @Autowired
  public LegacyBeaconController(
    LegacyBeaconService legacyBeaconService,
    LegacyBeaconMapper legacyBeaconMapper
  ) {
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
}
