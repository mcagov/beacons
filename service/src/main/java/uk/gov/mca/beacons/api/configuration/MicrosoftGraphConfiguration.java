package uk.gov.mca.beacons.api.configuration;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "microsoft-graph")
public class MicrosoftGraphConfiguration {

  private String clientId;
  private String clientSecret;
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

  public void setClientId(String clientId) {
    this.clientId = clientId;
  }

  public void setClientSecret(String clientSecret) {
    this.clientSecret = clientSecret;
  }

  public void setB2cTenantId(String b2cTenantId) {
    this.b2cTenantId = b2cTenantId;
  }

  public MicrosoftGraphConfiguration() {}
}
