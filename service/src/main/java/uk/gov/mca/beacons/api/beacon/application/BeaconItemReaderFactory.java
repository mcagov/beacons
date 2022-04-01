package uk.gov.mca.beacons.api.beacon.application;

import javax.persistence.EntityManagerFactory;
import org.springframework.batch.item.database.JpaPagingItemReader;
import org.springframework.batch.item.database.builder.JpaPagingItemReaderBuilder;
import uk.gov.mca.beacons.api.beacon.domain.Beacon;

/**
 * Creates ItemReaders for use in Spring Batch jobs that use LegacyBeacons
 */
public class BeaconItemReaderFactory {

  private static final int chunkSize = 256;

  public static JpaPagingItemReader<Beacon> getItemReader(
    EntityManagerFactory entityManagerFactory
  ) {
    return new JpaPagingItemReaderBuilder<Beacon>()
      .name("beaconReader")
      .entityManagerFactory(entityManagerFactory)
      .queryString("select b from beacon b order by lastModifiedDate")
      .pageSize(chunkSize)
      .build();
  }
}
