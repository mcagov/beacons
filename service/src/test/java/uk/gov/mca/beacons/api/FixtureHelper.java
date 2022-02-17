package uk.gov.mca.beacons.api;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.function.Function;
import org.springframework.stereotype.Component;

@Component
public class FixtureHelper {

  public String getFixture(String path, Function<String, String> replacer)
    throws Exception {
    return replacer.apply(Files.readString(Paths.get(path)));
  }

  public String getFixture(String path) throws Exception {
    return Files.readString(Paths.get(path));
  }
}
