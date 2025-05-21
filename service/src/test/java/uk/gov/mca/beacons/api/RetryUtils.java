package uk.gov.mca.beacons.api;

import java.util.function.Supplier;

public class RetryUtils {

  public static <T> T runWithRetries(int retries, Supplier<T> run)
    throws Throwable {
    try {
      return run.get();
    } catch (Throwable e) {
      if (retries > 0) {
        Thread.sleep(5000);
        return runWithRetries(retries - 1, run);
      } else {
        throw e instanceof AssertionError
          ? (AssertionError) e
          : new RuntimeException(e);
      }
    }
  }

  public static <T> void runWithRetries(Supplier<T> run) throws Throwable {
    runWithRetries(5, run);
  }
}
