package uk.gov.mca.beacons.api.accountholder.application;

import com.azure.identity.ClientSecretCredential;
import com.azure.identity.ClientSecretCredentialBuilder;
import com.microsoft.graph.authentication.TokenCredentialAuthProvider;
import com.microsoft.graph.http.GraphServiceException;
import com.microsoft.graph.models.ObjectIdentity;
import com.microsoft.graph.models.User;
import com.microsoft.graph.requests.GraphServiceClient;
import java.util.Arrays;
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
public class MicrosoftGraphClient {

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
      if (
        config.getClientId() == null ||
        config.getClientSecret() == null ||
        config.getB2cTenantId() == null ||
        config.getB2cTenantName() == null
      ) {
        log.error(
          "Missing credentials: Client ID={}, Client Secret={}, B2C Tenant ID={}, B2C Tenant Name={}",
          config.getClientId(),
          config.getClientSecret(),
          config.getB2cTenantId(),
          config.getB2cTenantName()
        );
        this.graphClient = null;
      } else {
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
      }
    } catch (Exception ex) {
      log.error("Unable to create graph client", ex);
      this.graphClient = null;
    }
  }

  public uk.gov.mca.beacons.api.shared.domain.user.User createUser(
    uk.gov.mca.beacons.api.shared.domain.user.User user
  ) {
    return null;
  }

  public uk.gov.mca.beacons.api.shared.domain.user.User createAzureAdUser(
    AzureAdAccountHolder user
  ) {
    try {
      User azAdUser = new User();
      azAdUser.accountEnabled = true;
      azAdUser.displayName = user.getFullName();
      azAdUser.mail = user.getEmail();
      azAdUser.mailNickname = user.getMailNickname();
      azAdUser.passwordProfile = user.getPasswordProfile();

      ObjectIdentity azAdIdentity = new ObjectIdentity();
      azAdIdentity.signInType = "emailAddress";
      azAdIdentity.issuer = config.getB2cTenantDomain();
      azAdIdentity.issuerAssignedId = user.getEmail();

      azAdUser.identities = Arrays.asList(azAdIdentity);

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
      User azAdUser = graphClient
        .users(accountHolder.getAuthId())
        .buildRequest()
        .get();

      azAdUser.id = accountHolder.getAuthId();
      azAdUser.displayName = accountHolder.getFullName();
      azAdUser.mail = accountHolder.getEmail();

      ObjectIdentity azAdIdentity = new ObjectIdentity();
      azAdIdentity.signInType = "emailAddress";
      azAdIdentity.issuer = config.getB2cTenantDomain();
      azAdIdentity.issuerAssignedId = accountHolder.getEmail();

      azAdUser.identities = Arrays.asList(azAdIdentity);

      this.graphClient.users(accountHolder.getAuthId())
        .buildRequest()
        .patch(azAdUser);
    } catch (GraphServiceException error) {
      String errorMessage = error.getMessage();
      log.error(errorMessage);
      if (errorMessage.contains("already exists")) {
        throw new UpdateAzAdUserError(
          "A user with this email address already exists",
          error
        );
      }

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
