package uk.gov.mca.beacons.api.export;

import java.io.IOException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/spring-api/export")
public class ExportController {
    private final ExportService exportService;

    @Autowired
    public ExportController(ExportService exportService) {
        this.exportService = exportService;
    }

    @GetMapping(value="/excel")
    public HttpEntity<ByteArrayResource> downloadExcelSpreadsheet() throws IOException {
        byte[] excelContent = exportService.getLatestExcelExport();

        HttpHeaders header = new HttpHeaders();
        header.setContentType(new MediaType("application", "force-download"));
        header.set(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=my_file.xlsx");

        return new HttpEntity<>(new ByteArrayResource(excelContent), header);
    }
}
