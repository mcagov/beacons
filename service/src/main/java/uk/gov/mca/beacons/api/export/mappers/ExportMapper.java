package uk.gov.mca.beacons.api.export.mappers;

import static uk.gov.mca.beacons.api.utils.StringUtils.getMultipleValuesAsString;

import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;
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
import uk.gov.mca.beacons.api.utils.StringUtils;

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
        mainUse != null ? StringUtils.valueOrEmpty(mainUse.getName()) : ""
      )
      .hexId(beacon.getHexId())
      .coding(StringUtils.valueOrEmpty(beacon.getCoding()))
      .proofOfRegistrationDate(
        beacon.getLastModifiedDate() != null
          ? beacon.getLastModifiedDate().format(dtf)
          : null
      )
      .build();
  }

  public LabelDTO toLegacyLabelDTO(LegacyBeacon beacon) {
    LegacyUse mainUse = beacon.getData().getUses().get(0); //Main use is first use?
    LegacyBeaconDetails beaconData = beacon.getData().getBeacon();

    return LabelDTO
      .builder()
      .mcaContactNumber("+44 (0)1326 317575")
      .beaconUse(
        mainUse != null ? StringUtils.valueOrEmpty(mainUse.getName()) : ""
      )
      .hexId(beacon.getHexId())
      .coding(StringUtils.valueOrEmpty(beaconData.getCoding()))
      .proofOfRegistrationDate(
        beacon.getLastModifiedDate() != null
          ? beacon.getLastModifiedDate().format(dtf)
          : null
      )
      .build();
  }

  public BeaconExportDTO toBeaconExportDTO(Beacon beacon) {
    return BeaconExportDTO
      .builder()
      .type("New")
      .proofOfRegistrationDate(beacon.getLastModifiedDate())
      .lastModifiedDate(beacon.getLastModifiedDate())
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
      .build();
  }

  public BeaconExportDTO toBeaconExportDTO(
    Registration registration,
    AccountHolder accountHolder,
    List<Note> nonSystemNotes
  ) {
    Beacon beacon = registration.getBeacon();

    return BeaconExportDTO
      .builder()
      .type("New")
      .proofOfRegistrationDate(beacon.getLastModifiedDate())
      .lastModifiedDate(beacon.getLastModifiedDate())
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
      .owners(Arrays.asList(toOwnerDTO(registration.getBeaconOwner())))
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
      .vesselName(use.getVesselName())
      .homePort(use.getHomeport())
      .vessel(use.getVesselName())
      .maxPersonOnBoard(use.getMaxCapacity() != null ? use.getMaxCapacity() : 0)
      .vesselCallsign(use.getCallSign())
      .mmsiNumber(String.join("   ", use.getMmsiNumbers()))
      .radioSystem(String.join(", ", use.getCommunicationTypes()))
      .fishingVesselPortIdAndNumbers(use.getPortLetterNumber())
      .officialNumber(use.getOfficialNumber())
      .imoNumber(use.getImoNumber())
      .areaOfOperation(use.getAreaOfOperation())
      .rssAndSsrNumber(
        getMultipleValuesAsString("   ", use.getRssNumber(), use.getSsrNumber())
      )
      .notes(use.getMoreDetails())
      .build();
  }

  private BeaconExportAviationUseDTO toAviationUse(BeaconUse use) {
    return BeaconExportAviationUseDTO
      .builder()
      .environment(use.getEnvironment().toString())
      .aircraftType(use.getAircraftManufacturer()) // Unsure on this.
      .maxPersonOnBoard(use.getMaxCapacity() != null ? use.getMaxCapacity() : 0)
      .aircraftRegistrationMark(use.getRegistrationMark())
      .TwentyFourBitAddressInHex(use.getHexAddress())
      .principalAirport(use.getPrincipalAirport())
      .secondaryAirport(use.getSecondaryAirport())
      .radioSystem(String.join(", ", use.getCommunicationTypes()))
      .notes(use.getMoreDetails())
      .build();
  }

  BeaconExportLandUseDTO toLandUse(BeaconUse use) {
    return BeaconExportLandUseDTO
      .builder()
      .environment(use.getEnvironment().toString())
      .descriptionOfIntendedUse(use.getActivity().toString()) //Unsure
      .numberOfPersonsOnBoard(
        use.getMaxCapacity() == null ? 0 : use.getMaxCapacity()
      )
      .areaOfUse(use.getAreaOfOperation())
      .radioSystem(String.join(", ", use.getCommunicationTypes()))
      .notes(use.getMoreDetails())
      .build();
  }

  public BeaconExportDTO toLegacyBeaconExportDTO(LegacyBeacon beacon) {
    LegacyBeaconDetails details = beacon.getData().getBeacon();

    return BeaconExportDTO
      .builder()
      .type("Legacy")
      .proofOfRegistrationDate(beacon.getLastModifiedDate())
      .lastModifiedDate(beacon.getLastModifiedDate())
      .departmentReference(details.getDepartRefId())
      .recordCreatedDate(details.getFirstRegistrationDate())
      .beaconStatus(beacon.getBeaconStatus())
      .hexId(beacon.getHexId())
      .manufacturer(details.getManufacturer())
      .serialNumber(details.getSerialNumber())
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
        getMultipleValuesAsString(
          "   ",
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
        getMultipleValuesAsString(
          "   ",
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
            getMultipleValuesAsString(
              "   ",
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
      .companyAgent(owner.getCompanyName()) // Unsure on this.
      .careOf(owner.getCareOf())
      .address(address)
      .telephoneNumbers(
        getMultipleValuesAsString("   ", owner.getPhone1(), owner.getPhone2())
      )
      .mobiles(
        getMultipleValuesAsString("   ", owner.getMobile1(), owner.getMobile2())
      )
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
      .vesselName(use.getVesselName())
      .homePort(use.getHomePort())
      .vessel(use.getVesselType())
      .maxPersonOnBoard(use.getMaxPersons() != null ? use.getMaxPersons() : 0)
      .vesselCallsign(use.getCallSign())
      .mmsiNumber(use.getMmsiNumber().toString())
      .radioSystem(use.getCommunications())
      .notes(use.getNotes())
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
      .aircraftType(use.getAircraftType())
      .maxPersonOnBoard(use.getMaxPersons() != null ? use.getMaxPersons() : 0)
      .aircraftRegistrationMark(use.getAircraftRegistrationMark())
      .TwentyFourBitAddressInHex(use.getBit24AddressHex())
      .principalAirport(use.getPrincipalAirport())
      .radioSystem(use.getCommunications())
      .notes(use.getNotes())
      .build();
  }

  private BeaconExportLandUseDTO toLandUse(LegacyUse use) {
    return BeaconExportLandUseDTO
      .builder()
      .environment(use.getEnvironment())
      .descriptionOfIntendedUse(use.getUseType())
      .numberOfPersonsOnBoard(
        use.getMaxPersons() != null ? use.getMaxPersons() : 0
      )
      .areaOfUse(use.getAreaOfUse())
      .tripInformation(use.getTripInfo())
      .radioSystem(use.getCommunications())
      .notes(use.getNotes())
      .build();
  }

  private BeaconExportGenericUseDTO toLegacyUse(LegacyUse use) {
    return BeaconExportGenericUseDTO
      .builder()
      .environment(use.getEnvironment())
      .vesselName(use.getVesselName())
      .homePort(use.getHomePort())
      .vessel(use.getVesselType())
      .maxPersonOnBoard(use.getMaxPersons() != null ? use.getMaxPersons() : 0)
      .vesselCallsign(use.getCallSign())
      .mmsiNumber(use.getMmsiNumber().toString())
      .radioSystem(use.getCommunications())
      .notes(use.getNotes())
      .fishingVesselPortIdAndNumbers(use.getFishingVesselPln())
      .officialNumber(use.getOfficialNumber())
      .imoNumber(use.getImoNumber())
      .rssAndSsrNumber(use.getRssSsrNumber())
      .hullIdNumber(use.getHullIdNumber())
      .coastguardCGRefNumber(use.getCg66RefNumber())
      .aircraftType(use.getAircraftType())
      .aircraftRegistrationMark(use.getAircraftRegistrationMark())
      .TwentyFourBitAddressInHex(use.getBit24AddressHex())
      .principalAirport(use.getPrincipalAirport())
      .notes(use.getNotes())
      .descriptionOfIntendedUse(use.getUseType()) //Unsure
      .numberOfPersonsOnBoard(
        use.getMaxPersons() != null ? use.getMaxPersons() : 0
      )
      .areaOfUse(use.getAreaOfUse())
      .tripInformation(use.getTripInfo())
      .notes(use.getNotes())
      .build();
  }
}
