package uk.gov.mca.beacons.api.search.documents;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.core.IsEqual.equalTo;

import java.time.OffsetDateTime;
import java.util.Iterator;
import java.util.List;
import java.util.UUID;
import org.apache.commons.collections.IteratorUtils;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import uk.gov.mca.beacons.api.BaseIntegrationTest;
import uk.gov.mca.beacons.api.search.documents.nested.NestedBeaconOwner;
import uk.gov.mca.beacons.api.search.documents.nested.NestedBeaconUse;
import uk.gov.mca.beacons.api.search.repositories.BeaconElasticSearchRepository;

public class BeaconSearchDocumentIntegrationTest extends BaseIntegrationTest {

  @Autowired
  BeaconElasticSearchRepository beaconElasticSearchRepository;

  @Test
  void shouldSaveAndRetrieveTheBeaconSearchDocument() {
    // setup
    UUID id = UUID.randomUUID();
    String hexId = "1D1234123412345";
    String beaconStatus = "NEW";
    OffsetDateTime createdAt = OffsetDateTime.now();
    OffsetDateTime lastModifiedDate = OffsetDateTime.now();
    String manufacturerSerialNumber = "a serial number";
    String ownerName = "Olly";
    String environment = "MARITIME";

    NestedBeaconOwner beaconOwner = new NestedBeaconOwner();
    beaconOwner.setOwnerName(ownerName);

    NestedBeaconUse beaconUse = new NestedBeaconUse();
    beaconUse.setEnvironment(environment);

    BeaconSearchDocument beaconSearchDocument = new BeaconSearchDocument();
    beaconSearchDocument.setId(id);
    beaconSearchDocument.setHexId(hexId);
    beaconSearchDocument.setBeaconStatus(beaconStatus);
    beaconSearchDocument.setCreatedDate(createdAt);
    beaconSearchDocument.setLastModifiedDate(lastModifiedDate);
    beaconSearchDocument.setManufacturerSerialNumber(manufacturerSerialNumber);
    beaconSearchDocument.setCospasSarsatNumber(null);
    beaconSearchDocument.setBeaconUses(List.of(beaconUse));
    beaconSearchDocument.setBeaconOwner(beaconOwner);

    // act
    BeaconSearchDocument savedDocument = beaconElasticSearchRepository.save(
      beaconSearchDocument
    );

    BeaconSearchDocument retrievedDocument = beaconElasticSearchRepository.findBeaconSearchDocumentByHexId(
      hexId
    );

    // assert
    assertThat(retrievedDocument.getHexId(), equalTo(hexId));
  }

  @Test
  void shouldSaveAndRetrieveAllBeaconSearchDocuments() {
    // setup
    UUID id = UUID.randomUUID();
    String hexId = "1D1234123412345";
    String beaconStatus = "NEW";
    OffsetDateTime createdAt = OffsetDateTime.now();
    OffsetDateTime lastModifiedDate = OffsetDateTime.now();
    String manufacturerSerialNumber = "a serial number";
    String ownerName = "Olly";
    String environment = "MARITIME";

    NestedBeaconOwner beaconOwner = new NestedBeaconOwner();
    beaconOwner.setOwnerName(ownerName);

    NestedBeaconUse beaconUse = new NestedBeaconUse();
    beaconUse.setEnvironment(environment);

    BeaconSearchDocument beaconSearchDocument = new BeaconSearchDocument();
    beaconSearchDocument.setId(id);
    beaconSearchDocument.setHexId(hexId);
    beaconSearchDocument.setBeaconStatus(beaconStatus);
    beaconSearchDocument.setCreatedDate(createdAt);
    beaconSearchDocument.setLastModifiedDate(lastModifiedDate);
    beaconSearchDocument.setManufacturerSerialNumber(manufacturerSerialNumber);
    beaconSearchDocument.setCospasSarsatNumber(null);
    beaconSearchDocument.setBeaconUses(List.of(beaconUse));
    beaconSearchDocument.setBeaconOwner(beaconOwner);

    // act
    BeaconSearchDocument savedDocument = beaconElasticSearchRepository.save(
      beaconSearchDocument
    );

    Iterator records = beaconElasticSearchRepository.findAll().iterator();
    List<BeaconSearchDocument> retrievedDocuments = IteratorUtils.toList(
      records
    );

    // assert
    assertThat(retrievedDocuments.size(), equalTo(1));
  }
}
