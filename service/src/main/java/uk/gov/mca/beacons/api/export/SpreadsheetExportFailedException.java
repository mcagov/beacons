package uk.gov.mca.beacons.api.export;

public class SpreadsheetExportFailedException extends RuntimeException {

  public SpreadsheetExportFailedException(Throwable e) {
    super(e);
  }
}
