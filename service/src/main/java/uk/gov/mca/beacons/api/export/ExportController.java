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
import uk.gov.mca.beacons.api.export.csv.CsvExporter;
import uk.gov.mca.beacons.api.export.xlsx.XlsxExporter;

@RestController
@RequestMapping("/spring-api/export")
class ExportController {

  private final CsvExporter csvExporter;

  private final XlsxExporter xlsxExporter;

  @Autowired
  public ExportController(CsvExporter csvExporter, XlsxExporter xlsxExporter) {
    this.csvExporter = csvExporter;
    this.xlsxExporter = xlsxExporter;
  }

  @GetMapping(value = "/csv")
  public ResponseEntity<Resource> downloadExistingCsvExport()
    throws ExportFailedException, IOException {
    Resource latestExport = new FileSystemResource(
      csvExporter
        .getMostRecentCsvExport()
        .orElseThrow(
          () -> new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE)
        )
    );

    return serveFile(latestExport);
  }

  @PostMapping(value = "/csv")
  public ResponseEntity<Void> createNewCsvExport() throws IOException {
    csvExporter.exportBeaconsToCsv();

    return ResponseEntity.ok().build();
  }

  @GetMapping(value = "/xlsx")
  public ResponseEntity<Resource> downloadExistingXlsxExport()
    throws IOException {
    Resource latestExport = new FileSystemResource(
      xlsxExporter
        .getMostRecentExport()
        .orElseThrow(
          () -> new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE)
        )
    );

    return serveFile(latestExport);
  }

  @PostMapping(value = "/xlsx")
  public ResponseEntity<Void> createNewXlsxExport() throws IOException {
    xlsxExporter.export();

    return ResponseEntity.ok().build();
  }

  private ResponseEntity<Resource> serveFile(Resource resource) {
    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(new MediaType("application", "force-download"));
    headers.set(
      HttpHeaders.CONTENT_DISPOSITION,
      "attachment; filename=" + resource.getFilename()
    );
    headers.set(
      HttpHeaders.CACHE_CONTROL,
      "no-cache, no-store, must-revalidate"
    );
    return new ResponseEntity<>(resource, headers, HttpStatus.OK);
  }
}
