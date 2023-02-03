package uk.gov.mca.beacons.api.export.mappers;

import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import uk.gov.mca.beacons.api.accountholder.domain.AccountHolder;
import uk.gov.mca.beacons.api.beacon.domain.Beacon;
import uk.gov.mca.beacons.api.beaconowner.domain.BeaconOwner;
import uk.gov.mca.beacons.api.beaconuse.domain.BeaconUse;
import uk.gov.mca.beacons.api.emergencycontact.domain.EmergencyContact;
import uk.gov.mca.beacons.api.emergencycontact.rest.EmergencyContactDTO;
import uk.gov.mca.beacons.api.export.rest.*;
import uk.gov.mca.beacons.api.legacybeacon.domain.*;
import uk.gov.mca.beacons.api.note.domain.Note;
import uk.gov.mca.beacons.api.registration.domain.Registration;
import uk.gov.mca.beacons.api.shared.mappers.person.AddressMapper;
import uk.gov.mca.beacons.api.shared.rest.person.dto.AddressDTO;
import uk.gov.mca.beacons.api.utils.BeaconsStringUtils;

@Slf4j
@Component("BeaconExportMapper")
public class ExportMapper {

  private final DateTimeFormatter dtf = DateTimeFormatter.ofPattern(
    "dd/MM/yyyy"
  );

  private final AddressMapper addressMapper;

  @Autowired
  public ExportMapper(AddressMapper addressMapper) {
    this.addressMapper = addressMapper;
  }

  public LabelDTO toLabelDTO(Registration registration) {
    Beacon beacon = registration.getBeacon();
    BeaconUse mainUse = registration.getMainUse();

    return LabelDTO
      .builder()
      .mcaContactNumber("+44 (0)1326 317575")
      .beaconUse(
        mainUse != null
          ? BeaconsStringUtils.valueOrEmpty(mainUse.getName())
          : ""
      )
      .hexId(beacon.getHexId())
      .coding(BeaconsStringUtils.valueOrEmpty(beacon.getCoding()))
      .proofOfRegistrationDate(OffsetDateTime.now().format(dtf))
      .build();
  }

  public LabelDTO toLegacyLabelDTO(LegacyBeacon beacon) {
    LegacyUse mainUse = beacon.getData().getMainUse();
    LegacyBeaconDetails beaconData = beacon.getData().getBeacon();

    return LabelDTO
      .builder()
      .mcaContactNumber("+44 (0)1326 317575")
      .beaconUse(
        mainUse != null
          ? BeaconsStringUtils.valueOrEmpty(mainUse.getName())
          : ""
      )
      .hexId(beacon.getHexId())
      .coding(BeaconsStringUtils.valueOrEmpty(beaconData.getCoding()))
      .proofOfRegistrationDate(OffsetDateTime.now().format(dtf))
      .build();
  }

  public BeaconExportDTO toBeaconExportDTO(
    Registration registration,
    AccountHolder accountHolder,
    List<Note> nonSystemNotes
  ) {
    Beacon beacon = registration.getBeacon();
    BeaconUse mainUse = registration.getMainUse();
    BeaconOwner owner = registration.getBeaconOwner();

    return BeaconExportDTO
      .builder()
      .type("New")
      .id(beacon.getId().unwrap().toString())
      .name(
        mainUse != null
          ? BeaconsStringUtils.valueOrEmpty(mainUse.getName())
          : ""
      )
      .proofOfRegistrationDate(OffsetDateTime.now())
      .lastModifiedDate(beacon.getLastModifiedDate())
      .referenceNumber(beacon.getReferenceNumber())
      .recordCreatedDate(beacon.getCreatedDate().toString())
      .beaconStatus(beacon.getBeaconStatus().toString())
      .hexId(beacon.getHexId())
      .manufacturer(beacon.getManufacturer())
      .manufacturerSerialNumber(beacon.getManufacturerSerialNumber())
      .beaconModel(beacon.getModel())
      .beaconlastServiced(
        beacon.getLastServicedDate() != null
          ? beacon.getLastServicedDate().toString()
          : null
      )
      .beaconCoding(beacon.getCoding())
      .batteryExpiryDate(
        beacon.getBatteryExpiryDate() != null
          ? beacon.getBatteryExpiryDate().toString()
          : null
      )
      .codingProtocol(beacon.getProtocol())
      .cstaNumber(beacon.getCsta())
      .chkCode(beacon.getChkCode())
      .notes(
        nonSystemNotes
          .stream()
          .map(n ->
            new BeaconExportNoteDTO(
              n.getCreatedDate().toLocalDateTime(),
              n.getText()
            )
          )
          .collect(Collectors.toList())
      )
      .uses(toUsesDTO(registration.getBeaconUses()))
      .owners(
        Arrays.asList(
          owner != null ? toOwnerDTO(registration.getBeaconOwner()) : null
        )
      )
      .accountHolder(toAccountHolderDTO(accountHolder))
      .emergencyContacts(
        toEmergencyContactsDTO(registration.getEmergencyContacts())
      )
      .build();
  }

