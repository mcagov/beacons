package uk.gov.mca.beacons.api.accountholder.application;

import com.microsoft.graph.http.GraphServiceException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import uk.gov.mca.beacons.api.accountholder.domain.AccountHolder;

@Slf4j
@Component("microsoftGraphService")
public class MicrosoftGraphService {

  private final MicrosoftGraphClient graphClient;

  public MicrosoftGraphService(MicrosoftGraphClient graphClient) {
    this.graphClient = graphClient;
  }

  public uk.gov.mca.beacons.api.shared.domain.user.User createAzureAdUser(
    AzureAdAccountHolder user
  ) {
    try {
      return graphClient.createAzureAdUser(user);
    } catch (Exception error) {
      log.error(error.getMessage());
      throw error;
    }
  }

  public void updateUser(AccountHolder accountHolder)
    throws UpdateAzAdUserError {
    try {
      this.graphClient.updateUser(accountHolder);
    } catch (GraphServiceException error) {
      log.error(error.getMessage());
      throw new UpdateAzAdUserError("Error updating Azure AD user", error);
    }
  }

  public AzureAdAccountHolder getUser(String id) throws GetAzAdUserError {
    try {
      return this.graphClient.getUser(id);
    } catch (GetAzAdUserError error) {
      log.error(error.getMessage());
      throw error;
    }
  }

  public void deleteUser(String id) {
    this.graphClient.deleteUser(id);
  }
}
