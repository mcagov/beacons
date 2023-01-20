package uk.gov.mca.beacons.api.comparison.rest;

import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import uk.gov.mca.beacons.api.search.BeaconSearchService;
import uk.gov.mca.beacons.api.search.domain.BeaconOverview;

@RestController
@RequestMapping("/spring-api/comparison")
@Tag(name = "comparison Controller")
public class ComparisonController {

  private final BeaconSearchService beaconSearchService;

  @Autowired
  public ComparisonController(BeaconSearchService beaconSearchService) {
    this.beaconSearchService = beaconSearchService;
  }

  @GetMapping(value = "/missing")
  public ResponseEntity<ComparisonResult> get() {
    List<BeaconOverview> dbBeacons = beaconSearchService.getBeaconOverviews();
    List<UUID> opensearchBeaconIds = beaconSearchService.getBeaconSearchIds();

    List<BeaconOverview> missingBeacons = dbBeacons
      .stream()
      .filter(bo -> !opensearchBeaconIds.contains(bo.getId()))
      .collect(Collectors.toList());

    ComparisonResult response = new ComparisonResult();

    response.setDbCount(dbBeacons.size());
    response.setOpenSearchCount(opensearchBeaconIds.size());
    response.setMissingCount(missingBeacons.size());
    response.setMissing(missingBeacons);

    return ResponseEntity
      .ok()
      .contentType(MediaType.APPLICATION_JSON)
      .body(response);
  }
}