  List<BeaconExportUseDTO> toUsesDTO(List<BeaconUse> uses) {
    List<BeaconExportUseDTO> usesDTO = new ArrayList<>();
    for (BeaconUse use : uses) {
      switch (use.getEnvironment()) {
        case MARITIME:
          usesDTO.add(toMaritimeUse(use));
          break;
        case AVIATION:
          usesDTO.add(toAviationUse(use));
          break;
        case LAND:
          usesDTO.add(toLandUse(use));
          break;
      }
    }
    return usesDTO;
  }

  private BeaconExportMaritimeUseDTO toMaritimeUse(BeaconUse use) {
    return BeaconExportMaritimeUseDTO
      .builder()
      .environment(use.getEnvironment().toString())
      .typeOfUse(use.getUseType())
      .beaconPosition(use.getBeaconPosition())
      .beaconLocation(use.getBeaconLocation())
      .windfarmLocation(use.getWindfarmLocation())
      .rigPlatformLocation(use.getRigPlatformLocation())
      .vesselName(use.getVesselName())
      .homePort(use.getHomeport())
      .maxPersonOnBoard(use.getMaxCapacity() != null ? use.getMaxCapacity() : 0)
      .vesselCallsign(use.getCallSign())
      .mmsiNumber(
        use
          .getMmsiNumbers()
          .stream()
          .filter(s -> !StringUtils.isBlank(s))
          .collect(Collectors.joining(" - "))
      )
      .radioSystems(use.getCommunicationTypes())
      .fishingVesselPortIdAndNumbers(use.getPortLetterNumber())
      .officialNumber(use.getOfficialNumber())
      .imoNumber(use.getImoNumber())
      .areaOfOperation(use.getAreaOfOperation())
      .rssAndSsrNumber(
        BeaconsStringUtils.getMultipleValuesAsString(
          " - ",
          use.getRssNumber(),
          use.getSsrNumber()
        )
      )
      .notes(use.getMoreDetails())
      .build();
  }

  private BeaconExportAviationUseDTO toAviationUse(BeaconUse use) {
    return BeaconExportAviationUseDTO
      .builder()
      .environment(use.getEnvironment().toString())
      .typeOfUse(use.getUseType())
      .beaconPosition(use.getBeaconPosition())
      .beaconLocation(use.getBeaconLocation())
      .aircraftManufacturer(use.getAircraftManufacturer())
      .aircraftType(use.getUseType())
      .maxPersonOnBoard(use.getMaxCapacity() != null ? use.getMaxCapacity() : 0)
      .aircraftRegistrationMark(use.getRegistrationMark())
      .twentyFourBitAddressInHex(use.getHexAddress())
      .principalAirport(use.getPrincipalAirport())
      .secondaryAirport(use.getSecondaryAirport())
      .radioSystems(use.getCommunicationTypes())
      .isDongle(Boolean.TRUE.equals(use.getDongle()) ? "YES" : "NO")
      .notes(use.getMoreDetails())
      .build();
  }

