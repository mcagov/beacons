package uk.gov.mca.beacons.api.search.documents;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.core.IsEqual.equalTo;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import uk.gov.mca.beacons.api.BaseIntegrationTest;
import uk.gov.mca.beacons.api.beacon.domain.Beacon;
import uk.gov.mca.beacons.api.search.documents.nested.NestedBeaconOwner;
import uk.gov.mca.beacons.api.search.documents.nested.NestedBeaconUse;
import uk.gov.mca.beacons.api.search.repositories.BeaconSearchRepository;

public class BeaconSearchDocumentIntegrationTest extends BaseIntegrationTest {

  @Autowired
  BeaconSearchRepository beaconSearchRepository;

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
    BeaconSearchDocument savedDocument = beaconSearchRepository.save(
      beaconSearchDocument
    );

    BeaconSearchDocument retrievedDocument = beaconSearchRepository.findBeaconSearchDocumentByHexId(
      hexId
    );

    // assert
    assertThat(retrievedDocument.getHexId(), equalTo(hexId));
  }
}
