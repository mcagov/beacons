package uk.gov.mca.beacons.api.accountholder.application;

import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.mca.beacons.api.accountholder.domain.AccountHolder;
import uk.gov.mca.beacons.api.accountholder.domain.AccountHolderId;
import uk.gov.mca.beacons.api.accountholder.domain.AccountHolderRepository;
import uk.gov.mca.beacons.api.mappers.ModelPatcherFactory;

@Transactional
@Service("AccountHolderServiceV2")
public class AccountHolderService {

  private final AccountHolderRepository accountHolderRepository;
  private final ModelPatcherFactory<AccountHolder> accountHolderPatcherFactory;

  @Autowired
  public AccountHolderService(
    AccountHolderRepository accountHolderRepository,
    ModelPatcherFactory<AccountHolder> accountHolderPatcherFactory
  ) {
    this.accountHolderRepository = accountHolderRepository;
    this.accountHolderPatcherFactory = accountHolderPatcherFactory;
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
}
