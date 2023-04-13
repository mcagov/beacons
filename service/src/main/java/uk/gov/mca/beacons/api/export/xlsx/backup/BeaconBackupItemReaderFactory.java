package uk.gov.mca.beacons.api.export.xlsx.backup;

import javax.persistence.EntityManagerFactory;
import javax.persistence.Query;
import org.springframework.batch.item.database.JpaPagingItemReader;
import org.springframework.batch.item.database.PagingQueryProvider;
import org.springframework.batch.item.database.builder.JpaPagingItemReaderBuilder;
import org.springframework.batch.item.database.orm.AbstractJpaQueryProvider;
import org.springframework.batch.item.database.orm.JpaNamedQueryProvider;
import org.springframework.batch.item.database.orm.JpaNativeQueryProvider;
import org.springframework.batch.item.database.orm.JpaQueryProvider;
import uk.gov.mca.beacons.api.beacon.domain.Beacon;

/**
 * Creates ItemReaders for use in Spring Batch jobs that use BeaconBackupItems
 * using the beacon_backup view
 */
public class BeaconBackupItemReaderFactory {

  // might be too small
  private static final int chunkSize = 500;

  public static JpaPagingItemReader<BeaconBackupItem> getItemReader(
    EntityManagerFactory entityManagerFactory
  ) {
    JpaNamedQueryProvider<BeaconBackupItem> queryProvider = new JpaNamedQueryProvider<>();
    queryProvider.setEntityClass(BeaconBackupItem.class);
    queryProvider.setNamedQuery("PagingBeaconBackupItemReader");

    return new JpaPagingItemReaderBuilder<BeaconBackupItem>()
      .name("beaconBackupItemReader")
      .entityManagerFactory(entityManagerFactory)
      .queryProvider(queryProvider)
      .pageSize(chunkSize)
      .build();
  }
}
