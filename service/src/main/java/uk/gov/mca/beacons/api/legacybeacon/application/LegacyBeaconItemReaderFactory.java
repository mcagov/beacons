package uk.gov.mca.beacons.api.legacybeacon.application;

import javax.persistence.EntityManagerFactory;
import org.springframework.batch.item.database.JpaPagingItemReader;
import org.springframework.batch.item.database.builder.JpaPagingItemReaderBuilder;
import org.springframework.batch.item.database.orm.JpaNamedQueryProvider;
import uk.gov.mca.beacons.api.beacon.domain.Beacon;
import uk.gov.mca.beacons.api.legacybeacon.domain.LegacyBeacon;

/**
 * Creates ItemReaders for use in Spring Batch jobs that use LegacyBeacons
 */
public class LegacyBeaconItemReaderFactory {

  private static final int chunkSize = 256;

  public static JpaPagingItemReader<LegacyBeacon> getItemReader(
    EntityManagerFactory entityManagerFactory
  ) {
    JpaNamedQueryProvider<LegacyBeacon> queryProvider = new JpaNamedQueryProvider<>();
    queryProvider.setEntityClass(LegacyBeacon.class);
    queryProvider.setNamedQuery("PagingLegacyBeaconReader");

    return new JpaPagingItemReaderBuilder<LegacyBeacon>()
      .name("legacyBeaconReader")
      .entityManagerFactory(entityManagerFactory)
      .queryProvider(queryProvider)
      .pageSize(chunkSize)
      .build();
  }

  public static JpaPagingItemReader<LegacyBeacon> getLegacyBackupItemReader(
    EntityManagerFactory entityManagerFactory
  ) {
    JpaNamedQueryProvider<LegacyBeacon> queryProvider = new JpaNamedQueryProvider<>();
    queryProvider.setEntityClass(LegacyBeacon.class);
    queryProvider.setNamedQuery("BackupPagingLegacyBeaconReader");

    return new JpaPagingItemReaderBuilder<LegacyBeacon>()
      .name("legacyBeaconReader")
      .entityManagerFactory(entityManagerFactory)
      .queryProvider(queryProvider)
      .pageSize(chunkSize)
      .build();
  }
}
