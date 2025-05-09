package uk.gov.mca.beacons.api.comparison.rest;

import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import uk.gov.mca.beacons.api.search.BeaconSearchService;

@RestController
@RequestMapping("/spring-api/comparison")
@Tag(name = "comparisonController")
public class ComparisonController {

  private final BeaconSearchService beaconSearchService;

  public ComparisonController(BeaconSearchService beaconSearchService) {
    this.beaconSearchService = beaconSearchService;
  }

  @GetMapping("/missing")
  public ResponseEntity<ComparisonResult> getMissingBeacons() {
    ComparisonResult result = beaconSearchService.compareDataSources();
    return ResponseEntity.ok()
      .contentType(MediaType.APPLICATION_JSON)
      .body(result);
  }
}
