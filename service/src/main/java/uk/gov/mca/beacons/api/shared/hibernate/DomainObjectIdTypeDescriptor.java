package uk.gov.mca.beacons.api.shared.hibernate;

import java.util.Objects;
import java.util.UUID;
import java.util.function.Function;
import org.hibernate.type.descriptor.WrapperOptions;
import org.hibernate.type.descriptor.java.AbstractTypeDescriptor;
import org.hibernate.type.descriptor.java.UUIDTypeDescriptor;
import org.springframework.lang.NonNull;
import uk.gov.mca.beacons.api.shared.domain.base.DomainObjectId;

public class DomainObjectIdTypeDescriptor<Id extends DomainObjectId>
  extends AbstractTypeDescriptor<Id> {

  private final Function<UUID, Id> factory;

  public DomainObjectIdTypeDescriptor(
    @NonNull Class<Id> type,
    @NonNull Function<UUID, Id> factory
  ) {
    super(type);
    this.factory = Objects.requireNonNull(factory);
  }

  @Override
  public String toString(Id value) {
    return UUIDTypeDescriptor.ToStringTransformer.INSTANCE.transform(
      value.unwrap()
    );
  }

  @Override
  public Id fromString(String string) {
    return factory.apply(
      UUIDTypeDescriptor.ToStringTransformer.INSTANCE.parse(string)
    );
  }

  @Override
  @SuppressWarnings("unchecked")
  public <X> X unwrap(Id value, Class<X> type, WrapperOptions options) {
    if (value == null) {
      return null;
    }
    if (getJavaType().isAssignableFrom(type)) {
      return (X) value;
    }
    if (UUID.class.isAssignableFrom(type)) {
      return (X) UUIDTypeDescriptor.PassThroughTransformer.INSTANCE.transform(
        value.unwrap()
      );
    }
    if (String.class.isAssignableFrom(type)) {
      return (X) UUIDTypeDescriptor.ToStringTransformer.INSTANCE.transform(
        value.unwrap()
      );
    }
    if (byte[].class.isAssignableFrom(type)) {
      return (X) UUIDTypeDescriptor.ToBytesTransformer.INSTANCE.transform(
        value.unwrap()
      );
    }
    throw unknownUnwrap(type);
  }

  @Override
  public <X> Id wrap(X value, WrapperOptions options) {
    if (value == null) {
      return null;
    }
    if (getJavaType().isInstance(value)) {
      return getJavaType().cast(value);
    }
    if (value instanceof UUID) {
      return factory.apply((UUID) value);
    }
    if (value instanceof String) {
      return factory.apply(
        UUIDTypeDescriptor.ToStringTransformer.INSTANCE.parse(value)
      );
    }
    if (value instanceof byte[]) {
      return factory.apply(
        UUIDTypeDescriptor.ToBytesTransformer.INSTANCE.parse(value)
      );
    }
    throw unknownWrap(value.getClass());
  }
}
