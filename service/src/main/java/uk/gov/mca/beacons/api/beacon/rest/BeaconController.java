package uk.gov.mca.beacons.api.beacon.rest;

import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import uk.gov.mca.beacons.api.beacon.application.BeaconService;
import uk.gov.mca.beacons.api.beacon.domain.Beacon;
import uk.gov.mca.beacons.api.beacon.domain.BeaconId;
import uk.gov.mca.beacons.api.beacon.mappers.BeaconMapper;
import uk.gov.mca.beacons.api.dto.WrapperDTO;
import uk.gov.mca.beacons.api.exceptions.InvalidPatchException;

@RestController
@RequestMapping("/spring-api/beacons")
@Tag(name = "Beacon Controller")
public class BeaconController {

  private final BeaconMapper beaconMapper;
  private final BeaconService beaconService;

  @Autowired
  public BeaconController(
    BeaconMapper beaconMapper,
    BeaconService beaconService
  ) {
    this.beaconMapper = beaconMapper;
    this.beaconService = beaconService;
  }

  @PatchMapping(value = "/{uuid}")
  @PreAuthorize("hasAuthority('APPROLE_UPDATE_RECORDS')")
  public ResponseEntity<WrapperDTO<BeaconDTO>> update(
    @PathVariable("uuid") UUID id,
    @RequestBody WrapperDTO<UpdateBeaconDTO> dto
  ) {
    final Beacon update = beaconMapper.fromDTO(dto.getData());
    if (!id.equals(dto.getData().getId())) throw new InvalidPatchException();

    Beacon updatedBeacon = beaconService.update(new BeaconId(id), update);
    return ResponseEntity.ok(beaconMapper.toWrapperDTO(updatedBeacon));
  }
}
