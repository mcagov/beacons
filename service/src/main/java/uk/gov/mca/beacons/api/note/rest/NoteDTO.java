package uk.gov.mca.beacons.api.note.rest;

import java.time.OffsetDateTime;
import java.util.UUID;
import lombok.*;
import uk.gov.mca.beacons.api.dto.DomainDTO;
import uk.gov.mca.beacons.api.note.domain.NoteType;

public class NoteDTO extends DomainDTO<NoteDTO.Attributes> {

  private String type = "note";

  public String getType() {
    return type;
  }

  @Getter
  @Setter
  @Builder
  @NoArgsConstructor
  @AllArgsConstructor
  public static class Attributes {

    private UUID beaconId;
    private String text;
    private NoteType type;
    private OffsetDateTime createdDate;
    private String fullName;
    private String email;
    private UUID userId;
  }
}
