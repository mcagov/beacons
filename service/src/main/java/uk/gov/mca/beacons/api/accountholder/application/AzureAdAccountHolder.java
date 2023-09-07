package uk.gov.mca.beacons.api.accountholder.application;

import com.microsoft.graph.models.PasswordProfile;
import java.util.UUID;
import lombok.Builder;
import lombok.Setter;
import uk.gov.mca.beacons.api.shared.domain.user.User;

@Builder
@Setter
public class AzureAdAccountHolder implements User {

  private UUID azureAdUserId;

  private String displayName;

  private String email;

  private String mailNickname;

  private String userPrincipalName;

  private PasswordProfile passwordProfile;

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

  public String getMailNickname() {
    return mailNickname;
  }

  public String getUserPrincipalName() {
    return userPrincipalName;
  }

  public PasswordProfile getPasswordProfile() {
    return passwordProfile;
  }
}
