package uk.gov.mca.beacons.api.registration.application;

import java.util.*;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.mca.beacons.api.accountholder.application.AccountHolderService;
import uk.gov.mca.beacons.api.accountholder.domain.AccountHolder;
import uk.gov.mca.beacons.api.accountholder.domain.AccountHolderId;
import uk.gov.mca.beacons.api.beacon.application.BeaconService;
import uk.gov.mca.beacons.api.beacon.domain.Beacon;
import uk.gov.mca.beacons.api.beacon.domain.BeaconId;
import uk.gov.mca.beacons.api.beaconowner.application.BeaconOwnerService;
import uk.gov.mca.beacons.api.beaconowner.domain.BeaconOwner;
import uk.gov.mca.beacons.api.beaconuse.application.BeaconUseService;
import uk.gov.mca.beacons.api.beaconuse.domain.BeaconUse;
import uk.gov.mca.beacons.api.emergencycontact.application.EmergencyContactService;
import uk.gov.mca.beacons.api.emergencycontact.domain.EmergencyContact;
import uk.gov.mca.beacons.api.exceptions.ResourceNotFoundException;
import uk.gov.mca.beacons.api.legacybeacon.application.LegacyBeaconService;
import uk.gov.mca.beacons.api.legacybeacon.domain.LegacyBeacon;
import uk.gov.mca.beacons.api.legacybeacon.domain.LegacyBeaconId;
import uk.gov.mca.beacons.api.note.application.NoteService;
import uk.gov.mca.beacons.api.registration.domain.Registration;
import uk.gov.mca.beacons.api.registration.rest.DeleteBeaconDTO;
import uk.gov.mca.beacons.api.shared.domain.user.User;

@Transactional
@Service("CreateRegistrationServiceV2")
public class RegistrationService {

  private final AccountHolderService accountHolderService;
  private final BeaconService beaconService;
  private final BeaconOwnerService beaconOwnerService;
  private final BeaconUseService beaconUseService;
  private final EmergencyContactService emergencyContactService;
  private final LegacyBeaconService legacyBeaconService;
  private final NoteService noteService;

  @Autowired
  public RegistrationService(
    AccountHolderService accountHolderService,
    BeaconService beaconService,
    BeaconOwnerService beaconOwnerService,
    BeaconUseService beaconUseService,
    EmergencyContactService emergencyContactService,
    LegacyBeaconService legacyBeaconService,
    NoteService noteService
  ) {
    this.accountHolderService = accountHolderService;
    this.beaconService = beaconService;
    this.beaconOwnerService = beaconOwnerService;
    this.beaconUseService = beaconUseService;
    this.emergencyContactService = emergencyContactService;
    this.legacyBeaconService = legacyBeaconService;
    this.noteService = noteService;
  }

  public ArrayList<Registration> getBatch(
    int batchSize,
    int numberAlreadyTaken
  ) {
    List<Beacon> beacons = beaconService.getBatch(
      batchSize,
      numberAlreadyTaken
    );

    ArrayList<Registration> registrations = new ArrayList<Registration>();

    for (Beacon beacon : beacons) {
      registrations.add(getAssociatedAggregates(beacon));
    }

    return registrations;
  }

  public Registration register(Registration registration) {
    Beacon savedBeacon = beaconService.create(registration.getBeacon());
    claimLegacyBeacon(savedBeacon);

    return persistAssociatedAggregates(savedBeacon, registration);
  }

  public Registration update(BeaconId beaconId, Registration registration)
    throws ResourceNotFoundException {
    deleteAssociatedAggregates(beaconId, false);

    Beacon updatedBeacon = beaconService.update(
      beaconId,
      registration.getBeacon()
    );

    return persistAssociatedAggregates(updatedBeacon, registration);
  }

  public Registration getByBeaconId(BeaconId beaconId) {
    Beacon beacon = beaconService
      .findById(beaconId)
      .orElseThrow(ResourceNotFoundException::new);

    return getAssociatedAggregates(beacon);
  }

  public void delete(DeleteBeaconDTO dto, User brtUser) {
    BeaconId beaconId = new BeaconId(dto.getBeaconId());
    Beacon deletedBeacon = beaconService.softDelete(beaconId);

    if (dto.getAccountHolderId() != null) {
      AccountHolder accountHolder = accountHolderService
        .getAccountHolder(new AccountHolderId(dto.getAccountHolderId()))
        .orElseThrow(ResourceNotFoundException::new);

      deleteAssociatedAggregates(beaconId, false);
      noteService.createNoteForDeletedRegistration(
        accountHolder,
        deletedBeacon,
        dto.getReason(),
        "Account Holder",
        "The account holder deleted the record with reason: '%s'"
      );
    } else if (brtUser != null) {
      deleteAssociatedAggregates(beaconId, true);
      noteService.createNoteForDeletedRegistration(
        brtUser,
        deletedBeacon,
        dto.getReason(),
        brtUser.getFullName(),
        "The Beacon Registry Team deleted the record with reason: '%s'"
      );
    }
  }

