package uk.gov.mca.beacons.api.export;

import java.io.*;
import java.util.ArrayList;
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
import uk.gov.mca.beacons.api.beacon.domain.BeaconId;
import uk.gov.mca.beacons.api.exceptions.ResourceNotFoundException;
import uk.gov.mca.beacons.api.export.mappers.ExportMapper;
import uk.gov.mca.beacons.api.export.rest.BeaconExportDTO;
import uk.gov.mca.beacons.api.export.rest.LabelDTO;
import uk.gov.mca.beacons.api.export.xlsx.XlsxExporter;
import uk.gov.mca.beacons.api.legacybeacon.application.LegacyBeaconService;
import uk.gov.mca.beacons.api.legacybeacon.domain.LegacyBeacon;
import uk.gov.mca.beacons.api.legacybeacon.domain.LegacyBeaconId;
import uk.gov.mca.beacons.api.note.application.NoteService;
import uk.gov.mca.beacons.api.registration.application.RegistrationService;
import uk.gov.mca.beacons.api.registration.domain.Registration;

@RestController
@RequestMapping("/spring-api/export")
class ExportController {

  private final XlsxExporter xlsxExporter;
  private final RegistrationService registrationService;
  private final LegacyBeaconService legacyBeaconService;
  private final ExportMapper exportMapper;
  private final PdfGenerateService pdfService;
  private final NoteService noteService;

  @Autowired
  public ExportController(
    XlsxExporter xlsxExporter,
    RegistrationService rs,
    LegacyBeaconService lbs,
    ExportMapper em,
    PdfGenerateService pdfService,
    NoteService ns
  ) {
    this.xlsxExporter = xlsxExporter;
    this.registrationService = rs;
    this.legacyBeaconService = lbs;
    this.exportMapper = em;
    this.pdfService = pdfService;
    this.noteService = ns;
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
    //    headers.add("Access-Control-Allow-Origin", "*");
    return new ResponseEntity<>(resource, headers, HttpStatus.OK);
  }

  @GetMapping(value = "/label/{uuid}")
  public ResponseEntity<byte[]> getLabelByBeaconId(
    @PathVariable("uuid") UUID rawBeaconId
  ) throws Exception {
    LabelDTO data = getLabelDTO(rawBeaconId);

    byte[] file = pdfService.createPdfLabel(data);

    return servePdf(file, "Label.pdf");
  }

  @GetMapping(value = "/labels/{uuids}")
  public ResponseEntity<byte[]> getLabelsByBeaconIds(
    @PathVariable("uuids") List<UUID> rawBeaconIds
  ) throws Exception {
    List<LabelDTO> dataList = rawBeaconIds
      .stream()
      .map(id -> getLabelDTO(id))
      .filter(dto -> dto != null)
      .collect(Collectors.toList());

    byte[] file = pdfService.createPdfLabels(dataList);

    return servePdf(file, "Labels.pdf");
  }

  private LabelDTO getLabelDTO(UUID rawBeaconId) {
    BeaconId beaconId = new BeaconId(rawBeaconId);

    try {
      Registration registration = registrationService.getByBeaconId(beaconId);
      LabelDTO data = exportMapper.toLabelDTO(registration);

      //Only create note for modern for now.
      noteService.createSystemNote(beaconId, "Label Generated");
      return data;
    } catch (ResourceNotFoundException ex) {
      LegacyBeacon legacyBeacon = legacyBeaconService
        .findById(new LegacyBeaconId(rawBeaconId))
        .orElse(null);

      if (legacyBeacon == null) {
        return null;
      }
      return exportMapper.toLegacyLabelDTO(legacyBeacon);
    }
  }

  @PostMapping(value = "/beacons/search")
  public ResponseEntity<List<BeaconExportDTO>> searchBeacons()
    throws Exception {
    List<BeaconExportDTO> dataList = new ArrayList<>();
    return ResponseEntity
      .ok()
      .contentType(MediaType.APPLICATION_JSON)
      .body(dataList);
  }

  @GetMapping(value = "/beacons/data/all")
  public ResponseEntity<List<BeaconExportDTO>> getBeacons() throws Exception {
    //    List<BeaconExportDTO> dataList = rawBeaconIds
    //            .stream()
    //            .map(id -> getBeaconExportDTO(id, null))
    //            .filter(dto -> dto!=null)
    //            .collect(Collectors.toList());

    List<BeaconExportDTO> dataList = new ArrayList<>();
    return ResponseEntity
      .ok()
      .contentType(MediaType.APPLICATION_JSON)
      .body(dataList);
  }

  @PostMapping(value = "/beacons/data")
  public ResponseEntity<List<BeaconExportDTO>> getBeacons(
    @RequestBody @Valid List<UUID> rawBeaconIds
  ) throws Exception {
    List<BeaconExportDTO> dataList = rawBeaconIds
      .stream()
      .map(id -> getBeaconExportDTO(id, null))
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
    BeaconExportDTO data = getBeaconExportDTO(rawBeaconId, "Certificate");

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
      .map(id -> getBeaconExportDTO(id, "Certificate"))
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
    BeaconExportDTO data = getBeaconExportDTO(rawBeaconId, "Letter");

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
      .map(id -> getBeaconExportDTO(id, "Letter"))
      .filter(dto -> dto != null)
      .collect(Collectors.toList());

    return ResponseEntity
      .ok()
      .contentType(MediaType.APPLICATION_JSON)
      .body(dataList);
  }

  private BeaconExportDTO getBeaconExportDTO(
    UUID rawBeaconId,
    String noteGeneratedType
  ) {
    BeaconId beaconId = new BeaconId(rawBeaconId);

    try {
      Registration registration = registrationService.getByBeaconId(beaconId);
      BeaconExportDTO data = exportMapper.toBeaconExportDTO(
        registration,
        noteService.getNonSystemNotes(beaconId)
      );

      if (noteGeneratedType != null) {
        //Only create note for modern for now.
        noteService.createSystemNote(
          beaconId,
          noteGeneratedType + " Generated"
        );
      }
      return data;
    } catch (ResourceNotFoundException ex) {
      LegacyBeacon legacyBeacon = legacyBeaconService
        .findById(new LegacyBeaconId(rawBeaconId))
        .orElse(null);
      if (legacyBeacon == null) {
        return null;
      }
      return exportMapper.toLegacyBeaconExportDTO(legacyBeacon);
    }
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
