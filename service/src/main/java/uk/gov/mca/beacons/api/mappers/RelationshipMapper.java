package uk.gov.mca.beacons.api.mappers;

import java.util.List;
import org.springframework.stereotype.Service;
import uk.gov.mca.beacons.api.dto.DomainDTO;
import uk.gov.mca.beacons.api.dto.RelationshipDTO;

@Service
@SuppressWarnings("rawtypes")
public class RelationshipMapper {

  public RelationshipDTO toDTO(DomainDTO related) {
    final var relationship = new RelationshipDTO();
    relationship.addData(related);
    return relationship;
  }

  public RelationshipDTO toDTO(List<DomainDTO> related) {
    final var relationship = new RelationshipDTO();
    related.forEach(relationship::addData);

    return relationship;
  }
}
