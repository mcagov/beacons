package uk.gov.mca.beacons.api.accountholder.application;

import java.util.UUID;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;
import uk.gov.mca.beacons.api.accountholder.domain.AccountHolder;
import uk.gov.mca.beacons.api.configuration.LocalAuthConfiguration;

@Slf4j
@Profile("localauth")
@Component("microsoftGraphService")
public class LocalMicrosoftGraphService implements MicrosoftGraphService {

  private final LocalAuthConfiguration config;

  public LocalMicrosoftGraphService(LocalAuthConfiguration config) {
    this.config = config;
    log.warn(
      "The 'localauth' profile is active: Microsoft Graph is stubbed out and no Azure tenant is being contacted"
    );
  }

  @Override
  public uk.gov.mca.beacons.api.shared.domain.user.User createAzureAdUser(
    AzureAdAccountHolder user
  ) {
    log.info(
      "localauth: pretending to create Azure AD user {}",
      user.getEmail()
    );

    return AzureAdAccountHolder.builder()
      .azureAdUserId(UUID.randomUUID())
      .displayName(user.getFullName())
      .email(user.getEmail())
      .build();
  }

  @Override
  public void updateUser(AccountHolder accountHolder)
    throws UpdateAzAdUserError {
    log.info(
      "localauth: pretending to update Azure AD user {}",
      accountHolder.getAuthId()
    );
  }

  @Override
  public AzureAdAccountHolder getUser(String id) throws GetAzAdUserError {
    UUID azureAdUserId;

    try {
      azureAdUserId = UUID.fromString(id);
    } catch (IllegalArgumentException | NullPointerException e) {
      throw new GetAzAdUserError(
        "localauth: authId " + id + " is not a valid Azure object id",
        e
      );
    }

    boolean isLocalUser = azureAdUserId.equals(config.getId());

    return AzureAdAccountHolder.builder()
      .azureAdUserId(azureAdUserId)
      .displayName(isLocalUser ? config.getName() : "Seeded Account Holder")
      .email(isLocalUser ? config.getEmail() : id + "@beacons.local")
      .build();
  }

  @Override
  public void deleteUser(String id) {
    log.info("localauth: pretending to delete Azure AD user {}", id);
  }
}
