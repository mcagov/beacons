package uk.gov.mca.beacons.api;

import java.util.Map;
import org.apache.http.HttpHost;
import org.elasticsearch.client.Request;
import org.elasticsearch.client.RestClient;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Nested;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.elasticsearch.client.RestClients;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.jdbc.JdbcTestUtils;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.elasticsearch.ElasticsearchContainer;
import org.testcontainers.utility.DockerImageName;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public abstract class BaseIntegrationTest {

  @Autowired
  protected FixtureHelper fixtureHelper;

  static final PostgreSQLContainer<?> POSTGRE_SQL_CONTAINER = new PostgreSQLContainer<>(
    DockerImageName.parse("postgres:12")
  )
    .withDatabaseName("beacons")
    .withUsername("beacons_service")
    .withPassword("password");

  protected static final ElasticsearchContainer OPENSEARCH_CONTAINER = new ElasticsearchContainer(
    DockerImageName
      .parse("opensearchproject/opensearch:1.1.0")
      .asCompatibleSubstituteFor(
        "docker.elastic.co/elasticsearch/elasticsearch"
      )
  )
    .withEnv(
      Map.of("plugins.security.disabled", "true", "network.host", "0.0.0.0")
    )
    .withExposedPorts(9200);

  static {
    POSTGRE_SQL_CONTAINER.start();
    OPENSEARCH_CONTAINER.start();
  }

  @DynamicPropertySource
  static void datasourceConfig(DynamicPropertyRegistry registry) {
    registry.add("spring.datasource.url", POSTGRE_SQL_CONTAINER::getJdbcUrl);
    registry.add(
      "spring.datasource.password",
      POSTGRE_SQL_CONTAINER::getPassword
    );
    registry.add(
      "spring.datasource.username",
      POSTGRE_SQL_CONTAINER::getUsername
    );

    registry.add("opensearch.source.host", OPENSEARCH_CONTAINER::getHost);
    registry.add(
      "opensearch.source.port",
      OPENSEARCH_CONTAINER::getFirstMappedPort
    );
  }

  @Autowired
  JdbcTemplate jdbcTemplate;

  @AfterEach
  public void cleanDatabase() {
    JdbcTestUtils.deleteFromTables(
      jdbcTemplate,
      "beacon_owner",
      "beacon_use",
      "emergency_contact",
      "note",
      "beacon",
      "account_holder",
      "legacy_beacon_claim_event",
      "legacy_beacon",
      "person"
    );
  }

  static RestClient restClient = RestClient
    .builder(HttpHost.create(OPENSEARCH_CONTAINER.getHttpHostAddress()))
    .build();

  @AfterEach
  public void cleanElasticSearch() throws Exception {
    Request request = new Request(
      "POST",
      "/beacon_search/_delete_by_query?conflicts=proceed"
    );
    request.setJsonEntity("{\"query\":{\"match_all\":{}}}");
    restClient.performRequest(request);
  }
}