  BeaconExportLandUseDTO toLandUse(BeaconUse use) {
    return BeaconExportLandUseDTO
      .builder()
      .environment(use.getEnvironment().toString())
      .typeOfUse(use.getUseType())
      .beaconPosition(use.getBeaconPosition())
      .beaconLocation(use.getBeaconLocation())
      .windfarmLocation(use.getWindfarmLocation())
      .rigPlatformLocation(use.getRigPlatformLocation())
      .descriptionOfIntendedUse(
        BeaconsStringUtils.enumAsString(use.getActivity())
      )
      .numberOfPersonsOnBoard(
        use.getMaxCapacity() == null ? 0 : use.getMaxCapacity()
      )
      .areaOfUse(use.getAreaOfOperation())
      .radioSystems(use.getCommunicationTypes())
      .notes(use.getMoreDetails())
      .build();
  }

  public BeaconExportDTO toLegacyBeaconExportDTO(LegacyBeacon beacon) {
    LegacyBeaconDetails details = beacon.getData().getBeacon();
    LegacyUse mainUse = beacon.getData().getMainUse();

    return BeaconExportDTO
      .builder()
      .type("Legacy")
      .name(
        mainUse != null
          ? BeaconsStringUtils.valueOrEmpty(mainUse.getName())
          : ""
      )
      .id(beacon.getId().unwrap().toString())
      .proofOfRegistrationDate(OffsetDateTime.now())
      .lastModifiedDate(beacon.getLastModifiedDate())
      .departmentReference(details.getDepartRefId())
      .recordCreatedDate(details.getFirstRegistrationDate())
      .beaconStatus(beacon.getBeaconStatus())
      .hexId(beacon.getHexId())
      .manufacturer(details.getManufacturer())
      .serialNumber(
        details.getSerialNumber() != null ? details.getSerialNumber() : 0
      )
      .cospasSarsatNumber(
        details.getCospasSarsatNumber() != null
          ? details.getCospasSarsatNumber().toString()
          : ""
      )
      .manufacturerSerialNumber(details.getManufacturerSerialNumber())
      .beaconModel(details.getModel())
      .beaconlastServiced(details.getLastServiceDate())
      .beaconCoding(details.getCoding())
      .batteryExpiryDate(details.getBatteryExpiryDate())
      .codingProtocol(details.getProtocol())
      .cstaNumber(details.getCsta())
      .beaconNote(details.getNote())
      .uses(toLegacyUsesDTO(beacon.getData().getUses()))
      .owners(toLegacyOwnersDTO(beacon.getData()))
      .emergencyContacts(
        toLegacyEmergencyContacts(beacon.getData().getEmergencyContact())
      )
      .build();
  }

  private BeaconExportAccountHolderDTO toAccountHolderDTO(AccountHolder ah) {
    AddressDTO address = addressMapper.toDTO(ah.getAddress());

    return BeaconExportAccountHolderDTO
      .builder()
      .fullName(ah.getFullName())
      .address(address)
      .telephoneNumbers(
        BeaconsStringUtils.getMultipleValuesAsString(
          " - ",
          ah.getTelephoneNumber(),
          ah.getAlternativeTelephoneNumber()
        )
      )
      .email(ah.getEmail())
      .build();
  }

  private BeaconExportOwnerDTO toOwnerDTO(BeaconOwner owner) {
    AddressDTO address = addressMapper.toDTO(owner.getAddress());

    return BeaconExportOwnerDTO
      .builder()
      .ownerName(owner.getFullName())
      .address(address)
      .telephoneNumbers(
        BeaconsStringUtils.getMultipleValuesAsString(
          " - ",
          owner.getTelephoneNumber(),
          owner.getAlternativeTelephoneNumber()
        )
      )
      .email(owner.getEmail())
      .build();
  }

  private List<EmergencyContactDTO> toEmergencyContactsDTO(
    List<EmergencyContact> emergencyContacts
  ) {
    return emergencyContacts
      .stream()
      .map(ec ->
        EmergencyContactDTO
          .builder()
          .fullName(ec.getFullName())
          .telephoneNumber(
            BeaconsStringUtils.getMultipleValuesAsString(
              " - ",
              ec.getTelephoneNumber(),
              ec.getAlternativeTelephoneNumber()
            )
          )
          .build()
      )
      .collect(Collectors.toList());
  }

