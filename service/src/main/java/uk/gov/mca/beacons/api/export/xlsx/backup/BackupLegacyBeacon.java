package uk.gov.mca.beacons.api.export.xlsx.backup;

import java.time.OffsetDateTime;
import javax.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import uk.gov.mca.beacons.api.legacybeacon.domain.LegacyBeaconId;
import uk.gov.mca.beacons.api.legacybeacon.domain.LegacyData;

@Getter
public class BackupLegacyBeacon {

  @Setter
  private LegacyBeaconId id;

  @Setter
  @NotNull
  private String hexId;

  @Setter
  private String beaconStatus;

  @Setter
  private LegacyData data;

  @Setter
  private String ownerName;

  @Setter
  private String ownerEmail;

  @Setter
  private String useActivities;

  @Setter
  private OffsetDateTime createdDate;

  @Setter
  private OffsetDateTime lastModifiedDate;

  public static BackupLegacyBeacon createFromBeaconBackupItem(
    BeaconBackupItem beaconBackupItem
  ) {
    return new BackupLegacyBeacon(
      new LegacyBeaconId(beaconBackupItem.getId()),
      beaconBackupItem.getHexId(),
      beaconBackupItem.getBeaconStatus(),
      beaconBackupItem.getData(),
      beaconBackupItem.getOwnerName(),
      beaconBackupItem.getOwnerEmail(),
      beaconBackupItem.getUseActivities(),
      beaconBackupItem.getCreatedDate(),
      beaconBackupItem.getLastModifiedDate()
    );
  }

  private BackupLegacyBeacon(
    LegacyBeaconId id,
    String hexId,
    String beaconStatus,
    LegacyData data,
    String ownerName,
    String ownerEmail,
    String useActivities,
    OffsetDateTime createdDate,
    OffsetDateTime lastModifiedDate
  ) {
    setId(id);
    setHexId(hexId);
    setBeaconStatus(beaconStatus);
    setData(data);
    setOwnerName(ownerName);
    setOwnerEmail(ownerEmail);
    setUseActivities(useActivities);
    setCreatedDate(createdDate);
    setLastModifiedDate(lastModifiedDate);
  }
}
