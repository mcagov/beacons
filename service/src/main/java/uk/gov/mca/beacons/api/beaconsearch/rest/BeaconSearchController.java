package uk.gov.mca.beacons.api.beaconsearch.rest;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import uk.gov.mca.beacons.api.beaconsearch.BeaconSpecificationSearchService;
import uk.gov.mca.beacons.api.search.domain.BeaconSearchEntity;

@Slf4j
@RestController
@RequestMapping("/spring-api/search/beacons")
@Tag(name = "Find All Beacons")
public class BeaconSearchController {

  private final BeaconSpecificationSearchService beaconSpecificationSearchService;
  private final PagedResourcesAssembler<BeaconSearchEntity> pagedAssembler;

  @Autowired
  public BeaconSearchController(
    BeaconSpecificationSearchService beaconSpecificationSearchService,
    PagedResourcesAssembler<BeaconSearchEntity> pagedAssembler
  ) {
    this.beaconSpecificationSearchService = beaconSpecificationSearchService;
    this.pagedAssembler = pagedAssembler;
  }

  @Cacheable(value = "find-all-beacons")
  @GetMapping("/find-all")
  @Operation(summary = "Find all beacons matching specific fields (paginated)")
  public ResponseEntity<Page<BeaconSearchEntity>> findAllBeacons(
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
      Page<BeaconSearchEntity> results =
        beaconSpecificationSearchService.findAllBeacons(
          status,
          uses,
          hexId,
          ownerName,
          cospasSarsatNumber,
          manufacturerSerialNumber,
          pageable
        );

      return ResponseEntity.ok(results);
    } catch (Exception ex) {
      log.error("Failed to fetch beacons", ex);
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
        Page.empty()
      );
    }
  }
}
