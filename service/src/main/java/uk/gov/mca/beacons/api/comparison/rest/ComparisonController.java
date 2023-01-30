package uk.gov.mca.beacons.api.comparison.rest;

import io.swagger.v3.oas.annotations.tags.Tag;
import java.io.IOException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import uk.gov.mca.beacons.api.search.BeaconSearchService;

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
  public ResponseEntity<ComparisonResult> get() throws IOException {
    ComparisonResult result = beaconSearchService.compareDataSources();

    return ResponseEntity
      .ok()
      .contentType(MediaType.APPLICATION_JSON)
      .body(result);
  }
}
