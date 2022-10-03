package uk.gov.mca.beacons.api.export.mappers;

import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import org.bouncycastle.jcajce.provider.asymmetric.ec.KeyFactorySpi;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import uk.gov.mca.beacons.api.beacon.domain.Beacon;
import uk.gov.mca.beacons.api.beacon.mappers.BeaconMapper;
import uk.gov.mca.beacons.api.beaconowner.mappers.BeaconOwnerMapper;
import uk.gov.mca.beacons.api.beaconuse.domain.BeaconUse;
import uk.gov.mca.beacons.api.beaconuse.mappers.BeaconUseMapper;
import uk.gov.mca.beacons.api.emergencycontact.mappers.EmergencyContactMapper;
import uk.gov.mca.beacons.api.emergencycontact.rest.EmergencyContactDTO;
import uk.gov.mca.beacons.api.export.rest.*;
import uk.gov.mca.beacons.api.legacybeacon.domain.*;
import uk.gov.mca.beacons.api.note.domain.Note;
import uk.gov.mca.beacons.api.note.mappers.NoteMapper;
import uk.gov.mca.beacons.api.registration.domain.Registration;
import uk.gov.mca.beacons.api.shared.rest.person.dto.AddressDTO;

@Component("CertificateMapper")
public class ExportMapper {

  private final DateTimeFormatter dtf = DateTimeFormatter.ofPattern(
    "dd/MM/yyyy"
  );

  private final BeaconMapper beaconMapper;
  private final BeaconUseMapper beaconUseMapper;
  private final BeaconOwnerMapper beaconOwnerMapper;
  private final EmergencyContactMapper emergencyContactMapper;
  private final NoteMapper noteMapper;

  @Autowired
  public ExportMapper(
    BeaconMapper beaconMapper,
    BeaconUseMapper beaconUseMapper,
    BeaconOwnerMapper beaconOwnerMapper,
    EmergencyContactMapper emergencyContactMapper,
    NoteMapper noteMapper
  ) {
    this.beaconMapper = beaconMapper;
    this.beaconUseMapper = beaconUseMapper;
    this.beaconOwnerMapper = beaconOwnerMapper;
    this.emergencyContactMapper = emergencyContactMapper;
    this.noteMapper = noteMapper;
  }

  public LabelDTO toLabelDTO(Registration registration) {
    Beacon beacon = registration.getBeacon();
    BeaconUse mainUse = registration.getMainUse();

    return LabelDTO
      .builder()
      .mcaContactNumber("+44 (0)1326 317575")
      .beaconUse(mainUse.getName())
      .hexId(beacon.getHexId())
      .coding(beacon.getCoding())
      .proofOfRegistrationDate(beacon.getLastModifiedDate().format(dtf))
      .build();
  }

  public LabelDTO toLegacyLabelDTO(LegacyBeacon beacon) { //TODO - For Legacy Labels.
    LegacyUse mainUse = beacon.getData().getUses().get(0);

    return LabelDTO.builder().mcaContactNumber("+44 (0)1326 317575").build();
  }

  public CertificateDTO toCertificateDTO(
    Registration registration,
    List<Note> nonSystemNotes
  ) {
    Beacon beacon = new Beacon();

    return CertificateDTO.builder().build();
  }

  public CertificateDTO toLegacyCertificateDTO(LegacyBeacon beacon) {
    LegacyBeaconDetails details = beacon.getData().getBeacon();

    return CertificateDTO
      .builder()
      .proofOfRegistrationDate(beacon.getLastModifiedDate())
      .departmentReference(details.getDepartRefId())
      .recordCreatedDate(beacon.getCreatedDate())
      .beaconStatus(beacon.getBeaconStatus())
      .hexId(beacon.getHexId())
      .manufacturer(details.getManufacturer())
      .serialNumber(details.getSerialNumber())
      .manufacturerSerialNumber(details.getManufacturerSerialNumber())
      .beaconModel(details.getModel())
      .beaconlastServiced(dateFromString(details.getLastServiceDate()))
      .beaconCoding(details.getCoding())
      .batteryExpiryDate(dateFromString(details.getBatteryExpiryDate()))
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

  private OffsetDateTime dateFromString(String dateString) {
    try {
      return OffsetDateTime.parse(dateString);
    } catch (Exception e) {
      return null;
    }
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

  private CertificateOwnerDTO toLegacyOwnerDTO(LegacyGenericOwner owner) {
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
        String.join(" / ", Arrays.asList(owner.getPhone1(), owner.getPhone2()))
      )
      .mobiles(
        String.join(
          " / ",
          Arrays.asList(owner.getMobile1(), owner.getMobile2())
        )
      )
      .email(owner.getEmail())
      .build();
  }

  private List<CertificateUseDTO> toLegacyUsesDTO(List<LegacyUse> uses) {
    List<CertificateUseDTO> usesDTO = new ArrayList<>();
    for (LegacyUse use : uses) {
      switch (use.getEnvironment()) {
        case "Maritime":
          usesDTO.add(toLegacyMaritimeUse(use));
          break;
        case "Aviation":
          usesDTO.add(toLegacyAviationUse(use));
          break;
        case "Land":
          usesDTO.add(toLegacyLandUse(use));
          break;
      }
    }
    return usesDTO;
  }

  private CertificateMaritimeUseDTO toLegacyMaritimeUse(LegacyUse use) {
    return CertificateMaritimeUseDTO
      .builder()
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

  private CertificateAviationUseDTO toLegacyAviationUse(LegacyUse use) {
    return CertificateAviationUseDTO
      .builder()
      .aircraftType(use.getAircraftType())
      .maxPersonOnBoard(use.getMaxPersons())
      .aircraftRegistrationMark(use.getAircraftRegistrationMark())
      .TwentyFourBitAddressInHex(use.getBit24AddressHex())
      .principalAirport(use.getPrincipalAirport())
      .radioSystem(use.getCommunications()) // Unsure on this.
      .notes(use.getNotes())
      .build();
  }

  private CertificateLandUseDTO toLegacyLandUse(LegacyUse use) {
    return CertificateLandUseDTO
      .builder()
      .descriptionOfIntendedUse(use.getUseType()) //Unsure
      .numberOfPersonsOnBoard(use.getMaxPersons())
      .areaOfUse(use.getAreaOfUse())
      .tripInformation(use.getTripInfo())
      .radioSystem(use.getCommunications()) // Unsure on this.
      .notes(use.getNotes())
      .build();
  }
}
