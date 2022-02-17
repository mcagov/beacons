package uk.gov.mca.beacons.api.beacon.mappers;

import java.util.Objects;
import org.springframework.stereotype.Component;
import uk.gov.mca.beacons.api.accountholder.domain.AccountHolderId;
import uk.gov.mca.beacons.api.beacon.domain.Beacon;
import uk.gov.mca.beacons.api.beacon.domain.BeaconStatus;
import uk.gov.mca.beacons.api.beacon.rest.BeaconDTO;
import uk.gov.mca.beacons.api.beacon.rest.BeaconRegistrationDTO;
import uk.gov.mca.beacons.api.beacon.rest.CreateBeaconDTO;
import uk.gov.mca.beacons.api.beacon.rest.UpdateBeaconDTO;
import uk.gov.mca.beacons.api.dto.WrapperDTO;

@Component("BeaconMapperV2")
public class BeaconMapper {

  public Beacon fromDTO(CreateBeaconDTO dto) {
    Beacon beacon = new Beacon();
    beacon.setHexId(dto.getHexId());
    beacon.setManufacturer(dto.getManufacturer());
    beacon.setModel(dto.getModel());
    beacon.setManufacturerSerialNumber(dto.getManufacturerSerialNumber());
    beacon.setReferenceNumber(dto.getReferenceNumber());
    beacon.setChkCode(dto.getChkCode());
    beacon.setBatteryExpiryDate(dto.getBatteryExpiryDate());
    beacon.setLastServicedDate(dto.getLastServicedDate());
    beacon.setMti(dto.getMti());
    beacon.setSvdr(dto.getSvdr());
    beacon.setCsta(dto.getCsta());
    beacon.setBeaconType(dto.getBeaconType());
    beacon.setProtocol(dto.getProtocol());
    beacon.setCoding(dto.getCoding());
    beacon.setBeaconStatus(BeaconStatus.NEW);
    beacon.setAccountHolderId(new AccountHolderId(dto.getAccountHolderId()));

    return beacon;
  }

  public BeaconRegistrationDTO toRegistrationDTO(Beacon beacon) {
    return BeaconRegistrationDTO
      .builder()
      .id(Objects.requireNonNull(beacon.getId()).unwrap())
      .hexId(beacon.getHexId())
      .manufacturer(beacon.getManufacturer())
      .model(beacon.getModel())
      .manufacturerSerialNumber(beacon.getManufacturerSerialNumber())
      .referenceNumber(beacon.getReferenceNumber())
      .chkCode(beacon.getChkCode())
      .batteryExpiryDate(beacon.getBatteryExpiryDate())
      .lastServicedDate(beacon.getLastServicedDate())
      .mti(beacon.getMti())
      .svdr(beacon.getSvdr())
      .csta(beacon.getCsta())
      .beaconType(beacon.getBeaconType())
      .protocol(beacon.getProtocol())
      .coding(beacon.getCoding())
      .accountHolderId(beacon.getAccountHolderId().unwrap())
      .status(beacon.getBeaconStatus())
      .createdDate(beacon.getCreatedDate())
      .lastModifiedDate(beacon.getLastModifiedDate())
      .build();
  }

  public BeaconDTO toDTO(Beacon beacon) {
    BeaconDTO dto = new BeaconDTO();
    dto.setId(Objects.requireNonNull(beacon.getId()).unwrap());

    var attributes = BeaconDTO.Attributes
      .builder()
      .hexId(beacon.getHexId())
      .manufacturer(beacon.getManufacturer())
      .model(beacon.getModel())
      .manufacturerSerialNumber(beacon.getManufacturerSerialNumber())
      .referenceNumber(beacon.getReferenceNumber())
      .chkCode(beacon.getChkCode())
      .batteryExpiryDate(beacon.getBatteryExpiryDate())
      .lastServicedDate(beacon.getLastServicedDate())
      .mti(beacon.getMti())
      .svdr(beacon.getSvdr())
      .csta(beacon.getCsta())
      .beaconType(beacon.getBeaconType())
      .protocol(beacon.getProtocol())
      .coding(beacon.getCoding())
      .accountHolderId(beacon.getAccountHolderId().unwrap())
      .status(beacon.getBeaconStatus())
      .createdDate(beacon.getCreatedDate())
      .lastModifiedDate(beacon.getLastModifiedDate())
      .build();
    dto.setAttributes(attributes);

    return dto;
  }

  public Beacon fromDTO(UpdateBeaconDTO dto) {
    Beacon beacon = new Beacon();
    var attributes = dto.getAttributes();

    beacon.setHexId(attributes.getHexId());
    beacon.setManufacturer(attributes.getManufacturer());
    beacon.setModel(attributes.getModel());
    beacon.setManufacturerSerialNumber(
      attributes.getManufacturerSerialNumber()
    );
    beacon.setReferenceNumber(attributes.getReferenceNumber());
    beacon.setChkCode(attributes.getChkCode());
    beacon.setBatteryExpiryDate(attributes.getBatteryExpiryDate());
    beacon.setLastServicedDate(attributes.getLastServicedDate());
    beacon.setMti(attributes.getMti());
    beacon.setSvdr(attributes.getSvdr());
    beacon.setCsta(attributes.getCsta());
    beacon.setBeaconType(attributes.getBeaconType());
    beacon.setProtocol(attributes.getProtocol());
    beacon.setCoding(attributes.getCoding());
    beacon.setBeaconStatus(attributes.getStatus());

    return beacon;
  }

  public WrapperDTO<BeaconDTO> toWrapperDTO(Beacon beacon) {
    final WrapperDTO<BeaconDTO> wrapperDTO = new WrapperDTO<>();
    wrapperDTO.setData(toDTO(beacon));

    return wrapperDTO;
  }
}
