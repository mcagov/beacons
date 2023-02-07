package uk.gov.mca.beacons.api.export.xlsx.backup;

import java.util.List;
import net.minidev.json.JSONObject;
import uk.gov.mca.beacons.api.accountholder.domain.AccountHolder;
import uk.gov.mca.beacons.api.beaconuse.mappers.BeaconUseMapper;
import uk.gov.mca.beacons.api.note.domain.Note;
import uk.gov.mca.beacons.api.registration.domain.Registration;

public class BeaconBackupRecord {

  private Registration registration;
  private AccountHolder accountHolder;
  private List<Note> nonSystemNotes;
  private final BeaconUseMapper beaconUseMapper;

  public JSONObject uses;

  public BeaconBackupRecord(
    Registration registration,
    AccountHolder accountHolder,
    List<Note> nonSystemNotes,
    BeaconUseMapper beaconUseMapper
  ) {
    this.registration = registration;
    this.accountHolder = accountHolder;
    this.nonSystemNotes = nonSystemNotes;
    this.beaconUseMapper = beaconUseMapper;
  }
}
