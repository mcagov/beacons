package uk.gov.mca.beacons.api.export;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import org.springframework.stereotype.Service;

@Service
public class ExportService {
    public byte[] getLatestExcelExport() throws IOException {
        Path path = Paths.get("/tmp/20220321-Beacons_export-Official_Sensitive-Personal.csv");

        return Files.readAllBytes(path);
    }
}
