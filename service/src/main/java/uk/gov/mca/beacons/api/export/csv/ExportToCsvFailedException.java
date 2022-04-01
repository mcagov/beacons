package uk.gov.mca.beacons.api.export.csv;

public class ExportToCsvFailedException extends RuntimeException {

  public ExportToCsvFailedException(Throwable e) {
    super(e);
  }

  public ExportToCsvFailedException() {
    super();
  }
}