  private List<EmergencyContactDTO> toLegacyEmergencyContacts(
    LegacyEmergencyContact emergencyContact
  ) {
    return Arrays.asList(
      EmergencyContactDTO
        .builder()
        .fullName(emergencyContact.getDetails())
        .build()
    );
  }

  private List<BeaconExportOwnerDTO> toLegacyOwnersDTO(LegacyData data) {
    List<BeaconExportOwnerDTO> ownersDTO = new ArrayList<>();

    ownersDTO.add(toLegacyOwnerDTO(data.getOwner()));
    for (LegacyGenericOwner o : data.getSecondaryOwners()) {
      ownersDTO.add(toLegacyOwnerDTO(o));
    }

    return ownersDTO;
  }

  BeaconExportOwnerDTO toLegacyOwnerDTO(LegacyGenericOwner owner) {
    AddressDTO address = AddressDTO
      .builder()
      .addressLine1(owner.getAddress1())
      .addressLine2(owner.getAddress2())
      .addressLine3(owner.getAddress3())
      .addressLine4(owner.getAddress4())
      .postcode(owner.getPostCode())
      .country(owner.getCountry())
      .build();

    return BeaconExportOwnerDTO
      .builder()
      .ownerName(owner.getOwnerName())
      .companyName(owner.getCompanyName())
      .careOf(owner.getCareOf())
      .address(address)
      .telephoneNumbers(
        BeaconsStringUtils.getMultipleValuesAsString(
          " - ",
          owner.getPhone1(),
          owner.getPhone2(),
          owner.getMobile1(),
          owner.getMobile2()
        )
      )
      .fax(owner.getFax())
      .email(owner.getEmail())
      .build();
  }

  List<BeaconExportUseDTO> toLegacyUsesDTO(List<LegacyUse> uses) {
    List<BeaconExportUseDTO> usesDTO = new ArrayList<>();
    for (LegacyUse use : uses) {
      switch (use.getEnvironment().trim().toUpperCase()) {
        case "MARITIME":
          usesDTO.add(toMaritimeUse(use));
          break;
        case "AVIATION":
        case "AIRCRAFT":
          usesDTO.add(toAviationUse(use));
          break;
        case "LAND":
          usesDTO.add(toLandUse(use));
          break;
        case "RIG/PLATFORM":
          usesDTO.add(toRigUse(use));
          break;
        case "MOD":
        default:
          usesDTO.add(toLegacyUse(use));
          break;
      }
    }
    return usesDTO;
  }

  private BeaconExportMaritimeUseDTO toMaritimeUse(LegacyUse use) {
    return BeaconExportMaritimeUseDTO
      .builder()
      .environment(use.getEnvironment())
      .typeOfUse(use.getPurpose())
      .vesselName(use.getVesselName())
      .homePort(use.getHomePort())
      .beaconLocation(use.getPosition())
      .beaconPosition(use.getBeaconPosition())
      .maxPersonOnBoard(use.getMaxPersons() != null ? use.getMaxPersons() : 0)
      .vesselCallsign(use.getCallSign())
      .mmsiNumber(
        use.getMmsiNumber() != null ? use.getMmsiNumber().toString() : null
      )
      .radioSystems(use.getCommunicationTypes())
      .notes(
        BeaconsStringUtils.getMultipleValuesAsString(
          " - ",
          use.getNotes(),
          use.getNote()
        )
      )
      .fishingVesselPortIdAndNumbers(use.getFishingVesselPln())
      .officialNumber(use.getOfficialNumber())
      .imoNumber(use.getImoNumber())
      .rssAndSsrNumber(use.getRssSsrNumber())
      .hullIdNumber(use.getHullIdNumber())
      .coastguardCGRefNumber(use.getCg66RefNumber())
      .build();
  }

