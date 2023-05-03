package uk.gov.mca.beacons.api.accountholder.application;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.mca.beacons.api.accountholder.domain.AccountHolder;
import uk.gov.mca.beacons.api.accountholder.domain.AccountHolderId;
import uk.gov.mca.beacons.api.accountholder.domain.AccountHolderRepository;
import uk.gov.mca.beacons.api.beacon.application.BeaconService;
import uk.gov.mca.beacons.api.beacon.domain.Beacon;
import uk.gov.mca.beacons.api.beacon.mappers.BeaconMapper;
import uk.gov.mca.beacons.api.beacon.rest.BeaconDTO;
import uk.gov.mca.beacons.api.mappers.ModelPatcherFactory;

@Transactional
@Service("AccountHolderServiceV2")
public class AccountHolderService {

  private final AccountHolderRepository accountHolderRepository;
  private final ModelPatcherFactory<AccountHolder> accountHolderPatcherFactory;
  private final BeaconService beaconService;
  private final BeaconMapper beaconMapper;

  @Autowired
  public AccountHolderService(
    AccountHolderRepository accountHolderRepository,
    ModelPatcherFactory<AccountHolder> accountHolderPatcherFactory,
    BeaconService beaconService,
    BeaconMapper beaconMapper
  ) {
    this.accountHolderRepository = accountHolderRepository;
    this.accountHolderPatcherFactory = accountHolderPatcherFactory;
    this.beaconService = beaconService;
    this.beaconMapper = beaconMapper;
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
    AccountHolder accountHolder = accountHolderRepository
      .findById(id)
      .orElse(null);
    if (accountHolder == null) return Optional.empty();

    final var patcher = accountHolderPatcherFactory
      .getModelPatcher()
      .withMapping(AccountHolder::getFullName, AccountHolder::setFullName)
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
      .map(b -> beaconMapper.toDTO(b))
      .collect(Collectors.toList());
  }
}
