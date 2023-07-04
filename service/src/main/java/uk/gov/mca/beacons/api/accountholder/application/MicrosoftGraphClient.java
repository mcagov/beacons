package uk.gov.mca.beacons.api.accountholder.application;

import com.azure.identity.ClientSecretCredential;
import com.azure.identity.ClientSecretCredentialBuilder;
import com.microsoft.graph.authentication.TokenCredentialAuthProvider;
import com.microsoft.graph.models.User;
import com.microsoft.graph.requests.GraphServiceClient;
import java.util.List;
import java.util.UUID;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import uk.gov.mca.beacons.api.accountholder.domain.AccountHolder;

@Slf4j
@Component("microsoftGraphClient")
public class MicrosoftGraphClient implements AuthClient {

  List<String> scopes = List.of("https://graph.microsoft.com/.default");

  final ClientSecretCredential clientSecretCredential = new ClientSecretCredentialBuilder()
    .clientId("485d79d6-4691-4287-a100-0d8eb1fcd4c4")
    .clientSecret("jX.8Q~qAxylEpkAQjwwwgHfqyezjBGnjXEm6bbN~")
    .tenantId("513fb495-9a90-425b-a49a-bc6ebe2a429e")
    .build();

  final TokenCredentialAuthProvider tokenCredAuthProvider = new TokenCredentialAuthProvider(
    scopes,
    clientSecretCredential
  );

  final GraphServiceClient graphClient = GraphServiceClient
    .builder()
    .authenticationProvider(tokenCredAuthProvider)
    .buildClient();

  // edit an AccountHolder in the form and pass in
  public void updateUser(AccountHolder accountHolder) {
    try {
      User user = new User();
      user.displayName = accountHolder.getFullName();
      user.mail = accountHolder.getEmail();

      graphClient
        .users(accountHolder.getUserId().toString())
        .buildRequest()
        .patch(user);

      log.info(user.displayName);
    } catch (Exception error) {
      log.error(error.getMessage());
      throw error;
    }
  }

  public AzureAdAccountHolder getUser(String id) {
    try {
      User user = graphClient.users(id).buildRequest().get();

      log.info(user.displayName);

      return AzureAdAccountHolder
        .builder()
        .azureAdUserId(UUID.fromString(user.id))
        .displayName(user.displayName)
        .email(user.mail)
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
