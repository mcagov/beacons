package uk.gov.mca.beacons.api.export;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Optional;
import java.util.stream.Stream;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import uk.gov.mca.beacons.api.export.xlsx.BeaconsDataWorkbookRepository;

/**
 * Encapsulates file system access for the export package
 */
@Slf4j
@Component
public class FileSystemRepository {

  private final ExportFileNamer fileNamer;

  private Path exportDirectory;

  @Autowired
  public FileSystemRepository(
    ExportFileNamer fileNamer,
    @Value("${export.directory}") Path exportDirectory
  ) {
    this.exportDirectory = exportDirectory;
    this.fileNamer = fileNamer;
  }

  /**
   * Return the most recent existing export of the requested FileType
   *
   * @param fileType The export FileType to search for.
   * @return An Optional Path to the most recent export.
   * @throws IOException if there is a problem accessing the file system
   */

  public Optional<Path> findMostRecentExport(
    ExportFileNamer.FileType fileType,
    String operationName
  ) throws IOException {
    Stream<Path> allFilesOfGivenTypeForOperation = Files
      .list(exportDirectory)
      .filter(f ->
        f.toString().contains(operationName) &&
        f.toString().endsWith(fileType.extension)
      );

    return fileNamer.mostRecentFile(allFilesOfGivenTypeForOperation);
  }

  /**
   * Whether or not an export exists for today
   *
   * @param fileType The export FileType to search for.
   * @return boolean
   * @throws IOException if there is a problem accessing the file system
   */
  public boolean todaysExportExists(
    ExportFileNamer.FileType fileType,
    String operationName
  ) throws IOException {
    return Files
      .list(exportDirectory)
      .filter(path -> !Files.isDirectory(path))
      .filter(path ->
        path.getFileName().endsWith(fileType.extension) &&
        path.getFileName().toString().contains(operationName)
      )
      .anyMatch(fileNamer::isDatedToday);
  }

  /**
   * The path of the next file to which data should be exported
   *
   * @param fileType The file type of the export
   * @return Path the path where the next export should be exported
   */
  public Path getNextExportDestination(
    ExportFileNamer.FileType fileType,
    BeaconsDataWorkbookRepository.OperationType operationType
  ) {
    Path destination = exportDirectory.resolve(
      fileNamer.constructTodaysExportFilename(fileType, operationType)
    );

    assert Files.notExists(destination);

    return destination;
  }
}
