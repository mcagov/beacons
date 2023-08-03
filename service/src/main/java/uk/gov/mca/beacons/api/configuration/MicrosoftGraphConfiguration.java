package uk.gov.mca.beacons.api.configuration;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class MicrosoftGraphConfiguration {

  @Value("${microsoft-graph.client-id}")
  private String clientId;

  @Value("${microsoft-graph.client-secret}")
  private String clientSecret;

  @Value("${microsoft-graph.b2c-tenant-id}")
  private String b2cTenantId;

  public String getClientId() {
    return clientId;
  }

  public String getClientSecret() {
    return clientSecret;
  }

  public String getB2cTenantId() {
    return b2cTenantId;
  }
}
