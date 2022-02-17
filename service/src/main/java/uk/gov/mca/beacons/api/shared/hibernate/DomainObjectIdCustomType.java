package uk.gov.mca.beacons.api.shared.hibernate;

import java.io.Serializable;
import java.sql.ResultSet;
import java.sql.SQLException;
import org.hibernate.id.ResultSetIdentifierConsumer;
import org.hibernate.type.AbstractSingleColumnStandardBasicType;
import org.hibernate.type.PostgresUUIDType;
import org.springframework.lang.NonNull;
import uk.gov.mca.beacons.api.shared.domain.base.DomainObjectId;

/**
 * Hibernate custom type for a {@link DomainObjectId} subtype. You need this to be able to use {@link DomainObjectId}s
 * as primary keys. You have to create one subclass per {@link DomainObjectId} subtype.
 *
 * @param <Id> the Id type.
 * @see DomainObjectIdTypeDescriptor
 */
public abstract class DomainObjectIdCustomType<Id extends DomainObjectId>
  extends AbstractSingleColumnStandardBasicType<Id>
  implements ResultSetIdentifierConsumer {

  public DomainObjectIdCustomType(
    @NonNull DomainObjectIdTypeDescriptor<Id> domainObjectIdTypeDescriptor
  ) {
    super(
      PostgresUUIDType.PostgresUUIDSqlTypeDescriptor.INSTANCE,
      domainObjectIdTypeDescriptor
    );
  }

  @Override
  public Serializable consumeIdentifier(ResultSet resultSet) {
    try {
      var id = resultSet.getString(1);
      return getJavaTypeDescriptor().fromString(id);
    } catch (SQLException e) {
      throw new IllegalStateException("Could not extract ID from ResultSet", e);
    }
  }

  @Override
  public String getName() {
    return getJavaTypeDescriptor().getJavaType().getSimpleName();
  }
}
