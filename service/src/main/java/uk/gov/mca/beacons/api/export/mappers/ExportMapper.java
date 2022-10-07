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

@Slf4j
@Component("CertificateMapper")
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
    String lastModifiedDate = beacon.getLastModifiedDate() == null
      ? "01/01/1900"
      : beacon.getLastModifiedDate().format(dtf);

    return LabelDTO
      .builder()
      .mcaContactNumber("+44 (0)1326 317575")
      .beaconUse(mainUse.getName())
      .hexId(beacon.getHexId())
      .coding(beacon.getCoding())
      .proofOfRegistrationDate(lastModifiedDate)
      .build();
  }

  public LabelDTO toLegacyLabelDTO(LegacyBeacon beacon) { //TODO - For Legacy Labels.
    LegacyUse mainUse = beacon.getData().getUses().get(0); //Main use is first use?

    return LabelDTO
      .builder()
      .mcaContactNumber("+44 (0)1326 317575")
      .beaconUse(mainUse.getName())
      .hexId(beacon.getHexId())
      .coding(beacon.getData().getBeacon().getCoding())
      .proofOfRegistrationDate(beacon.getLastModifiedDate().format(dtf))
      .build();
  }

  public CertificateDTO toCertificateDTO(
    Registration registration,
    List<Note> nonSystemNotes
  ) {
    Beacon beacon = registration.getBeacon();

    return CertificateDTO
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
            new CertificateNoteDTO(
              n.getCreatedDate().toLocalDateTime(),
              n.getText()
            )
          )
          .collect(Collectors.toList())
      )
      .uses(toUsesDTO(registration.getBeaconUses()))
      .owners(toOwnersDTO(registration.getBeaconOwner()))
      .emergencyContacts(
        toEmergencyContactsDTO(registration.getEmergencyContacts())
      )
      .build();
  }

  List<CertificateUseDTO> toUsesDTO(List<BeaconUse> uses) {
    List<CertificateUseDTO> usesDTO = new ArrayList<>();
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

  private CertificateMaritimeUseDTO toMaritimeUse(BeaconUse use) {
    return CertificateMaritimeUseDTO
      .builder()
      .environment(use.getEnvironment().toString())
      .vesselName(use.getVesselName())
      .homePort(use.getHomeport())
      .vessel(use.getVesselName())
      .maxPersonOnBoard(use.getMaxCapacity())
      .vesselCallsign(use.getCallSign())
      .mmsiNumber(String.join(" / ", use.getMmsiNumbers()))
      .radioSystem(use.getOtherCommunicationValue()) // Unsure on this.
      .fishingVesselPortIdAndNumbers(use.getPortLetterNumber())
      .officialNumber(use.getOfficialNumber())
      .imoNumber(use.getImoNumber())
      .rssAndSsrNumber(
        getMultipleValuesAsString(" / ", use.getRssNumber(), use.getSsrNumber())
      )
      .hullIdNumber("TODO - where to get this value?")
      .coastguardCGRefNumber("TODO - where to get this value?")
      .build();
  }

  private CertificateAviationUseDTO toAviationUse(BeaconUse use) {
    return CertificateAviationUseDTO
      .builder()
      .environment(use.getEnvironment().toString())
      .aircraftType(use.getAircraftManufacturer()) // Unsure on this.
      .maxPersonOnBoard(use.getMaxCapacity() != null ? use.getMaxCapacity() : 0)
      .aircraftRegistrationMark(use.getRegistrationMark())
      .TwentyFourBitAddressInHex(use.getHexAddress())
      .principalAirport(use.getPrincipalAirport())
      .radioSystem(use.getOtherCommunicationValue()) // Unsure on this.
      .build();
  }

  CertificateLandUseDTO toLandUse(BeaconUse use) {
    return CertificateLandUseDTO
      .builder()
      .environment(use.getEnvironment().toString())
      .descriptionOfIntendedUse(use.getActivity().toString()) //Unsure
      .numberOfPersonsOnBoard(
        use.getMaxCapacity() == null ? 0 : use.getMaxCapacity()
      )
      .areaOfUse(use.getAreaOfOperation())
      .tripInformation("TODO - where to get this value?")
      .radioSystem(use.getOtherCommunicationValue()) // Unsure on this.
      .build();
  }

  public CertificateDTO toLegacyCertificateDTO(LegacyBeacon beacon) {
    LegacyBeaconDetails details = beacon.getData().getBeacon();

    return CertificateDTO
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

  private List<CertificateOwnerDTO> toOwnersDTO(BeaconOwner owner) {
    AddressDTO address = addressMapper.toDTO(owner.getAddress());

    return Arrays.asList(
      CertificateOwnerDTO
        .builder()
        .ownerName(owner.getFullName())
        .address(address)
        .telephoneNumbers(
          getMultipleValuesAsString(
            " / ",
            owner.getTelephoneNumber(),
            owner.getAlternativeTelephoneNumber()
          )
        )
        .email(owner.getEmail())
        .build()
    );
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
              " / ",
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

  private List<CertificateOwnerDTO> toLegacyOwnersDTO(LegacyData data) {
    List<CertificateOwnerDTO> ownersDTO = new ArrayList<>();

    ownersDTO.add(toLegacyOwnerDTO(data.getOwner()));
    for (LegacyGenericOwner o : data.getSecondaryOwners()) {
      ownersDTO.add(toLegacyOwnerDTO(o));
    }

    return ownersDTO;
  }

  CertificateOwnerDTO toLegacyOwnerDTO(LegacyGenericOwner owner) {
    AddressDTO address = AddressDTO
      .builder()
      .addressLine1(owner.getAddress1())
      .addressLine2(owner.getAddress2())
      .addressLine3(owner.getAddress3())
      .addressLine4(owner.getAddress4())
      .postcode(owner.getPostCode())
      .country(owner.getCountry())
      .build();

    return CertificateOwnerDTO
      .builder()
      .ownerName(owner.getOwnerName())
      .companyAgent(owner.getCompanyName()) // Unsure on this.
      .careOf(owner.getCareOf())
      .address(address)
      .telephoneNumbers(
        getMultipleValuesAsString(" / ", owner.getPhone1(), owner.getPhone2())
      )
      .mobiles(
        getMultipleValuesAsString(" / ", owner.getMobile1(), owner.getMobile2())
      )
      .email(owner.getEmail())
      .build();
  }

  List<CertificateUseDTO> toLegacyUsesDTO(List<LegacyUse> uses) {
    List<CertificateUseDTO> usesDTO = new ArrayList<>();
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

  private CertificateMaritimeUseDTO toMaritimeUse(LegacyUse use) {
    return CertificateMaritimeUseDTO
      .builder()
      .environment(use.getEnvironment())
      .vesselName(use.getVesselName())
      .homePort(use.getHomePort())
      .vessel(use.getVesselType())
      .maxPersonOnBoard(use.getMaxPersons())
      .vesselCallsign(use.getCallSign())
      .mmsiNumber(use.getMmsiNumber().toString())
      .radioSystem(use.getCommunications()) // Unsure on this.
      .notes(use.getNotes())
      .fishingVesselPortIdAndNumbers(use.getFishingVesselPln())
      .officialNumber(use.getOfficialNumber())
      .imoNumber(use.getImoNumber())
      .rssAndSsrNumber(use.getRssSsrNumber())
      .hullIdNumber(use.getHullIdNumber())
      .coastguardCGRefNumber(use.getCg66RefNumber())
      .build();
  }

  private CertificateAviationUseDTO toAviationUse(LegacyUse use) {
    return CertificateAviationUseDTO
      .builder()
      .environment(use.getEnvironment())
      .aircraftType(use.getAircraftType())
      .maxPersonOnBoard(use.getMaxPersons())
      .aircraftRegistrationMark(use.getAircraftRegistrationMark())
      .TwentyFourBitAddressInHex(use.getBit24AddressHex())
      .principalAirport(use.getPrincipalAirport())
      .radioSystem(use.getCommunications()) // Unsure on this.
      .notes(use.getNotes())
      .build();
  }

  private CertificateLandUseDTO toLandUse(LegacyUse use) {
    return CertificateLandUseDTO
      .builder()
      .environment(use.getEnvironment())
      .descriptionOfIntendedUse(use.getUseType()) //Unsure
      .numberOfPersonsOnBoard(use.getMaxPersons())
      .areaOfUse(use.getAreaOfUse())
      .tripInformation(use.getTripInfo())
      .radioSystem(use.getCommunications()) // Unsure on this.
      .notes(use.getNotes())
      .build();
  }

  private CertificateGenericUseDTO toLegacyUse(LegacyUse use) {
    return CertificateGenericUseDTO
      .builder()
      .environment(use.getEnvironment())
      .vesselName(use.getVesselName())
      .homePort(use.getHomePort())
      .vessel(use.getVesselType())
      .maxPersonOnBoard(use.getMaxPersons())
      .vesselCallsign(use.getCallSign())
      .mmsiNumber(use.getMmsiNumber().toString())
      .radioSystem(use.getCommunications()) // Unsure on this.
      .notes(use.getNotes())
      .fishingVesselPortIdAndNumbers(use.getFishingVesselPln())
      .officialNumber(use.getOfficialNumber())
      .imoNumber(use.getImoNumber())
      .rssAndSsrNumber(use.getRssSsrNumber())
      .hullIdNumber(use.getHullIdNumber())
      .coastguardCGRefNumber(use.getCg66RefNumber())
      .aircraftType(use.getAircraftType())
      .maxPersonOnBoard(use.getMaxPersons())
      .aircraftRegistrationMark(use.getAircraftRegistrationMark())
      .TwentyFourBitAddressInHex(use.getBit24AddressHex())
      .principalAirport(use.getPrincipalAirport())
      .radioSystem(use.getCommunications()) // Unsure on this.
      .notes(use.getNotes())
      .descriptionOfIntendedUse(use.getUseType()) //Unsure
      .numberOfPersonsOnBoard(use.getMaxPersons())
      .areaOfUse(use.getAreaOfUse())
      .tripInformation(use.getTripInfo())
      .radioSystem(use.getCommunications()) // Unsure on this.
      .notes(use.getNotes())
      .build();
  }
}
