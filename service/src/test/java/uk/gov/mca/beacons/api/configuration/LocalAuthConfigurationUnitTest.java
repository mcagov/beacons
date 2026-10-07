package uk.gov.mca.beacons.api.configuration;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;

import org.junit.jupiter.api.Test;
import org.springframework.mock.env.MockEnvironment;

public class LocalAuthConfigurationUnitTest {

  @Test
  void startsForLocalDevelopment() {
    assertDoesNotThrow(() ->
      new LocalAuthConfiguration(withProfiles("dev", "seed", "localauth"))
    );
  }

  @Test
  void refusesToStartWithTheDeployedProfiles() {
    assertThrows(IllegalStateException.class, () ->
      new LocalAuthConfiguration(
        withProfiles("default", "migration", "localauth")
      )
    );
  }

  @Test
  void refusesToStartAlongsideDeployedProfilesEvenWithDev() {
    assertThrows(IllegalStateException.class, () ->
      new LocalAuthConfiguration(withProfiles("dev", "migration", "localauth"))
    );
  }

  @Test
  void refusesToStartWithoutDev() {
    assertThrows(IllegalStateException.class, () ->
      new LocalAuthConfiguration(withProfiles("localauth"))
    );
  }

  private MockEnvironment withProfiles(String... profiles) {
    MockEnvironment environment = new MockEnvironment();
    environment.setActiveProfiles(profiles);
    return environment;
  }
}
