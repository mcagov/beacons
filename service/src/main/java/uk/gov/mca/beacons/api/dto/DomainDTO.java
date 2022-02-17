package uk.gov.mca.beacons.api.dto;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import javax.validation.Valid;
import uk.gov.mca.beacons.api.hateoas.HateoasLink;

public abstract class DomainDTO<T> {

  private UUID id;

  @Valid
  protected T attributes;

  private final List<HateoasLink> links = new ArrayList<>();
  private final Map<String, RelationshipDTO> relationships = new HashMap<>();

  public abstract String getType();

  public UUID getId() {
    return id;
  }

  public void setId(UUID id) {
    this.id = id;
  }

  public T getAttributes() {
    return attributes;
  }

  public void setAttributes(T attributes) {
    this.attributes = attributes;
  }

  public List<HateoasLink> getLinks() {
    return links;
  }

  public void addLinks(List<HateoasLink> addedLinks) {
    links.addAll(addedLinks);
  }

  public Map<String, RelationshipDTO> getRelationships() {
    return relationships;
  }

  public void addRelationship(String key, RelationshipDTO value) {
    relationships.put(key, value);
  }
}
