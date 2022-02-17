package uk.gov.mca.beacons.api.legacybeacon.mappers;

import java.util.Objects;
import java.util.stream.Collectors;
import org.springframework.stereotype.Component;
import uk.gov.mca.beacons.api.dto.WrapperDTO;
import uk.gov.mca.beacons.api.legacybeacon.domain.LegacyBeacon;
import uk.gov.mca.beacons.api.legacybeacon.domain.LegacyData;
import uk.gov.mca.beacons.api.legacybeacon.domain.LegacyUse;
import uk.gov.mca.beacons.api.legacybeacon.rest.dto.LegacyBeaconDTO;
import uk.gov.mca.beacons.api.utils.OffsetDateTimeOptionalZoneParser;

@Component("LegacyBeaconMapperV2")
public class LegacyBeaconMapper {

  public LegacyBeaconMapper() {}

  public LegacyBeacon fromDTO(LegacyBeaconDTO legacyBeaconDTO) {
    LegacyBeacon legacyBeacon = new LegacyBeacon();
    var attributes = legacyBeaconDTO.getAttributes();
    LegacyData data = LegacyData
      .builder()
      .beacon(attributes.getBeacon())
      .uses(attributes.getUses())
      .owner(attributes.getOwner())
      .secondaryOwners(attributes.getSecondaryOwners())
      .emergencyContact(attributes.getEmergencyContact())
      .build();

    legacyBeacon.setHexId(data.getBeacon().getHexId());
    legacyBeacon.setOwnerName(data.getOwner().getOwnerName());
    legacyBeacon.setOwnerEmail(data.getOwner().getEmail());
    legacyBeacon.setBeaconStatus("MIGRATED");
    legacyBeacon.setUseActivities(
      data
        .getUses()
        .stream()
        .map(LegacyUse::getUseType)
        .filter(Objects::nonNull)
        .collect(Collectors.joining(", "))
    );
    legacyBeacon.setCreatedDate(
      OffsetDateTimeOptionalZoneParser.parse(data.getBeacon().getCreatedDate())
    );
    legacyBeacon.setLastModifiedDate(
      OffsetDateTimeOptionalZoneParser.parse(
        data.getBeacon().getLastModifiedDate()
      )
    );

    legacyBeacon.setData(data);

    return legacyBeacon;
  }

  public LegacyBeaconDTO toDTO(LegacyBeacon legacyBeacon) {
    final var dto = new LegacyBeaconDTO();
    dto.setId(Objects.requireNonNull(legacyBeacon.getId()).unwrap());
    final var data = legacyBeacon.getData();
    final var attributes = LegacyBeaconDTO.Attributes
      .builder()
      .beacon(data.getBeacon())
      .owner(data.getOwner())
      .uses(data.getUses())
      .secondaryOwners(data.getSecondaryOwners())
      .emergencyContact(data.getEmergencyContact())
      .claimStatus(legacyBeacon.getBeaconStatus())
      .build();
    dto.setAttributes(attributes);

    return dto;
  }

  public WrapperDTO<LegacyBeaconDTO> toWrapperDTO(LegacyBeacon legacyBeacon) {
    final var wrapperDTO = new WrapperDTO<LegacyBeaconDTO>();
    wrapperDTO.setData(toDTO(legacyBeacon));

    return wrapperDTO;
  }
}
