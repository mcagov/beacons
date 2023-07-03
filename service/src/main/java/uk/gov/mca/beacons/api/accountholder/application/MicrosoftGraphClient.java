package uk.gov.mca.beacons.api.accountholder.application;

import com.azure.identity.ClientSecretCredential;
import com.azure.identity.ClientSecretCredentialBuilder;
import com.microsoft.graph.authentication.TokenCredentialAuthProvider;
import com.microsoft.graph.models.User;
import com.microsoft.graph.requests.GraphServiceClient;
import com.microsoft.graph.requests.UserCollectionRequest;
import java.util.List;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class MicrosoftGraphClient {

  // how do I inject env vars in Spring?
  List<String> scopes = List.of("https://graph.microsoft.com/.default");

  final ClientSecretCredential clientSecretCredential = new ClientSecretCredentialBuilder()
    .clientId("485d79d6-4691-4287-a100-0d8eb1fcd4c4")
    .clientSecret("jX.8Q~qAxylEpkAQjwwwgHfqyezjBGnjXEm6bbN~")
    .tenantId("513fb495-9a90-425b-a49a-bc6ebe2a429e")
    .build();

  // step through to check it's getting a valid token
  final TokenCredentialAuthProvider tokenCredAuthProvider = new TokenCredentialAuthProvider(
    scopes,
    clientSecretCredential
  );

  final GraphServiceClient graphClient = GraphServiceClient
    .builder()
    .authenticationProvider(tokenCredAuthProvider)
    .buildClient();

  // don't silently fail or log
  // throw custom exception if coldn't update
  // build up a User in the form and pass in
  // User azureAdUser
  public void updateUser() {
    String eviesUserId = "b96c194c-9e1c-4869-abdf-3d0e854c111d";
    User user = new User();
    user.mailNickname = "EVIE";

    graphClient.users(eviesUserId).buildRequest().patch(user);

    log.info(user.displayName);
  }

  public User getUser(String id) {
    User user = graphClient.users(id).buildRequest().get();

    log.info(user.displayName);

    return user;
  }

  // custom exception
  public void deleteUser(String id) {
    try {
      graphClient.users(id).buildRequest().delete();
    } catch (Exception error) {
      log.error(error.getMessage());
      throw error;
    }
  }
}
