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
  List<String> scopes = List.of("User.ReadWrite.All");

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

  public void getUser() {
    String eviesUserId = "b96c194c-9e1c-4869-abdf-3d0e854c111d";
    User user = graphClient.users(eviesUserId).buildRequest().get();

    log.info(user.displayName);
  }
}
