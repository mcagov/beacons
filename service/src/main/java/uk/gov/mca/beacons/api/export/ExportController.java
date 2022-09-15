package uk.gov.mca.beacons.api.export;

import java.io.*;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import uk.gov.mca.beacons.api.beacon.domain.Beacon;
import uk.gov.mca.beacons.api.beacon.domain.BeaconId;
import uk.gov.mca.beacons.api.exceptions.ResourceNotFoundException;
import uk.gov.mca.beacons.api.export.xlsx.XlsxExporter;
import uk.gov.mca.beacons.api.note.application.NoteService;
import uk.gov.mca.beacons.api.note.domain.Note;
import uk.gov.mca.beacons.api.note.domain.NoteType;
import uk.gov.mca.beacons.api.registration.application.RegistrationService;
import uk.gov.mca.beacons.api.registration.domain.Registration;
import uk.gov.mca.beacons.api.registration.mappers.RegistrationMapper;
import uk.gov.mca.beacons.api.registration.rest.CertificateDTO;
import uk.gov.mca.beacons.api.registration.rest.RegistrationDTO;

@RestController
@RequestMapping("/spring-api/export")
//@PreAuthorize("hasAuthority('APPROLE_DATA_EXPORTER')")
class ExportController {

  private final XlsxExporter xlsxExporter;
  private final RegistrationService registrationService;
  private final RegistrationMapper registrationMapper;
  private final PdfGenerateService pdfService;
  private final NoteService noteService;

  @Autowired
  public ExportController(
    XlsxExporter xlsxExporter,
    RegistrationService rs,
    RegistrationMapper rm,
    PdfGenerateService pdfService,
    NoteService ns
  ) {
    this.xlsxExporter = xlsxExporter;
    this.registrationService = rs;
    this.registrationMapper = rm;
    this.pdfService = pdfService;
    this.noteService = ns;
  }

  @GetMapping(value = "/xlsx")
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

  @GetMapping(value = "/label/{uuid}")
  public ResponseEntity<byte[]> getLabelByBeaconId(
    @PathVariable("uuid") UUID rawBeaconId
  ) throws Exception {
    BeaconId beaconId = new BeaconId(rawBeaconId);
    Registration registration = registrationService.getByBeaconId(beaconId);

    if (registration == null) {
      throw new ResourceNotFoundException();
    }

    Map<String, String> data = registrationService.getLabelData(registration);

    byte[] file = pdfService.createPdfLabel(data);

    return ResponseEntity
      .ok()
      .contentType(MediaType.APPLICATION_PDF)
      .body(file);
    //    noteService.createSystemNote(beaconId, "Label Generated");
    //    return servePdf(file, "Label.pdf");
  }

  /**
   * // This needs to be changed to a post, with form. Kept as GET for now for testing
   * @param rawBeaconIds
   * @return
   * @throws Exception
   */
  @GetMapping(value = "/labels/{uuids}")
  public ResponseEntity<byte[]> getLabelsByBeaconIds(
    @PathVariable("uuids") List<UUID> rawBeaconIds
  ) throws Exception {
    List<BeaconId> beaconIds = rawBeaconIds
      .stream()
      .map(id -> new BeaconId(id))
      .collect(Collectors.toList());
    List<Registration> registrations = beaconIds
      .stream()
      .map(id -> registrationService.getByBeaconId(id))
      .collect(Collectors.toList());

    if (registrations.isEmpty()) {
      throw new ResourceNotFoundException();
    }

    List<Map<String, String>> dataList = registrations
      .stream()
      .map(r -> registrationService.getLabelData(r))
      .collect(Collectors.toList());

    byte[] file = pdfService.createPdfLabels(dataList);
    beaconIds
      .stream()
      .forEach(id -> noteService.createSystemNote(id, "Label Generated"));

    //    return servePdf(file, "Label.pdf");
    return ResponseEntity
      .ok()
      .contentType(MediaType.APPLICATION_PDF)
      .body(file);
  }

  //  @GetMapping(value = "/letter/data/{uuid}")
  //  public ResponseEntity<Map<String, Object>> getLetterDataByBeaconId(
  //    @PathVariable("uuid") UUID rawBeaconId
  //  ) {
  //    BeaconId beaconId = new BeaconId(rawBeaconId);
  //    Registration registration = registrationService.getByBeaconId(beaconId);
  //
  //    if (registration == null) {
  //      throw new ResourceNotFoundException();
  //    }
  //
  //    Map<String, Object> data = registrationService.getLetterData(registration);
  //
  //    noteService.createSystemNote(beaconId, "Cover Letter Generated");
  //    return ResponseEntity
  //      .ok()
  //      .contentType(MediaType.APPLICATION_JSON)
  //      .body(data);
  //  }

  @GetMapping(value = "/certificate/data/{uuid}")
  public ResponseEntity<CertificateDTO> getCertificateDataByBeaconId(
    @PathVariable("uuid") UUID rawBeaconId
  ) {
    BeaconId beaconId = new BeaconId(rawBeaconId);
    Registration registration = registrationService.getByBeaconId(beaconId);

    if (registration == null) {
      throw new ResourceNotFoundException();
    }

    noteService.createSystemNote(beaconId, "Certificate Generated");

    List<Note> manuallyCreatedNotes = noteService
      .getByBeaconId(beaconId)
      .stream()
      .filter((note -> !(note.getFullName().equals("SYSTEM"))))
      .collect(Collectors.toList());

    return ResponseEntity
      .ok()
      .contentType(MediaType.APPLICATION_JSON)
      .body(
        registrationMapper.toCertificateDTO(registration, manuallyCreatedNotes)
      );
  }

  private ResponseEntity<byte[]> servePdf(byte[] file, String filename) {
    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_PDF);
    headers.set(
      HttpHeaders.CONTENT_DISPOSITION,
      "attachment; filename=" + filename
    );
    headers.set(
      HttpHeaders.CACHE_CONTROL,
      "no-cache, no-store, must-revalidate"
    );
    return new ResponseEntity<>(file, headers, HttpStatus.OK);
  }
}
