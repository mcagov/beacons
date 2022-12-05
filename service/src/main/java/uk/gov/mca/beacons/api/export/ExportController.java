package uk.gov.mca.beacons.api.export;

import io.swagger.v3.oas.annotations.tags.Tag;
import java.io.*;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import javax.validation.Valid;
import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import uk.gov.mca.beacons.api.accountholder.application.AccountHolderService;
import uk.gov.mca.beacons.api.auth.application.GetUserService;
import uk.gov.mca.beacons.api.auth.gateway.AuthGatewayImpl;
import uk.gov.mca.beacons.api.beacon.application.BeaconService;
import uk.gov.mca.beacons.api.export.application.ExportService;
import uk.gov.mca.beacons.api.export.mappers.ExportMapper;
import uk.gov.mca.beacons.api.export.rest.BeaconExportDTO;
import uk.gov.mca.beacons.api.export.rest.LabelDTO;
import uk.gov.mca.beacons.api.export.xlsx.XlsxExporter;
import uk.gov.mca.beacons.api.export.xlsx.backup.SpreadsheetExportGenerator;
import uk.gov.mca.beacons.api.legacybeacon.application.LegacyBeaconService;
import uk.gov.mca.beacons.api.legacybeacon.domain.LegacyBeacon;
import uk.gov.mca.beacons.api.legacybeacon.domain.LegacyBeaconId;
import uk.gov.mca.beacons.api.note.application.NoteService;
import uk.gov.mca.beacons.api.registration.application.RegistrationService;
import uk.gov.mca.beacons.api.registration.domain.Registration;

@RestController
@RequestMapping("/spring-api/export")
@Tag(name = "Export Controller")
class ExportController {

  private final XlsxExporter xlsxExporter;
  private final PdfGenerateService pdfService;
  private final ExportService exportService;
  private final RegistrationService registrationService;
  private final BeaconService beaconService;
  private final LegacyBeaconService legacyBeaconService;
  private final NoteService noteService;
  private final AccountHolderService accountHolderService;
  private final ExportMapper exportMapper;
  private final GetUserService getUserService;

  @Autowired
  public ExportController(
    XlsxExporter xlsxExporter,
    PdfGenerateService pdfService,
    ExportService exportService,
    RegistrationService registrationService,
    BeaconService beaconService,
    LegacyBeaconService legacyBeaconService,
    NoteService noteService,
    AccountHolderService accountHolderService,
    ExportMapper exportMapper,
    GetUserService getUserService
  ) {
    this.xlsxExporter = xlsxExporter;
    this.exportService = exportService;
    this.pdfService = pdfService;
    this.registrationService = registrationService;
    this.beaconService = beaconService;
    this.legacyBeaconService = legacyBeaconService;
    this.noteService = noteService;
    this.accountHolderService = accountHolderService;
    this.exportMapper = exportMapper;
    this.getUserService = getUserService;
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

  @GetMapping(value = "/backup")
  @PreAuthorize("hasAuthority('APPROLE_DATA_EXPORTER')")
  public ResponseEntity<Resource> getXlsxBackupFile()
    throws IOException, InvalidFormatException {
    SpreadsheetExportGenerator csvGenerator = new SpreadsheetExportGenerator(
      registrationService,
      beaconService,
      legacyBeaconService,
      noteService,
      accountHolderService,
      exportMapper
    );
    return serveFile(csvGenerator.generateXlsxBackupExport());
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

  private ResponseEntity<byte[]> servePdf(byte[] file, String filename) {
    HttpHeaders headers = new HttpHeaders();
    headers.set(
      HttpHeaders.CONTENT_DISPOSITION,
      "attachment; filename=" + filename
    );
    headers.set(
      HttpHeaders.CACHE_CONTROL,
      "no-cache, no-store, must-revalidate"
    );
    //    headers.add("Access-Control-Allow-Origin", "*");
    return ResponseEntity
      .ok()
      .contentType(MediaType.APPLICATION_PDF)
      .headers(headers)
      .body(file);
  }
}
