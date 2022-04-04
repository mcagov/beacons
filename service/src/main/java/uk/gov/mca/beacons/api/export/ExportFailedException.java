package uk.gov.mca.beacons.api.export;

public class ExportFailedException extends RuntimeException {

  public ExportFailedException(Throwable e) {
    super(e);
  }

  public ExportFailedException() {
    super();
  }
}
