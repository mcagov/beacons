package uk.gov.mca.beacons.api.shared.domain.base;

import java.io.Serializable;
import java.util.Objects;
import java.util.UUID;
import javax.validation.constraints.NotNull;

public abstract class DomainObjectId implements ValueObject, Serializable {

  private final UUID id;

  protected DomainObjectId(@NotNull UUID id) {
    this.id = Objects.requireNonNull(id);
  }

  public @NotNull UUID unwrap() {
    return id;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;
    DomainObjectId that = (DomainObjectId) o;
    return Objects.equals(id, that.id);
  }

  @Override
  public int hashCode() {
    return Objects.hash(id);
  }
}
