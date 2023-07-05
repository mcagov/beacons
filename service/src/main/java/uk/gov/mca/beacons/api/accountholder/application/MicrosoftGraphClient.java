package uk.gov.mca.beacons.api.accountholder.application;

import com.azure.identity.ClientSecretCredential;
import com.azure.identity.ClientSecretCredentialBuilder;
import com.microsoft.graph.authentication.TokenCredentialAuthProvider;
import com.microsoft.graph.models.User;
import com.microsoft.graph.requests.GraphServiceClient;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.UUID;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import uk.gov.mca.beacons.api.accountholder.domain.AccountHolder;

@Slf4j
@Component("microsoftGraphClient")
public class MicrosoftGraphClient implements AuthClient {

  private String clientId;
  private String clientSecret;
  private String b2cTenantId;
  private final List<String> scopes = List.of(
    "https://graph.microsoft.com/.default"
  );

  public MicrosoftGraphClient(
    @Value("${microsoft-graph.client-id}}") String clientId,
    @Value("${microsoft-graph.client-secret}}") String clientSecret,
    @Value("${microsoft-graph.b2c-tenant-id}}") String b2cTenantId
  ) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.b2cTenantId = b2cTenantId;
  }

  final ClientSecretCredential clientSecretCredential = new ClientSecretCredentialBuilder()
    .clientId(clientId)
    .clientSecret(clientSecret)
    .tenantId(b2cTenantId)
    .build();

  final TokenCredentialAuthProvider tokenCredAuthProvider = new TokenCredentialAuthProvider(
    scopes,
    clientSecretCredential
  );

  final GraphServiceClient graphClient = GraphServiceClient
    .builder()
    .authenticationProvider(tokenCredAuthProvider)
    .buildClient();

  public void updateUser(AccountHolder accountHolder) {
    try {
      User azAdUser = new User();

      azAdUser.displayName = accountHolder.getFullName();
      azAdUser.userPrincipalName = accountHolder.getEmail();
      azAdUser.mail = accountHolder.getEmail();

      graphClient
        .users(accountHolder.getAuthId().toString())
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
