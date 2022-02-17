package uk.gov.mca.beacons.api.accountholder.domain;

import java.util.UUID;
import javax.transaction.Transactional;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import uk.gov.mca.beacons.api.BaseIntegrationTest;
import uk.gov.mca.beacons.api.accountholder.mappers.AccountHolderMapper;
import uk.gov.mca.beacons.api.shared.domain.person.Address;

public class AccountHolderIntegrationTest extends BaseIntegrationTest {

  @Autowired
  AccountHolderRepository accountHolderRepository;

  @Transactional
  @Test
  public void shouldSaveAccountHolder() {
    AccountHolder accountHolder = new AccountHolder();
    accountHolder.setFullName("John");
    accountHolder.setAddress(
      Address.builder().addressLine1("Something").build()
    );
    accountHolder.setEmail("test@test.com");
    accountHolder.setAuthId(UUID.randomUUID().toString());

    AccountHolder savedAccountHolder = accountHolderRepository.saveAndFlush(
      accountHolder
    );

    assert savedAccountHolder.getId() != null;
    assert savedAccountHolder.getCreatedDate() != null;
    assert savedAccountHolder.getLastModifiedDate() != null;
    assert savedAccountHolder.getAddress() != null;
  }
}
