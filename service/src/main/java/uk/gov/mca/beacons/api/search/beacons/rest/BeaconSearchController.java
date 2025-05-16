package uk.gov.mca.beacons.api.search.beacons.rest;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.PagedModel;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import uk.gov.mca.beacons.api.search.BeaconSearchService;
import uk.gov.mca.beacons.api.search.domain.BeaconSearchEntity;

@Slf4j
@RestController
@RequestMapping("/spring-api/search/beacons")
@Tag(name = "Find All Beacons")
public class BeaconSearchController {

  private final BeaconSearchService beaconSearchService;
  private final PagedResourcesAssembler<BeaconSearchEntity> pagedAssembler;

  @Autowired
  public BeaconSearchController(
    BeaconSearchService beaconSearchService,
    PagedResourcesAssembler<BeaconSearchEntity> pagedAssembler
  ) {
    this.beaconSearchService = beaconSearchService;
    this.pagedAssembler = pagedAssembler;
  }

  @Cacheable(value = "find-all-beacons")
  @GetMapping("/find-all")
  @Operation(summary = "Find all beacons matching specific fields (paginated)")
  public ResponseEntity<
    PagedModel<EntityModel<BeaconSearchEntity>>
  > findAllBeacons(
    @RequestParam(required = false, defaultValue = "") String status,
    @RequestParam(required = false, defaultValue = "") String uses,
    @RequestParam(required = false, defaultValue = "") String hexId,
    @RequestParam(required = false, defaultValue = "") String ownerName,
    @RequestParam(
      required = false,
      defaultValue = ""
    ) String cospasSarsatNumber,
    @RequestParam(
      required = false,
      defaultValue = ""
    ) String manufacturerSerialNumber,
    Pageable pageable
  ) {
    try {
      Page<BeaconSearchEntity> results = beaconSearchService.findAllBeacons(
        status,
        uses,
        hexId,
        ownerName,
        cospasSarsatNumber,
        manufacturerSerialNumber,
        pageable
      );

      var pagedModel = pagedAssembler.toModel(
        results,
        beacon ->
          EntityModel.of(
            beacon,
            linkTo(BeaconSearchController.class)
              .slash(beacon.getId())
              .withSelfRel(),
            linkTo(BeaconSearchController.class)
              .slash(beacon.getId())
              .withRel("beaconSearchEntity")
          ),
        linkTo(
          methodOn(BeaconSearchController.class).findAllBeacons(
            status,
            uses,
            hexId,
            ownerName,
            cospasSarsatNumber,
            manufacturerSerialNumber,
            pageable
          )
        ).withSelfRel()
      );
      return ResponseEntity.ok(pagedModel);
    } catch (Exception ex) {
      log.error("Failed to fetch beacons", ex);
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
        PagedModel.empty()
      );
    }
  }
}