  private BeaconExportAviationUseDTO toAviationUse(LegacyUse use) {
    return BeaconExportAviationUseDTO
      .builder()
      .environment(use.getEnvironment())
      .typeOfUse(use.getPurpose())
      .beaconLocation(use.getPosition())
      .beaconPosition(use.getBeaconPosition())
      .aircraftManufacturer(use.getAircraftDescription())
      .aircraftType(use.getAircraftType())
      .maxPersonOnBoard(use.getMaxPersons() != null ? use.getMaxPersons() : 0)
      .aircraftRegistrationMark(use.getAircraftRegistrationMark())
      .twentyFourBitAddressInHex(use.getBit24AddressHex())
      .aodSerialNumber(use.getAodSerialNumber())
      .principalAirport(use.getPrincipalAirport())
      .radioSystems(use.getCommunicationTypes())
      .notes(
        BeaconsStringUtils.getMultipleValuesAsString(
          " - ",
          use.getNotes(),
          use.getNote()
        )
      )
      .build();
  }

  private BeaconExportLandUseDTO toLandUse(LegacyUse use) {
    return BeaconExportLandUseDTO
      .builder()
      .environment(use.getEnvironment())
      .typeOfUse(use.getPurpose())
      .beaconLocation(use.getPosition())
      .beaconPosition(use.getBeaconPosition())
      .descriptionOfIntendedUse(use.getActivity())
      .numberOfPersonsOnBoard(
        use.getMaxPersons() != null ? use.getMaxPersons() : 0
      )
      .areaOfUse(use.getAreaOfUse())
      .tripInformation(use.getTripInfo())
      .radioSystems(use.getCommunicationTypes())
      .notes(
        BeaconsStringUtils.getMultipleValuesAsString(
          " - ",
          use.getNotes(),
          use.getNote()
        )
      )
      .build();
  }

  private BeaconExportRigUseDTO toRigUse(LegacyUse use) {
    return BeaconExportRigUseDTO
      .builder()
      .environment(use.getEnvironment())
      .typeOfUse(use.getPurpose())
      .rigName(use.getRigName())
      .homePort(use.getHomePort())
      .beaconLocation(use.getPosition())
      .beaconPosition(use.getBeaconPosition())
      .maxPersonOnBoard(use.getMaxPersons() != null ? use.getMaxPersons() : 0)
      .vesselCallsign(use.getCallSign())
      .mmsiNumber(
        use.getMmsiNumber() != null ? use.getMmsiNumber().toString() : null
      )
      .radioSystems(use.getCommunicationTypes())
      .imoNumber(use.getImoNumber())
      .notes(
        BeaconsStringUtils.getMultipleValuesAsString(
          " - ",
          use.getNotes(),
          use.getNote()
        )
      )
      .build();
  }

  private BeaconExportGenericUseDTO toLegacyUse(LegacyUse use) {
    return BeaconExportGenericUseDTO
      .builder()
      .environment(use.getEnvironment())
      .typeOfUse(use.getPurpose())
      .vesselName(use.getVesselName())
      .rigName(use.getRigName())
      .homePort(use.getHomePort())
      .beaconLocation(use.getPosition())
      .beaconPosition(use.getBeaconPosition())
      .maxPersonOnBoard(use.getMaxPersons() != null ? use.getMaxPersons() : 0)
      .vesselCallsign(use.getCallSign())
      .mmsiNumber(
        use.getMmsiNumber() != null ? use.getMmsiNumber().toString() : null
      )
      .radioSystems(use.getCommunicationTypes())
      .fishingVesselPortIdAndNumbers(use.getFishingVesselPln())
      .officialNumber(use.getOfficialNumber())
      .imoNumber(use.getImoNumber())
      .rssAndSsrNumber(use.getRssSsrNumber())
      .hullIdNumber(use.getHullIdNumber())
      .coastguardCGRefNumber(use.getCg66RefNumber())
      .aircraftType(use.getAircraftType())
      .aircraftRegistrationMark(use.getAircraftRegistrationMark())
      .twentyFourBitAddressInHex(use.getBit24AddressHex())
      .aodSerialNumber(use.getAodSerialNumber())
      .principalAirport(use.getPrincipalAirport())
      .descriptionOfIntendedUse(use.getActivity())
      .numberOfPersonsOnBoard(
        use.getMaxPersons() != null ? use.getMaxPersons() : 0
      )
      .areaOfUse(use.getAreaOfUse())
      .tripInformation(use.getTripInfo())
      .notes(
        BeaconsStringUtils.getMultipleValuesAsString(
          " - ",
          use.getNotes(),
          use.getNote()
        )
      )
      .build();
  }
}
