package uk.gov.mca.beacons.api.search.rest;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.PagedModel;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import uk.gov.mca.beacons.api.search.BeaconSearchService;
import uk.gov.mca.beacons.api.search.domain.BeaconSearchEntity;

@Slf4j
@RestController
@RequestMapping("/spring-api/beacon-search/search")
@RequiredArgsConstructor
@Tag(name = "BeaconSearch")
public class BeaconSearchController {

  private final BeaconSearchService beaconSearchService;
  private final PagedResourcesAssembler<BeaconSearchEntity> pagedAssembler;

  @Cacheable(value = "beacons-search")
  @GetMapping("/find-all")
  @Operation(summary = "Find all beacons matching specific fields (paginated)")
  public ResponseEntity<PagedModel<EntityModel<BeaconSearchEntity>>> findAllBeacons(
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
    Page<BeaconSearchEntity> results = beaconSearchService.findAllBeacons(
      status,
      uses,
      hexId,
      ownerName,
      cospasSarsatNumber,
      manufacturerSerialNumber,
      pageable
    );

    var pagedModel = pagedAssembler.toModel(results);

    return ResponseEntity.ok(pagedModel);
  }
}
