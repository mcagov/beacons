package uk.gov.mca.beacons.api.shared.hibernate;

import java.io.Serializable;
import java.util.Objects;
import java.util.UUID;
import java.util.function.Function;
import org.hibernate.engine.spi.SharedSessionContractImplementor;
import org.hibernate.id.IdentifierGenerator;
import org.springframework.lang.NonNull;
import uk.gov.mca.beacons.api.shared.domain.base.DomainObjectId;

public class DomainObjectIdGenerator<Id extends DomainObjectId>
  implements IdentifierGenerator {

  private final Function<UUID, Id> factory;

  public DomainObjectIdGenerator(@NonNull Function<UUID, Id> factory) {
    this.factory = Objects.requireNonNull(factory);
  }

  @Override
  public Serializable generate(
    SharedSessionContractImplementor session,
    Object object
  ) {
    return factory.apply(UUID.randomUUID());
  }
}
