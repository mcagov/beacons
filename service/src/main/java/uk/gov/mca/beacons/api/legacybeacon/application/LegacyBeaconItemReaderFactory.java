package uk.gov.mca.beacons.api.legacybeacon.application;

import javax.persistence.EntityManagerFactory;
import org.springframework.batch.item.database.JpaPagingItemReader;
import org.springframework.batch.item.database.builder.JpaPagingItemReaderBuilder;
import uk.gov.mca.beacons.api.legacybeacon.domain.LegacyBeacon;

/**
 * Creates ItemReaders for use in Spring Batch jobs that use LegacyBeacons
 */
public class LegacyBeaconItemReaderFactory {

  private static final int chunkSize = 256;

  public static JpaPagingItemReader<LegacyBeacon> getItemReader(
    EntityManagerFactory entityManagerFactory
  ) {
    return new JpaPagingItemReaderBuilder<LegacyBeacon>()
      .name("legacyBeaconReader")
      .entityManagerFactory(entityManagerFactory)
      .queryString("select b from LegacyBeacon b order by lastModifiedDate")
      .pageSize(chunkSize)
      .build();
  }
}
