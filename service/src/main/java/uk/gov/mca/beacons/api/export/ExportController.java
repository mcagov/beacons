package uk.gov.mca.beacons.api.export;

import java.io.*;
import java.util.Date;
import java.util.Map;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import uk.gov.mca.beacons.api.beacon.domain.BeaconId;
import uk.gov.mca.beacons.api.exceptions.ResourceNotFoundException;
import uk.gov.mca.beacons.api.export.xlsx.XlsxExporter;
import uk.gov.mca.beacons.api.note.application.NoteService;
import uk.gov.mca.beacons.api.registration.application.RegistrationService;
import uk.gov.mca.beacons.api.registration.domain.Registration;

@RestController
@RequestMapping("/spring-api/export")
//@PreAuthorize("hasAuthority('APPROLE_DATA_EXPORTER')")
class ExportController {

  private final XlsxExporter xlsxExporter;
  private final RegistrationService registrationService;
  private final PdfGenerateService pdfService;
  private final NoteService noteService;
  private final String contactNumber = "+44 (0)1326 317575";

  @Autowired
  public ExportController(
    XlsxExporter xlsxExporter,
    RegistrationService rs,
    PdfGenerateService pdfService,
    NoteService ns
  ) {
    this.xlsxExporter = xlsxExporter;
    this.registrationService = rs;
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

    Map<String, Object> data = registrationService.getLabelData(registration);

    data.put("contactNumber", contactNumber);

    //    byte[] file = pdfService.generatePdf("Label", data).toByteArray();
    byte[] file = pdfService.createLabelPdf(data);

    return ResponseEntity
      .ok()
      .contentType(MediaType.APPLICATION_PDF)
      .body(file);
    //    noteService.createSystemNote(beaconId, "Label Generated");
    //    return servePdf(file, "Label.pdf");
  }

  @GetMapping(value = "/letter/{uuid}")
  public ResponseEntity<byte[]> getLetterByBeaconId(
    @PathVariable("uuid") UUID rawBeaconId
  ) throws Exception {
    BeaconId beaconId = new BeaconId(rawBeaconId);
    Registration registration = registrationService.getByBeaconId(beaconId);

    if (registration == null) {
      throw new ResourceNotFoundException();
    }

    Map<String, Object> data = registrationService.getCertificateData(
      registration
    ); // Needs to bring back data for letter

    data.put("contactNumber", contactNumber);

    byte[] file = pdfService.generatePdf("Letter", data).toByteArray();

    noteService.createSystemNote(beaconId, "Letter Generated");
    return servePdf(file, "Letter.pdf");
  }

  @GetMapping(value = "/certificate/data/{uuid}")
  public ResponseEntity<Map<String, Object>> getCertificateDataByBeaconId(
    @PathVariable("uuid") UUID rawBeaconId
  ) throws Exception {
    BeaconId beaconId = new BeaconId(rawBeaconId);
    Registration registration = registrationService.getByBeaconId(beaconId);

    if (registration == null) {
      throw new ResourceNotFoundException();
    }

    Map<String, Object> data = registrationService.getCertificateData(
      registration
    );

    data.put("proofOfRegistrationDate", new Date());
    data.put("contactNumber", contactNumber);

    return ResponseEntity
      .ok()
      .contentType(MediaType.APPLICATION_JSON)
      .body(data);
  }

  @GetMapping(value = "/certificate/{uuid}")
  public ResponseEntity<byte[]> getCertificateByBeaconId(
    @PathVariable("uuid") UUID rawBeaconId
  ) throws Exception {
    BeaconId beaconId = new BeaconId(rawBeaconId);
    Registration registration = registrationService.getByBeaconId(beaconId);

    if (registration == null) {
      throw new ResourceNotFoundException();
    }

    Map<String, Object> data = registrationService.getCertificateData(
      registration
    );

    data.put("contactNumber", contactNumber);

    byte[] file = pdfService.generatePdf("Certificate", data).toByteArray();
    noteService.createSystemNote(beaconId, "Certificate Generated");
    //    return servePdf(file, "Certificate.pdf");
    return ResponseEntity
      .ok()
      .contentType(MediaType.APPLICATION_PDF)
      .body(file);
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
