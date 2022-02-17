package uk.gov.mca.beacons.api.note.mappers;

import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;
import org.springframework.stereotype.Component;
import uk.gov.mca.beacons.api.beacon.domain.BeaconId;
import uk.gov.mca.beacons.api.dto.WrapperDTO;
import uk.gov.mca.beacons.api.note.domain.Note;
import uk.gov.mca.beacons.api.note.rest.CreateNoteDTO;
import uk.gov.mca.beacons.api.note.rest.NoteDTO;

@Component("NoteMapperV2")
public class NoteMapper {

  public Note fromDTO(CreateNoteDTO dto) {
    var attributes = dto.getAttributes();
    Note note = new Note();
    note.setBeaconId(new BeaconId(attributes.getBeaconId()));
    note.setType(attributes.getType());
    note.setText(attributes.getText());
    return note;
  }

  public NoteDTO toDTO(Note note) {
    final NoteDTO dto = new NoteDTO();
    dto.setId(Objects.requireNonNull(note.getId()).unwrap());
    var attributes = NoteDTO.Attributes
      .builder()
      .beaconId(note.getBeaconId().unwrap())
      .email(note.getEmail())
      .fullName(note.getFullName())
      .text(note.getText())
      .type(note.getType())
      .userId(note.getUserId())
      .createdDate(note.getCreatedDate())
      .build();

    dto.setAttributes(attributes);
    return dto;
  }

  public WrapperDTO<NoteDTO> toWrapperDTO(Note note) {
    final WrapperDTO<NoteDTO> wrapperDTO = new WrapperDTO<>();
    wrapperDTO.setData(toDTO(note));
    return wrapperDTO;
  }

  public WrapperDTO<List<NoteDTO>> toOrderedWrapperDTO(List<Note> notes) {
    final WrapperDTO<List<NoteDTO>> wrapperDTO = new WrapperDTO<>();
    final var noteDTOs = notes
      .stream()
      .sorted(
        Comparator.comparing(Note::getCreatedDate, Comparator.reverseOrder())
      )
      .map(this::toDTO)
      .collect(Collectors.toList());
    wrapperDTO.setData(noteDTOs);
    wrapperDTO.addMeta("count", noteDTOs.size());
    return wrapperDTO;
  }
}
