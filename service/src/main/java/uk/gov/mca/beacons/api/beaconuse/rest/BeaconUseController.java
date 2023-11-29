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
import uk.gov.mca.beacons.api.dto.WrapperDTO;

@Slf4j
@RestController
@RequestMapping("/spring-api/beacon-use")
@Tag(name = "Beacon Use")
public class BeaconUseController {

  private final BeaconUseService service;

  @Autowired
  public BeaconUseController(BeaconUseService service) {
    this.service = service;
  }
  //Todo
  //    @PatchMapping(value = "/{beaconId}/{useIndex}")
  //    public ResponseEntity updateUse(
  //            @PathVariable("beaconId") UUID rawBeaconId,
  //            @PathVariable("useIndex") int useIndex,
  //            @RequestBody WrapperDTO<BeaconDTO> wrapperDTO
  //            ) {
  //        BeaconId beaconId = new BeaconId(rawBeaconId);
  //        List<BeaconUse> beaconUses = service.getByBeaconId(beaconId);
  //        BeaconUse use = beaconUses.get(useIndex);
  //        UUID useId = wrapperDTO.getData().getId();
  //
  //    }
}
