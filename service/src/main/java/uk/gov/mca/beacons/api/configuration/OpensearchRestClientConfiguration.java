package uk.gov.mca.beacons.api.configuration;

import org.elasticsearch.client.RestHighLevelClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.elasticsearch.client.ClientConfiguration;
import org.springframework.data.elasticsearch.client.RestClients;
import org.springframework.data.elasticsearch.config.AbstractElasticsearchConfiguration;
import org.springframework.data.elasticsearch.repository.config.EnableElasticsearchRepositories;
import org.springframework.lang.NonNull;

@Configuration
@EnableElasticsearchRepositories(
  basePackages = "uk.gov.mca.beacons.api.search.repositories"
)
@ComponentScan(basePackages = { "uk.gov.mca.beacons.api.search" })
public class OpensearchRestClientConfiguration
  extends AbstractElasticsearchConfiguration {

  @Value("${opensearch.source.host}")
  private String host;

  @Value("${opensearch.source.port}")
  private int port;

  @Value("${opensearch.credentials.enabled}")
  private Boolean credentialsEnabled;

  @Value("${opensearch.credentials.user:n/a}")
  private String user;

  @Value("${opensearch.credentials.password:n/a}")
  private String password;

  @Bean
  @NonNull
  @Override
  public RestHighLevelClient elasticsearchClient() {
    ClientConfiguration clientConfiguration;

    if (credentialsEnabled) {
      clientConfiguration = clientConfigurationWithBasicAuthAndSslEnabled();
    } else {
      clientConfiguration = clientConfigurationWithoutBasicAuth();
    }
    return RestClients.create(clientConfiguration).rest();
  }

  private ClientConfiguration clientConfigurationWithBasicAuthAndSslEnabled() {
    return ClientConfiguration
      .builder()
      .connectedTo(host + ":" + port)
      .usingSsl()
      .withBasicAuth(user, password)
      .build();
  }

  private ClientConfiguration clientConfigurationWithoutBasicAuth() {
    return ClientConfiguration.builder().connectedTo(host + ":" + port).build();
  }
}
