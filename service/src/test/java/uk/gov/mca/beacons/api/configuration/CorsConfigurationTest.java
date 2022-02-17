package uk.gov.mca.beacons.api.configuration;

import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.servlet.config.annotation.CorsRegistration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@ExtendWith(MockitoExtension.class)
class CorsConfigurationTest {

  private CorsConfiguration corsConfiguration;

  private WebMvcConfigurer webMvcConfigurer;

  @Mock
  private CorsRegistry registry;

  @Mock
  private CorsRegistration corsRegistration;

  @BeforeEach
  void init() {
    corsConfiguration = new CorsConfiguration();
  }

  @Test
  void shouldAddTheCorrectCorsConfigurationIfTheAllowedOriginsIsSupplied() {
    given(registry.addMapping("/**")).willReturn(corsRegistration);
    given(corsRegistration.allowedMethods("*")).willReturn(corsRegistration);
    final String[] allowedOrigins = {
      "http://localhost:8080",
      "http://localhost:8090",
    };

    webMvcConfigurer = corsConfiguration.corsConfigurer(allowedOrigins);
    webMvcConfigurer.addCorsMappings(registry);
    then(corsRegistration).should(times(1)).allowedOrigins(allowedOrigins);
  }

  @Test
  void shouldNotCallThroughToTheCorsRegistryIfTheAllowedOriginsIsNull() {
    webMvcConfigurer = corsConfiguration.corsConfigurer(null);
    webMvcConfigurer.addCorsMappings(registry);
    assertMocksNotCalled();
  }

  @Test
  void shouldNotCallThroughToTheCorsRegistryIfTheAllowedOriginsIsEmpty() {
    webMvcConfigurer = corsConfiguration.corsConfigurer(new String[] {});
    webMvcConfigurer.addCorsMappings(registry);
    assertMocksNotCalled();
  }

  private void assertMocksNotCalled() {
    then(registry).should(never()).addMapping("/**");
    then(corsRegistration).should(never()).allowedMethods("*");
    then(corsRegistration).should(never()).allowedOrigins();
  }
}