  public void delete(DeleteBeaconDTO dto) {
    delete(dto, null);
  }

  /**
   *
   * @param accountHolderId id of the AccountHolder
   * @return a list of beacons where status is new
   */
  public List<Registration> getByAccountHolderId(
    AccountHolderId accountHolderId
  ) {
    AccountHolder accountHolder = accountHolderService
      .getAccountHolder(accountHolderId)
      .orElseThrow(ResourceNotFoundException::new);

    List<Beacon> beacons = beaconService.getByAccountHolderIdWhereStatusIsNew(
      accountHolder.getId()
    );

    return beacons
      .stream()
      .map(this::getAssociatedAggregates)
      .sorted()
      .collect(Collectors.toList());
  }

  public Registration getByBeaconIdAndAccountHolderId(
    BeaconId beaconId,
    AccountHolderId accountHolderId
  ) {
    AccountHolder accountHolder = accountHolderService
      .getAccountHolder(accountHolderId)
      .orElseThrow(ResourceNotFoundException::new);

    Beacon beacon = beaconService
      .getByBeaconIdAndAccountHolderIdWhereStatusIsNew(
        beaconId,
        accountHolder.getId()
      )
      .orElseThrow(ResourceNotFoundException::new);

    return getAssociatedAggregates(beacon);
  }

  private Registration getAssociatedAggregates(Beacon beacon) {
    Optional<BeaconOwner> beaconOwner = beaconOwnerService.getByBeaconId(
      beacon.getId()
    );
    List<BeaconUse> beaconUses = beaconUseService.getByBeaconId(beacon.getId());
    List<EmergencyContact> emergencyContacts = emergencyContactService.getByBeaconId(
      beacon.getId()
    );

    return Registration
      .builder()
      .beacon(beacon)
      .beaconOwner(beaconOwner.orElse(null))
      .beaconUses(beaconUses)
      .emergencyContacts(emergencyContacts)
      .build();
  }

  private Registration persistAssociatedAggregates(
    Beacon savedBeacon,
    Registration registration
  ) {
    registration.setBeaconId(savedBeacon.getId());
    BeaconOwner savedBeaconOwner = beaconOwnerService.create(
      registration.getBeaconOwner()
    );
    List<BeaconUse> savedBeaconUses = beaconUseService.createAll(
      registration.getBeaconUses()
    );
    List<EmergencyContact> savedEmergencyContacts = emergencyContactService.createAll(
      registration.getEmergencyContacts()
    );

    return Registration
      .builder()
      .beacon(savedBeacon)
      .beaconOwner(savedBeaconOwner)
      .beaconUses(savedBeaconUses)
      .emergencyContacts(savedEmergencyContacts)
      .build();
  }

  private void deleteAssociatedAggregates(
    BeaconId beaconId,
    boolean deleteNotes
  ) {
    beaconOwnerService.deleteByBeaconId(beaconId);
    beaconUseService.deleteByBeaconId(beaconId);
    emergencyContactService.deleteByBeaconId(beaconId);

    if (deleteNotes) {
      noteService.deleteByBeaconId(beaconId);
    }
  }

  private void claimLegacyBeacon(Beacon beacon) {
    AccountHolder accountHolder = accountHolderService
      .getAccountHolder(beacon.getAccountHolderId())
      .orElseThrow(ResourceNotFoundException::new);

    legacyBeaconService.claimByHexIdAndAccountHolderEmail(
      beacon.getHexId(),
      accountHolder.getEmail()
    );
  }

  public void deleteLegacyBeacon(DeleteBeaconDTO dto) {
    LegacyBeacon legacyBeacon = legacyBeaconService
      .findById(new LegacyBeaconId(dto.getBeaconId()))
      .orElseThrow(ResourceNotFoundException::new);

    String reasonForDeletion = String.format(
      "The Beacon Registry Team deleted the record with reason: '%s'",
      dto.getReason()
    );

    legacyBeaconService.delete(
      legacyBeacon.getHexId(),
      legacyBeacon.getOwnerEmail(),
      reasonForDeletion
    );
  }
}
