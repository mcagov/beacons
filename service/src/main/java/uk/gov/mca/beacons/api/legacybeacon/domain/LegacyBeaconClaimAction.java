package uk.gov.mca.beacons.api.legacybeacon.domain;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import lombok.Getter;

@Getter
@Entity
@DiscriminatorValue("claim")
public class LegacyBeaconClaimAction extends LegacyBeaconAction {}
