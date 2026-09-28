package uk.gov.mca.beacons.api.accountholder.application;

import uk.gov.mca.beacons.api.accountholder.domain.AccountHolder;
import uk.gov.mca.beacons.api.shared.domain.user.User;

public interface MicrosoftGraphService {
  User createAzureAdUser(AzureAdAccountHolder user);

  void updateUser(AccountHolder accountHolder) throws UpdateAzAdUserError;

  AzureAdAccountHolder getUser(String id) throws GetAzAdUserError;

  void deleteUser(String id);
}
