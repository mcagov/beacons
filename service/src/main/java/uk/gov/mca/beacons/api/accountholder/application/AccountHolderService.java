package uk.gov.mca.beacons.api.accountholder.application;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.mca.beacons.api.accountholder.domain.AccountHolder;
import uk.gov.mca.beacons.api.accountholder.domain.AccountHolderId;
import uk.gov.mca.beacons.api.accountholder.domain.AccountHolderRepository;
import uk.gov.mca.beacons.api.beacon.application.BeaconService;
import uk.gov.mca.beacons.api.beacon.domain.Beacon;
import uk.gov.mca.beacons.api.beacon.mappers.BeaconMapper;
import uk.gov.mca.beacons.api.beacon.rest.BeaconDTO;
import uk.gov.mca.beacons.api.beaconuse.application.BeaconUseService;
import uk.gov.mca.beacons.api.mappers.ModelPatcher;
import uk.gov.mca.beacons.api.mappers.ModelPatcherFactory;
import uk.gov.mca.beacons.api.shared.domain.user.User;

@Slf4j
@Transactional
@Service("AccountHolderServiceV2")
public class AccountHolderService {

  private AccountHolderRepository accountHolderRepository;
  private ModelPatcherFactory<AccountHolder> accountHolderPatcherFactory;
  private final BeaconService beaconService;
  private final BeaconMapper beaconMapper;
  private final BeaconUseService beaconUseService;

  @Qualifier("microsoftGraphClient")
  private final AuthClient microsoftGraphClient;

  @Autowired
  public AccountHolderService(
    AccountHolderRepository accountHolderRepository,
    ModelPatcherFactory<AccountHolder> accountHolderPatcherFactory,
    BeaconService beaconService,
    BeaconMapper beaconMapper,
    BeaconUseService beaconUseService,
    AuthClient microsoftGraphClient
  ) {
    this.accountHolderRepository = accountHolderRepository;
    this.accountHolderPatcherFactory = accountHolderPatcherFactory;
    this.beaconService = beaconService;
    this.beaconMapper = beaconMapper;
    this.beaconUseService = beaconUseService;
    this.microsoftGraphClient = microsoftGraphClient;
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

  public Optional<AccountHolder> updateAccountHolder(
    AccountHolderId id,
    AccountHolder accountHolderUpdate
  ) {
    try {
      log.info(
        "HELLO Account holder authId is " + accountHolderUpdate.getAuthId()
      );

      Optional<User> accountHolderInAzure = getAccountHolderFromAzureAd(
        accountHolderUpdate.getAuthId()
      );

      if (accountHolderInAzure.isEmpty()) {
        return Optional.empty();
      }

      Optional<AccountHolder> savedAccountHolder = updateAccountHolderInDb(
        id,
        accountHolderUpdate
      );

      if (savedAccountHolder.isPresent()) {
        microsoftGraphClient.updateUser(accountHolderUpdate);
      }

      return savedAccountHolder;
    } catch (Exception error) {
      log.error(
        "Couldn't update account holder with id" +
        accountHolderUpdate.getId().unwrap() +
        " in the DB"
      );
      return null;
    }
  }

  public Optional<User> getAccountHolderFromAzureAd(String authId) {
    AzureAdAccountHolder accountHolderInAzAd;

    try {
      accountHolderInAzAd =
        (AzureAdAccountHolder) microsoftGraphClient.getUser(authId);
    } catch (Exception azureAdError) {
      log.error("Couldn't find account holder authId " + authId + "in Azure");
      throw azureAdError;
    }

    return Optional.of(accountHolderInAzAd);
  }

  private Optional<AccountHolder> updateAccountHolderInDb(
    AccountHolderId id,
    AccountHolder accountHolderUpdate
  ) {
    AccountHolder accountHolder = accountHolderRepository
      .findById(id)
      .orElse(null);
    if (accountHolder == null) {
      return Optional.empty();
    }

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
        beaconMapper.toDTO(b, beaconUseService.getMainUseByBeaconId(b.getId()))
      )
      .collect(Collectors.toList());
  }
}
