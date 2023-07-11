package uk.gov.mca.beacons.api.accountholder.application;

import com.azure.identity.ClientSecretCredential;
import com.azure.identity.ClientSecretCredentialBuilder;
import com.microsoft.graph.authentication.TokenCredentialAuthProvider;
import com.microsoft.graph.models.ProfilePhoto;
import com.microsoft.graph.models.User;
import com.microsoft.graph.requests.GraphServiceClient;
import com.microsoft.graph.requests.ProfilePhotoCollectionPage;
import java.util.List;
import java.util.UUID;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import uk.gov.mca.beacons.api.accountholder.domain.AccountHolder;
import uk.gov.mca.beacons.api.configuration.MicrosoftGraphConfiguration;

@Slf4j
@Component("microsoftGraphClient")
public class MicrosoftGraphClient implements AuthClient {

  private final ClientSecretCredential clientSecretCredential;
  private final TokenCredentialAuthProvider tokenCredAuthProvider;
  private final List<String> scopes = List.of(
    "https://graph.microsoft.com/.default"
  );
  private final GraphServiceClient graphClient;

  @Autowired
  public MicrosoftGraphClient(MicrosoftGraphConfiguration config) {
    this.clientSecretCredential =
      new ClientSecretCredentialBuilder()
        .clientId(config.getClientId())
        .clientSecret(config.getClientSecret())
        .tenantId(config.getB2cTenantId())
        .build();
    this.tokenCredAuthProvider =
      new TokenCredentialAuthProvider(scopes, clientSecretCredential);
    this.graphClient =
      GraphServiceClient
        .builder()
        .authenticationProvider(tokenCredAuthProvider)
        .buildClient();
  }

  public void updateUser(AccountHolder accountHolder) throws Exception {
    try {
      User azAdUser = new User();

      azAdUser.displayName = accountHolder.getFullName();
      azAdUser.mail = accountHolder.getEmail();

      this.graphClient.users(accountHolder.getAuthId())
        .buildRequest()
        .patch(azAdUser);
    } catch (Exception error) {
      log.error(error.getMessage());
      throw error;
    }
  }

  public AzureAdAccountHolder getUser(String id) {
    try {
      User azAdUser = graphClient.users(id).buildRequest().get();

      return AzureAdAccountHolder
        .builder()
        .azureAdUserId(UUID.fromString(azAdUser.id))
        .displayName(azAdUser.displayName)
        .email(azAdUser.mail)
        .build();
    } catch (Exception error) {
      log.error(error.getMessage());
      throw error;
    }
  }

  public void deleteUser(String id) {
    try {
      graphClient.users(id).buildRequest().delete();
    } catch (Exception error) {
      log.error(error.getMessage());
      throw error;
    }
  }
}
