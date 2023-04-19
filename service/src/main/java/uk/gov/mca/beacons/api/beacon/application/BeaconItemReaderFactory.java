package uk.gov.mca.beacons.api.beacon.application;

import javax.persistence.EntityManagerFactory;
import javax.persistence.Query;
import org.springframework.batch.item.database.JpaPagingItemReader;
import org.springframework.batch.item.database.PagingQueryProvider;
import org.springframework.batch.item.database.builder.JpaPagingItemReaderBuilder;
import org.springframework.batch.item.database.orm.AbstractJpaQueryProvider;
import org.springframework.batch.item.database.orm.JpaNamedQueryProvider;
import org.springframework.batch.item.database.orm.JpaQueryProvider;
import uk.gov.mca.beacons.api.beacon.domain.Beacon;

/**
 * Creates ItemReaders for use in Spring Batch jobs that use Beacons
 */
public class BeaconItemReaderFactory {

  private static final int chunkSize = 100;

  public static JpaPagingItemReader<Beacon> getItemReader(
    EntityManagerFactory entityManagerFactory
  ) {
    JpaNamedQueryProvider<Beacon> queryProvider = new JpaNamedQueryProvider<>();
    queryProvider.setEntityClass(Beacon.class);
    queryProvider.setNamedQuery("PagingBeaconReader");

    return new JpaPagingItemReaderBuilder<Beacon>()
      .name("beaconReader")
      .entityManagerFactory(entityManagerFactory)
      .queryProvider(queryProvider)
      .pageSize(chunkSize)
      .build();
  }

  public static JpaPagingItemReader<Beacon> getBackupItemReader(
    EntityManagerFactory entityManagerFactory
  ) {
    JpaNamedQueryProvider<Beacon> queryProvider = new JpaNamedQueryProvider<>();
    queryProvider.setEntityClass(Beacon.class);
    queryProvider.setNamedQuery("BackupPagingBeaconReader");

    return new JpaPagingItemReaderBuilder<Beacon>()
      .name("backupBeaconReader")
      .entityManagerFactory(entityManagerFactory)
      .queryProvider(queryProvider)
      .pageSize(chunkSize)
      .build();
  }
}
