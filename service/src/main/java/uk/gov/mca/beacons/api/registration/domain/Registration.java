package uk.gov.mca.beacons.api.registration.domain;

import java.util.List;
import lombok.*;
import org.jetbrains.annotations.NotNull;
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
  private List<EmergencyContact> emergencyContacts;

  public void setBeaconId(BeaconId beaconId) {
    if (beaconOwner != null) {
      beaconOwner.setBeaconId(beaconId);
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

  //  public void hydrateBeaconFromBeaconBackupItem(BeaconBackupItem beaconBackupItem) {
  //    Beacon beacon = Beacon.builder()
  //                    .id(new BeaconId(beaconBackupItem.getId()))
  //                    .hexId()
  //
  //    setBeacon(beacon);
  //  }

  // Sorts by beacon created date in descending order
  @Override
  public int compareTo(@NotNull Registration o) {
    return -beacon.getCreatedDate().compareTo(o.beacon.getCreatedDate());
  }
}
