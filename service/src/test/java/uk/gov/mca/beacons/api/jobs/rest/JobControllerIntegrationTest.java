package uk.gov.mca.beacons.api.jobs.rest;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.*;

import com.jayway.jsonpath.JsonPath;
import java.util.concurrent.TimeUnit;
import javax.batch.runtime.BatchStatus;
import org.elasticsearch.action.search.SearchRequest;
import org.elasticsearch.client.RequestOptions;
import org.elasticsearch.client.RestHighLevelClient;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.builder.SearchSourceBuilder;
import org.elasticsearch.search.sort.FieldSortBuilder;
import org.elasticsearch.search.sort.SortOrder;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.batch.test.JobRepositoryTestUtils;
import org.springframework.batch.test.context.SpringBatchTest;
import org.springframework.beans.factory.annotation.Autowired;
import uk.gov.mca.beacons.api.WebIntegrationTest;

public class JobControllerIntegrationTest extends WebIntegrationTest {

  @Autowired
  private JobRepositoryTestUtils jobRepositoryTestUtils;

  @Autowired
  private RestHighLevelClient restHighLevelClient;

  @AfterEach
  void cleanContext() {
    jobRepositoryTestUtils.removeJobExecutions();
  }

  @Test
  void whenJobIsTriggeredViaEndpoint_ShouldWriteBeaconSearchDocumentsToOpensearch()
    throws Exception {
    // given
    String accountHolderId_1 = seedAccountHolder();
    String accountHolderId_2 = seedAccountHolder();
    String seededRegistrationId_1 = seedLegacyBeacon();
    String seededRegistrationId_2 = seedLegacyBeacon(
      fixture -> fixture.replace("2004-10-13T00:00:00", "2014-10-13T00:00:00")
    );
    String seededRegistrationId_3 = seedRegistration(
      RegistrationUseCase.SINGLE_BEACON,
      accountHolderId_1
    );
    String seededRegistrationId_4 = seedRegistration(
      RegistrationUseCase.SINGLE_BEACON,
      accountHolderId_2
    );

    // when
    String location = JsonPath.read(
      webTestClient
        .post()
        .uri(Endpoints.Job.value + "/reindexSearch")
        .exchange()
        .expectStatus()
        .isAccepted()
        .returnResult(String.class)
        .getResponseBody()
        .blockFirst(),
      "$.location"
    );

    pollJobStatusUntilFinished(location);

    // then
    SearchRequest searchRequest = new SearchRequest("beacon_search");
    SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();
    searchSourceBuilder
      .query(QueryBuilders.matchAllQuery())
      .sort(new FieldSortBuilder("lastModifiedDate").order(SortOrder.ASC));
    searchRequest.source(searchSourceBuilder);

    var response = restHighLevelClient.search(
      searchRequest,
      RequestOptions.DEFAULT
    );

    assertThat(response.getHits().getAt(0).getId(), is(seededRegistrationId_1));
    assertThat(response.getHits().getAt(1).getId(), is(seededRegistrationId_2));
    assertThat(response.getHits().getAt(2).getId(), is(seededRegistrationId_3));
    assertThat(response.getHits().getAt(3).getId(), is(seededRegistrationId_4));
  }
}
