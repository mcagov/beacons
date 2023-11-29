package uk.gov.mca.beacons.api.beaconuse.rest;

import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import java.util.UUID;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import uk.gov.mca.beacons.api.beacon.domain.BeaconId;
import uk.gov.mca.beacons.api.beacon.rest.BeaconDTO;
import uk.gov.mca.beacons.api.beaconuse.application.BeaconUseService;
import uk.gov.mca.beacons.api.beaconuse.domain.BeaconUse;
import uk.gov.mca.beacons.api.beaconuse.domain.BeaconUseId;
import uk.gov.mca.beacons.api.beaconuse.mappers.BeaconUseMapper;
import uk.gov.mca.beacons.api.dto.WrapperDTO;
import uk.gov.mca.beacons.api.exceptions.InvalidPatchException;

@Slf4j
@RestController
@RequestMapping("/spring-api/beacon-use")
@Tag(name = "Beacon Use")
public class BeaconUseController {

  private final BeaconUseService service;
  private final BeaconUseMapper beaconUseMapper;

  @Autowired
  public BeaconUseController(
    BeaconUseService service,
    BeaconUseMapper beaconUseMapper
  ) {
    this.service = service;
    this.beaconUseMapper = beaconUseMapper;
  }

  @PatchMapping(value = "/{beaconId}/{useIndex}")
  public ResponseEntity updateUse(
    @PathVariable("beaconId") UUID rawBeaconId,
    @PathVariable("useIndex") int useIndex,
    @RequestBody WrapperDTO<CreateBeaconUseDTO> dto
  ) {
    BeaconId beaconId = new BeaconId(rawBeaconId);
    List<BeaconUse> beaconUses = service.getByBeaconId(beaconId);
    BeaconUse use = beaconUses.get(useIndex);
    BeaconUseId useId = use.getId();

    final BeaconUse update = beaconUseMapper.fromDTO(dto.getData());
    if (!useId.equals(useId)) throw new InvalidPatchException();

    BeaconUse updatedBeaconUse = service.update(useId, update);
    return ResponseEntity.ok(beaconUseMapper.toDTO(updatedBeaconUse));
  }
}
