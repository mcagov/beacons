package uk.gov.mca.beacons.api.accountholder.application;

import com.azure.identity.ClientSecretCredential;
import com.azure.identity.ClientSecretCredentialBuilder;
import com.microsoft.graph.authentication.TokenCredentialAuthProvider;
import com.microsoft.graph.http.GraphServiceException;
import com.microsoft.graph.models.User;
import com.microsoft.graph.requests.GraphServiceClient;
import java.util.List;
import java.util.UUID;
import javax.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import uk.gov.mca.beacons.api.accountholder.domain.AccountHolder;
import uk.gov.mca.beacons.api.configuration.MicrosoftGraphConfiguration;

@Slf4j
@Component("microsoftGraphClient")
public class MicrosoftGraphClient implements AuthClient {

  private final List<String> scopes = List.of(
    "https://graph.microsoft.com/.default"
  );
  private GraphServiceClient graphClient;
  private MicrosoftGraphConfiguration config;

  @Autowired
  public MicrosoftGraphClient(MicrosoftGraphConfiguration config) {
    this.config = config;
  }

  @PostConstruct
  public void initialize() {
    try {
      ClientSecretCredential clientSecretCredential = new ClientSecretCredentialBuilder()
        .clientId(config.getClientId())
        .clientSecret(config.getClientSecret())
        .tenantId(config.getB2cTenantId())
        .build();
      TokenCredentialAuthProvider tokenCredAuthProvider = new TokenCredentialAuthProvider(
        scopes,
        clientSecretCredential
      );
      this.graphClient =
        GraphServiceClient
          .builder()
          .authenticationProvider(tokenCredAuthProvider)
          .buildClient();
    } catch (Exception ex) {
      log.error("Unable to create graph client", ex);
      this.graphClient = null;
    }
  }

  @Override
  public uk.gov.mca.beacons.api.shared.domain.user.User createUser(
    uk.gov.mca.beacons.api.shared.domain.user.User user
  ) {
    return null;
  }

  @Override
  public uk.gov.mca.beacons.api.shared.domain.user.User createAzureAdUser(
    AzureAdAccountHolder user
  ) {
    try {
      User azAdUser = new User();
      azAdUser.accountEnabled = true;
      azAdUser.displayName = user.getFullName();
      azAdUser.mail = user.getEmail();
      azAdUser.mailNickname = user.getMailNickname();
      azAdUser.userPrincipalName = user.getUserPrincipalName();
      azAdUser.passwordProfile = user.getPasswordProfile();

      User createdAzAdUser = graphClient.users().buildRequest().post(azAdUser);

      return AzureAdAccountHolder
        .builder()
        .azureAdUserId(UUID.fromString(createdAzAdUser.id))
        .displayName(createdAzAdUser.displayName)
        .email(createdAzAdUser.mail)
        .passwordProfile(createdAzAdUser.passwordProfile)
        .build();
    } catch (Exception error) {
      log.error(error.getMessage());
      throw error;
    }
  }

  public void updateUser(AccountHolder accountHolder)
    throws UpdateAzAdUserError {
    try {
      User azAdUser = new User();
      azAdUser.id = accountHolder.getAuthId();
      azAdUser.displayName = accountHolder.getFullName();
      azAdUser.mail = accountHolder.getEmail();

      this.graphClient.users(accountHolder.getAuthId())
        .buildRequest()
        .patch(azAdUser);
    } catch (GraphServiceException error) {
      log.error(error.getMessage());
      throw new UpdateAzAdUserError("Error updating Azure AD user", error);
    }
  }

  public AzureAdAccountHolder getUser(String id) throws GetAzAdUserError {
    try {
      User azAdUser = graphClient.users(id).buildRequest().get();

      return AzureAdAccountHolder
        .builder()
        .azureAdUserId(UUID.fromString(azAdUser.id))
        .displayName(azAdUser.displayName)
        .email(azAdUser.mail)
        .build();
    } catch (GetAzAdUserError error) {
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
