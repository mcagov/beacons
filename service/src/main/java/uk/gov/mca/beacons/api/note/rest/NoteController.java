package uk.gov.mca.beacons.api.note.rest;

import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import java.util.UUID;
import javax.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import uk.gov.mca.beacons.api.auth.application.GetUserService;
import uk.gov.mca.beacons.api.beacon.domain.BeaconId;
import uk.gov.mca.beacons.api.dto.WrapperDTO;
import uk.gov.mca.beacons.api.note.application.NoteService;
import uk.gov.mca.beacons.api.note.domain.Note;
import uk.gov.mca.beacons.api.note.mappers.NoteMapper;
import uk.gov.mca.beacons.api.shared.domain.user.User;

@RestController
@RequestMapping("/spring-api/note")
@Tag(name = "Note Controller")
public class NoteController {

  private final NoteMapper noteMapper;
  private final NoteService noteService;
  private final GetUserService getUserService;

  @Autowired
  public NoteController(
    NoteMapper noteMapper,
    NoteService noteService,
    GetUserService getUserService
  ) {
    this.noteMapper = noteMapper;
    this.noteService = noteService;
    this.getUserService = getUserService;
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public WrapperDTO<NoteDTO> createNote(
    @RequestBody @Valid WrapperDTO<CreateNoteDTO> dto
  ) {
    User user = getUserService.getUser();
    Note note = noteMapper.fromDTO(dto.getData());
    note.setUser(user);
    Note savedNote = noteService.create(note);
    return noteMapper.toWrapperDTO(savedNote);
  }

  @GetMapping
  public WrapperDTO<List<NoteDTO>> getNotesByBeaconId(
    @RequestParam("beaconId") UUID rawBeaconId
  ) {
    BeaconId beaconId = new BeaconId(rawBeaconId);
    List<Note> notes = noteService.getByBeaconId(beaconId);
    return noteMapper.toOrderedWrapperDTO(notes);
  }
}
