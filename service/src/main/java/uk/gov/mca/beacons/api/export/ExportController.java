package uk.gov.mca.beacons.api.export;

import java.io.IOException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/spring-api/export")
public class ExportController {

  private final ExportService exportService;

  @Autowired
  public ExportController(ExportService exportService) {
    this.exportService = exportService;
  }

  @GetMapping(value = "/excel")
  public ResponseEntity<Resource> downloadExcelSpreadsheet()
    throws SpreadsheetExportFailedException, IOException {
    Resource latestExport = new FileSystemResource(
      exportService
        .getMostRecentDailyExport()
        .orElseThrow(
          () -> new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE)
        )
    );

    if (!latestExport.exists()) {
      return askToRetryAfterNSeconds(5);
    } else {
      return serveFile(latestExport);
    }
  }

  @PostMapping(value = "/excel")
  public ResponseEntity<Void> createANewExcelBackup() throws IOException {
    exportService.exportBeaconsToSpreadsheet();

    return ResponseEntity.ok().build();
  }

  private ResponseEntity<Resource> serveFile(Resource resource) {
    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(new MediaType("application", "force-download"));
    headers.set(
      HttpHeaders.CONTENT_DISPOSITION,
      "attachment; filename=my_file.xlsx"
    );
    return new ResponseEntity<>(resource, headers, HttpStatus.OK);
  }

  private ResponseEntity<Resource> askToRetryAfterNSeconds(int n) {
    HttpHeaders headers = new HttpHeaders();
    headers.set(HttpHeaders.RETRY_AFTER, String.valueOf(n));
    return new ResponseEntity<>(null, headers, HttpStatus.SERVICE_UNAVAILABLE);
  }
}
