package uk.gov.mca.beacons.api.export;

import java.io.*;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import javax.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import uk.gov.mca.beacons.api.export.application.ExportService;
import uk.gov.mca.beacons.api.export.rest.BeaconExportDTO;
import uk.gov.mca.beacons.api.export.rest.LabelDTO;
import uk.gov.mca.beacons.api.export.xlsx.XlsxExporter;

@RestController
@RequestMapping("/spring-api/export")
class ExportController {

  private final XlsxExporter xlsxExporter;
  private final PdfGenerateService pdfService;
  private final ExportService exportService;

  @Autowired
  public ExportController(
    XlsxExporter xlsxExporter,
    PdfGenerateService pdfService,
    ExportService exportService
  ) {
    this.xlsxExporter = xlsxExporter;
    this.exportService = exportService;
    this.pdfService = pdfService;
  }

  @GetMapping(value = "/xlsx")
  @PreAuthorize("hasAuthority('APPROLE_DATA_EXPORTER')")
  public ResponseEntity<Resource> downloadExistingXlsxExport()
    throws IOException {
    Resource latestExport = new FileSystemResource(
      xlsxExporter
        .getMostRecentExport()
        .orElseThrow(() ->
          new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE)
        )
    );

    return serveFile(latestExport);
  }

  @PostMapping(value = "/xlsx")
  @PreAuthorize("hasAuthority('APPROLE_DATA_EXPORTER')")
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

  @PreAuthorize("hasAuthority('APPROLE_ADMIN_EXPORT')")
  @GetMapping(value = "/label/{uuid}")
  public ResponseEntity<byte[]> getLabelByBeaconId(
    @PathVariable("uuid") UUID rawBeaconId
  ) throws Exception {
    LabelDTO data = exportService.getLabelDTO(rawBeaconId);

    byte[] file = pdfService.createPdfLabel(data);

    return ResponseEntity
      .ok()
      .contentType(MediaType.APPLICATION_PDF)
      .body(file);
  }

  @PreAuthorize("hasAuthority('APPROLE_ADMIN_EXPORT')")
  @PostMapping(value = "/labels")
  public ResponseEntity<byte[]> getLabelsByBeaconIds(
    @RequestBody @Valid List<UUID> rawBeaconIds
  ) throws Exception {
    List<LabelDTO> dataList = rawBeaconIds
      .stream()
      .map(id -> exportService.getLabelDTO(id))
      .filter(dto -> dto != null)
      .collect(Collectors.toList());

    byte[] file = pdfService.createPdfLabels(dataList);

    return ResponseEntity
      .ok()
      .contentType(MediaType.APPLICATION_PDF)
      .body(file);
  }

  @PreAuthorize("hasAuthority('APPROLE_ADMIN_EXPORT')")
  @PostMapping(value = "/beacons/data")
  public ResponseEntity<List<BeaconExportDTO>> getBeacons(
    @RequestBody @Valid List<UUID> rawBeaconIds
  ) throws Exception {
    List<BeaconExportDTO> dataList = rawBeaconIds
      .stream()
      .map(id -> exportService.getBeaconExportDTO(id, null))
      .filter(dto -> dto != null)
      .collect(Collectors.toList());

    return ResponseEntity
      .ok()
      .contentType(MediaType.APPLICATION_JSON)
      .body(dataList);
  }

  @PreAuthorize("hasAuthority('APPROLE_ADMIN_EXPORT')")
  @GetMapping(value = "/certificate/data/{uuid}")
  public ResponseEntity<BeaconExportDTO> getCertificateDataByBeaconId(
    @PathVariable("uuid") UUID rawBeaconId
  ) {
    BeaconExportDTO data = exportService.getBeaconExportDTO(
      rawBeaconId,
      "Certificate"
    );

    return ResponseEntity
      .ok()
      .contentType(MediaType.APPLICATION_JSON)
      .body(data);
  }

  @PreAuthorize("hasAuthority('APPROLE_ADMIN_EXPORT')")
  @PostMapping(value = "/certificates/data")
  public ResponseEntity<List<BeaconExportDTO>> getCertificatesDataByBeaconIds(
    @RequestBody @Valid List<UUID> rawBeaconIds
  ) throws Exception {
    List<BeaconExportDTO> dataList = rawBeaconIds
      .stream()
      .map(id -> exportService.getBeaconExportDTO(id, "Certificate"))
      .filter(dto -> dto != null)
      .collect(Collectors.toList());

    return ResponseEntity
      .ok()
      .contentType(MediaType.APPLICATION_JSON)
      .body(dataList);
  }

  @PreAuthorize("hasAuthority('APPROLE_ADMIN_EXPORT')")
  @GetMapping(value = "/letter/data/{uuid}")
  public ResponseEntity<BeaconExportDTO> getLetterDataByBeaconId(
    @PathVariable("uuid") UUID rawBeaconId
  ) {
    BeaconExportDTO data = exportService.getBeaconExportDTO(
      rawBeaconId,
      "Letter"
    );

    return ResponseEntity
      .ok()
      .contentType(MediaType.APPLICATION_JSON)
      .body(data);
  }

  @PreAuthorize("hasAuthority('APPROLE_ADMIN_EXPORT')")
  @PostMapping(value = "/letters/data")
  public ResponseEntity<List<BeaconExportDTO>> postRetrieveLettersByBeaconIds(
    @RequestBody @Valid List<UUID> ids
  ) throws Exception {
    List<BeaconExportDTO> dataList = ids
      .stream()
      .map(id -> exportService.getBeaconExportDTO(id, "Letter"))
      .filter(dto -> dto != null)
      .collect(Collectors.toList());

    return ResponseEntity
      .ok()
      .contentType(MediaType.APPLICATION_JSON)
      .body(dataList);
  }
}
