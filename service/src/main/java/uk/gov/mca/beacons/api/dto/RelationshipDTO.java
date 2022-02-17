package uk.gov.mca.beacons.api.dto;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class RelationshipDTO {

  private List<RelationshipData> data = new ArrayList<RelationshipData>();

  public List<RelationshipData> getData() {
    return data;
  }

  @SuppressWarnings("rawtypes")
  public void addData(DomainDTO domainDto) {
    data.add(new RelationshipData(domainDto.getType(), domainDto.getId()));
  }

  public class RelationshipData {

    public String type;
    public UUID id;

    public RelationshipData(String type, UUID id) {
      this.type = type;
      this.id = id;
    }
  }
}
