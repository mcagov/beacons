package uk.gov.mca.beacons.api.export;

import org.springframework.batch.item.ItemProcessor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import uk.gov.mca.beacons.api.beacon.domain.Beacon;
import uk.gov.mca.beacons.api.beacon.domain.BeaconId;
import uk.gov.mca.beacons.api.beaconowner.domain.BeaconOwner;
import uk.gov.mca.beacons.api.beaconowner.domain.BeaconOwnerRepository;

@Component
public class BeaconToSpreadsheetRowItemProcessor
  implements ItemProcessor<Beacon, SpreadsheetRow> {

  private final BeaconOwnerRepository beaconOwnerRepository;

  @Autowired
  public BeaconToSpreadsheetRowItemProcessor(
    BeaconOwnerRepository beaconOwnerRepository
  ) {
    this.beaconOwnerRepository = beaconOwnerRepository;
  }

  @Override
  public SpreadsheetRow process(Beacon beacon) {
    BeaconId beaconId = beacon.getId();
    BeaconOwner beaconOwner = beaconOwnerRepository
      .findBeaconOwnerByBeaconId(beaconId)
      .orElse(null);

    return new SpreadsheetRow(beacon, beaconOwner);
  }
}
