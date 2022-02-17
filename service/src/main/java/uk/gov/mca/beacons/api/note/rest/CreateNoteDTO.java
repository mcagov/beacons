package uk.gov.mca.beacons.api.note.rest;

import java.util.UUID;
import javax.validation.constraints.NotNull;
import lombok.*;
import uk.gov.mca.beacons.api.dto.DomainDTO;
import uk.gov.mca.beacons.api.note.domain.NoteType;

public class CreateNoteDTO extends DomainDTO<CreateNoteDTO.Attributes> {

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

    @NotNull
    private UUID beaconId;

    private String text;

    @NotNull
    private NoteType type;
  }
}
