package uk.gov.mca.beacons.api.configuration;

import lombok.extern.slf4j.Slf4j;
import org.elasticsearch.client.RestHighLevelClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.dao.DataAccessResourceFailureException;
import org.springframework.data.elasticsearch.client.ClientConfiguration;
import org.springframework.data.elasticsearch.client.RestClients;
import org.springframework.data.elasticsearch.config.AbstractElasticsearchConfiguration;
import org.springframework.data.elasticsearch.repository.config.EnableElasticsearchRepositories;
import org.springframework.lang.NonNull;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.EnableRetry;
import org.springframework.retry.annotation.Retryable;

@Slf4j
@Configuration
@EnableElasticsearchRepositories(
  basePackages = "uk.gov.mca.beacons.api.search.repositories"
)
@ComponentScan(basePackages = { "uk.gov.mca.beacons.api.search" })
@EnableRetry
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
  @Retryable(
    value = { DataAccessResourceFailureException.class },
    maxAttempts = 10,
    backoff = @Backoff(delay = 5000, multiplier = 2) // 5s, then 10s, then 20s...
  )
  public RestHighLevelClient elasticsearchClient() {
    try {
      ClientConfiguration clientConfiguration;

      if (credentialsEnabled) {
        clientConfiguration = clientConfigurationWithBasicAuthAndSslEnabled();
      } else {
        clientConfiguration = clientConfigurationWithoutBasicAuth();
      }
      return RestClients.create(clientConfiguration).rest();
    } catch (DataAccessResourceFailureException e) {
      log.error(
        "Failed to configure OpenSearch client, will retry: {}",
        e.getMessage()
      );
      throw new RuntimeException(e);
    }
  }

  private ClientConfiguration clientConfigurationWithBasicAuthAndSslEnabled() {
    return ClientConfiguration.builder()
      .connectedTo(host + ":" + port)
      .usingSsl()
      .withBasicAuth(user, password)
      .build();
  }

  private ClientConfiguration clientConfigurationWithoutBasicAuth() {
    return ClientConfiguration.builder().connectedTo(host + ":" + port).build();
  }
}
