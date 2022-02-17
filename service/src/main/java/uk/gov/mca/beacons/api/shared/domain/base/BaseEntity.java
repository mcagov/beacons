package uk.gov.mca.beacons.api.shared.domain.base;

import javax.persistence.MappedSuperclass;
import javax.persistence.Transient;
import org.springframework.data.domain.Persistable;
import org.springframework.data.util.ProxyUtils;
import org.springframework.lang.Nullable;

/**
 * Abstract class from which all Jpa/Hibernate entities will inherit, this allows us to use a custom
 * {@link DomainObjectId} instead of a raw UUID which gives us type safety when referring to domain objects by their id
 * inside Hibernate entities.
 */
@MappedSuperclass
public abstract class BaseEntity<Id extends DomainObjectId>
  implements Persistable<Id> {

  @Override
  @Transient
  public abstract @Nullable Id getId();

  @Override
  @Transient
  public boolean isNew() {
    return getId() == null;
  }

  @Override
  public String toString() {
    return String.format("%s{id=%s}", getClass().getSimpleName(), getId());
  }

  @Override
  public boolean equals(Object obj) {
    if (null == obj) {
      return false;
    }
    if (this == obj) {
      return true;
    }
    if (!getClass().equals(ProxyUtils.getUserClass(obj))) {
      return false;
    }

    var that = (BaseEntity<?>) obj;
    var id = getId();
    return id != null && id.equals(that.getId());
  }

  @Override
  public int hashCode() {
    var id = getId();
    return id == null ? super.hashCode() : id.hashCode();
  }
}
