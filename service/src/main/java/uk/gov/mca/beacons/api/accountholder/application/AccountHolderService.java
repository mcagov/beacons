package uk.gov.mca.beacons.api.accountholder.application;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.mca.beacons.api.accountholder.domain.AccountHolder;
import uk.gov.mca.beacons.api.accountholder.domain.AccountHolderId;
import uk.gov.mca.beacons.api.accountholder.domain.AccountHolderRepository;
import uk.gov.mca.beacons.api.beacon.application.BeaconService;
import uk.gov.mca.beacons.api.beacon.domain.Beacon;
import uk.gov.mca.beacons.api.beacon.domain.BeaconId;
import uk.gov.mca.beacons.api.beacon.mappers.BeaconMapper;
import uk.gov.mca.beacons.api.beacon.rest.BeaconDTO;
import uk.gov.mca.beacons.api.beaconowner.application.BeaconOwnerService;
import uk.gov.mca.beacons.api.beaconuse.application.BeaconUseService;
import uk.gov.mca.beacons.api.mappers.ModelPatcher;
import uk.gov.mca.beacons.api.mappers.ModelPatcherFactory;
import uk.gov.mca.beacons.api.note.application.NoteService;
import uk.gov.mca.beacons.api.shared.domain.user.User;

@Slf4j
@Transactional
@Service("AccountHolderServiceV2")
public class AccountHolderService {

  private final AccountHolderRepository accountHolderRepository;
  private final ModelPatcherFactory<AccountHolder> accountHolderPatcherFactory;
  private final BeaconService beaconService;
  private final BeaconMapper beaconMapper;
  private final BeaconUseService beaconUseService;
  private final BeaconOwnerService beaconOwnerService;
  private final NoteService noteService;
  private final MicrosoftGraphService graphService;

  @Autowired
  public AccountHolderService(
    AccountHolderRepository accountHolderRepository,
    ModelPatcherFactory<AccountHolder> accountHolderPatcherFactory,
    BeaconService beaconService,
    BeaconMapper beaconMapper,
    BeaconUseService beaconUseService,
    BeaconOwnerService beaconOwnerService,
    MicrosoftGraphService graphService,
    NoteService noteService
  ) {
    this.accountHolderRepository = accountHolderRepository;
    this.accountHolderPatcherFactory = accountHolderPatcherFactory;
    this.beaconService = beaconService;
    this.beaconMapper = beaconMapper;
    this.beaconUseService = beaconUseService;
    this.beaconOwnerService = beaconOwnerService;
    this.graphService = graphService;
    this.noteService = noteService;
  }

  public AccountHolder create(AccountHolder accountHolder) {
    accountHolder.registerCreatedEvent();
    return accountHolderRepository.save(accountHolder);
  }

  public Optional<AccountHolder> getAccountHolder(AccountHolderId id) {
    return accountHolderRepository.findById(id);
  }

  public Optional<AccountHolder> getAccountHolderByAuthId(String authId) {
    return accountHolderRepository.findAccountHolderByAuthId(authId);
  }

  @Transactional(rollbackFor = Exception.class)
  public Optional<AccountHolder> updateAccountHolder(
    AccountHolderId id,
    AccountHolder accountHolderUpdate
  ) throws UpdateAzAdUserError, GetAzAdUserError, Exception {
    AccountHolder accountHolder = accountHolderRepository
      .findById(id)
      .orElse(null);

    if (accountHolder == null) {
      throw new Exception(
        "No account holder with id " + id.unwrap() + " found in the DB"
      );
    }

    try {
      Optional<User> accountHolderInAzure = getAccountHolderFromAzureAd(
        accountHolder.getAuthId()
      );
      if (accountHolderInAzure.isEmpty()) {
        throw new GetAzAdUserError(
          "No account holder with authId " +
          accountHolder.getAuthId() +
          " found in Azure",
          null
        );
      }
    } catch (GetAzAdUserError getAzAdUserError) {
      throw new GetAzAdUserError(
        "No account holder with authId " +
        accountHolder.getAuthId() +
        " found in Azure",
        null
      );
    }

    Optional<AccountHolder> savedAccountHolder;

    try {
      savedAccountHolder =
        updateAccountHolderInDb(accountHolder, accountHolderUpdate);
    } catch (Exception dbError) {
      log.error(
        "Couldn't update account holder with id" +
        accountHolderUpdate.getId().unwrap() +
        " in the DB"
      );
      throw dbError;
    }

    if (savedAccountHolder.isPresent()) {
      try {
        graphService.updateUser(savedAccountHolder.get());
      } catch (UpdateAzAdUserError azAdError) {
        throw azAdError;
      }
    }

    return savedAccountHolder;
  }

