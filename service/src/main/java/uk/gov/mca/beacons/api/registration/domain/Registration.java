package uk.gov.mca.beacons.api.registration.domain;

import java.util.List;
import lombok.*;
import org.jetbrains.annotations.NotNull;
import uk.gov.mca.beacons.api.accountholder.domain.AccountHolder;
import uk.gov.mca.beacons.api.beacon.domain.Beacon;
import uk.gov.mca.beacons.api.beacon.domain.BeaconId;
import uk.gov.mca.beacons.api.beaconowner.domain.BeaconOwner;
import uk.gov.mca.beacons.api.beaconuse.domain.BeaconUse;
import uk.gov.mca.beacons.api.emergencycontact.domain.EmergencyContact;
import uk.gov.mca.beacons.api.export.xlsx.backup.BeaconBackupItem;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Registration implements Comparable<Registration> {

  private Beacon beacon;
  private List<BeaconUse> beaconUses;
  private BeaconOwner beaconOwner;
  private List<BeaconOwner> beaconOwners;

  private AccountHolder accountHolder;
  private List<EmergencyContact> emergencyContacts;

  public void setBeaconId(BeaconId beaconId) {
    if (beaconOwner != null) {
      beaconOwner.setBeaconId(beaconId);
    }

    if (beaconOwners != null && !beaconOwners.isEmpty()) {
      beaconOwners.forEach(bo -> bo.setBeaconId(beaconId));
    }

    beaconUses.forEach(use -> use.setBeaconId(beaconId));
    emergencyContacts.forEach(emergencyContact ->
      emergencyContact.setBeaconId(beaconId)
    );
  }

  public BeaconUse getMainUse() {
    return getBeaconUses()
      .stream()
      .filter(bu -> bu.getMainUse())
      .findFirst()
      .orElse(null);
  }

  public String getModEmail(List<BeaconOwner> beaconOwners) {
    return beaconOwners
      .stream()
      .map(BeaconOwner::getEmail) // Assuming getEmail returns a String
      .filter(email -> email != null && email.endsWith("@mod.gov.uk")) // Filter based on email ending
      .findFirst()
      .orElse(null);
  }

  // Sorts by beacon created date in descending order
  @Override
  public int compareTo(@NotNull Registration o) {
    return -beacon.getCreatedDate().compareTo(o.beacon.getCreatedDate());
  }
}
