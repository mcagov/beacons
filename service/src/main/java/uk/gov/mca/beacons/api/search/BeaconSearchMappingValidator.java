package uk.gov.mca.beacons.api.search;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.data.elasticsearch.core.IndexOperations;
import org.springframework.stereotype.Component;
import uk.gov.mca.beacons.api.search.documents.BeaconSearchDocument;

@Component
@Slf4j
public class BeaconSearchMappingValidator {

  private final ObjectMapper objectMapper = new ObjectMapper();
  private final ElasticsearchOperations operations;

  @Autowired
  public BeaconSearchMappingValidator(ElasticsearchOperations operations) {
    this.operations = operations;
  }

  /**
   * This method runs on application start up. It checks the mapping that exists in Opensearch/Elasticsearch against
   * the mapping defined in code and if there are any changes will update the index mapping. Due to limitations imposed
   * by Elasticsearch any updates to the mapping must be additive. Changes to the types of any field require a
   * reindexing operation to be performed with the index being deleted and recreated.
   *
   * See Stackoverflow answer provided by maintainer of Spring Data Elasticsearch project.
   * @link https://stackoverflow.com/questions/69735585/spring-data-elasticsearch-detect-mapping-differences/69743676#69743676
   *
   * For more information about Elasticsearch mapping and field types see:
   * @link https://www.elastic.co/guide/en/elasticsearch/reference/current/mapping-types.html
   */
  @Autowired
  public void checkBeaconSearchMapping() {
    IndexOperations indexOperations = operations.indexOps(
      BeaconSearchDocument.class
    );

    if (indexOperations.exists()) {
      log.info(
        "Checking if mapping for class BeaconSearchDocument has changed"
      );

      var mappingFromEntity = indexOperations.createMapping();
      var mappingFromEntityNode = objectMapper.valueToTree(mappingFromEntity);
      var mappingFromIndexNode = objectMapper.valueToTree(
        indexOperations.getMapping()
      );

      if (!mappingFromEntityNode.equals(mappingFromIndexNode)) {
        log.info("Mapping for class BeaconSearchDocument has changed!");
        var success = indexOperations.putMapping(mappingFromEntity);
        if (success) {
          log.info("Updated mapping for BeaconSearchDocument");
        } else {
          log.info("Failed to update mapping for BeaconSearchDocument");
        }
      }
    }
  }
}