  public Optional<User> getAccountHolderFromAzureAd(String authId)
    throws GetAzAdUserError {
    AzureAdAccountHolder accountHolderInAzAd;

    try {
      accountHolderInAzAd = (AzureAdAccountHolder) graphService.getUser(authId);
    } catch (GetAzAdUserError azureAdError) {
      log.error("Couldn't find account holder authId " + authId + "in Azure");
      throw azureAdError;
    } catch (Exception e) {
      throw new RuntimeException(e);
    }

    return Optional.of(accountHolderInAzAd);
  }

  @Transactional(rollbackFor = Exception.class)
  public Optional<AccountHolder> updateAccountHolderInDb(
    AccountHolder accountHolder,
    AccountHolder accountHolderUpdate
  ) {
    final ModelPatcher<AccountHolder> patcher = accountHolderPatcherFactory
      .getModelPatcher()
      .withMapping(AccountHolder::getFullName, AccountHolder::setFullName)
      .withMapping(AccountHolder::getEmail, AccountHolder::setEmail)
      .withMapping(
        AccountHolder::getTelephoneNumber,
        AccountHolder::setTelephoneNumber
      )
      .withMapping(
        AccountHolder::getAlternativeTelephoneNumber,
        AccountHolder::setAlternativeTelephoneNumber
      )
      .withMapping(AccountHolder::getAddress, AccountHolder::setAddress);

    accountHolder.update(accountHolderUpdate, patcher);
    return Optional.of(accountHolderRepository.save(accountHolder));
  }

  public List<BeaconDTO> getBeaconsByAccountHolderId(
    AccountHolderId accountHolderId
  ) {
    List<Beacon> beacons = beaconService.getByAccountHolderId(accountHolderId);

    return beacons
      .stream()
      .map(b ->
        beaconMapper.toDTO(
          b,
          beaconUseService.getMainUseByBeaconId(b.getId()),
          beaconOwnerService.getModEmailByBeaconId(b.getId())
        )
      )
      .collect(Collectors.toList());
  }

  public void deleteAccountHolder(AccountHolderId accountHolderId) {
    AccountHolder accountHolder = getAccountHolder(accountHolderId)
      .orElseThrow(NoSuchElementException::new);

    List<BeaconDTO> beacons = getBeaconsByAccountHolderId(accountHolderId);

    if (!beacons.isEmpty()) {
      throw new IllegalStateException(
        "Cannot delete an account holder with associated beacons"
      );
    }

    try {
      graphService.deleteUser(accountHolder.getAuthId());
    } catch (Exception e) {
      log.error(
        String.format(
          "Unable to delete Azure user with AuthID %s",
          accountHolder.getAuthId()
        ),
        e
      );
    }

    accountHolderRepository.deleteById(accountHolderId);
  }

  public void transferBeacons(
    AccountHolderId recipientAccountHolderId,
    List<BeaconId> beaconsToTransfer
  ) throws NoSuchElementException {
    AccountHolder recipientAccountHolder = getAccountHolder(
      recipientAccountHolderId
    )
      .orElseThrow(NoSuchElementException::new);

    beaconsToTransfer.forEach(beaconId ->
      transferBeacon(recipientAccountHolder, beaconId)
    );
  }

  private void transferBeacon(
    AccountHolder recipientAccountHolder,
    BeaconId beaconIdToTransfer
  ) throws NoSuchElementException {
    Beacon beaconToTransfer = beaconService
      .findById(beaconIdToTransfer)
      .orElseThrow(NoSuchElementException::new);

    AccountHolder currentAccountHolder = getAccountHolder(
      beaconToTransfer.getAccountHolderId()
    )
      .orElseThrow(NoSuchElementException::new);

    beaconToTransfer.setAccountHolderId(recipientAccountHolder.getId());
    beaconToTransfer.setLastModifiedDate(OffsetDateTime.now());

    beaconService.update(beaconIdToTransfer, beaconToTransfer);

    noteService.createSystemNote(
      beaconToTransfer.getId(),
      "Beacon transferred from another account"
    );
  }
}
