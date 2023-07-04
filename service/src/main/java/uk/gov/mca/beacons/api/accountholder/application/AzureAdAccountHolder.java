package uk.gov.mca.beacons.api.accountholder.application;

import java.util.UUID;
import lombok.Builder;
import uk.gov.mca.beacons.api.shared.domain.user.User;

@Builder
public class AzureAdAccountHolder implements User {

  private UUID azureAdUserId;

  private String displayName;

  private String email;

  @Override
  public UUID getUserId() {
    return azureAdUserId;
  }

  @Override
  public String getFullName() {
    return displayName;
  }

  @Override
  public String getEmail() {
    return email;
  }
}
