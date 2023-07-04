package uk.gov.mca.beacons.api.accountholder.application;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import uk.gov.mca.beacons.api.accountholder.domain.AccountHolder;

@Slf4j
@Component("fakeGraphClient")
public class FakeGraphClient implements AuthClient {

  @Override
  public void updateUser(AccountHolder accountHolder) {
    log.info("Updating Azure AD user " + accountHolder.getFullName());
  }

  @Override
  public AzureAdAccountHolder getUser(String id) {
    log.info("Getting Azure AD user " + id);
    return AzureAdAccountHolder
      .builder()
      .displayName("Miss Gigi")
      .email("gigi@hotmail.com")
      .build();
  }

  @Override
  public void deleteUser(String id) {
    log.info("Deleting Azure AD user " + id);
  }
}
