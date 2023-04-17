package uk.gov.mca.beacons.api.beaconuse.domain;

import java.time.OffsetDateTime;
import java.util.*;
import javax.persistence.*;
import javax.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.apache.commons.lang3.BooleanUtils;
import org.apache.commons.lang3.StringUtils;
import org.hibernate.annotations.Type;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import uk.gov.mca.beacons.api.beacon.domain.BeaconId;
import uk.gov.mca.beacons.api.shared.domain.base.BaseAggregateRoot;
import uk.gov.mca.beacons.api.utils.BeaconsStringUtils;

/**
 * TODO: We are knowingly avoiding refactoring tech debt by continuing to use a single BeaconUse class
 * TODO: with an environment enum flag, once Opensearch work is completed this should be replaced with
 * TODO: a BeaconUse abstract class and classes such as MaritimeUse that inherit from BeaconUse
 */
@Getter
@EntityListeners(AuditingEntityListener.class)
@Entity(name = "beacon_use")
@Table(name = "beacon_use")
public class BeaconUse extends BaseAggregateRoot<BeaconUseId> {

  public static final String ID_GENERATOR_NAME = "beaconuse-id-generator";

  @Type(type = "uk.gov.mca.beacons.api.beaconuse.domain.BeaconUseId")
  @Column(nullable = false)
  @Id
  @GeneratedValue(
    strategy = GenerationType.AUTO,
    generator = "beaconuse-id-generator"
  )
  private BeaconUseId id;

  @Setter
  @Enumerated(EnumType.STRING)
  @NotNull
  private Environment environment;

  @Setter
  @Enumerated(EnumType.STRING)
  private Purpose purpose;

  @Setter
  @Enumerated(EnumType.STRING)
  @NotNull
  private Activity activity;

  @Setter
  private String otherActivity;

  /**
   * VHF CallSign - https://en.wikipedia.org/wiki/Maritime_call_sign
   */
  @Setter
  private String callSign;

  /**
   * https://en.wikipedia.org/wiki/Marine_VHF_radio
   */
  @Setter
  private Boolean vhfRadio;

  /**
   * See above
   */
  @Setter
  private Boolean fixedVhfRadio;

  /**
   * Also known as an MMSI number
   */
  @Setter
  private String fixedVhfRadioValue;

  @Setter
  private Boolean portableVhfRadio;

  /**
   * Also known as an MMSI number
   */
  @Setter
  private String portableVhfRadioValue;

  @Setter
  private Boolean satelliteTelephone;

  @Setter
  private String satelliteTelephoneValue;

  @Setter
  private Boolean mobileTelephone;

  @Setter
  @Column(name = "mobile_telephone_1")
  private String mobileTelephone1;

  @Setter
  @Column(name = "mobile_telephone_2")
  private String mobileTelephone2;

  @Setter
  private Boolean otherCommunication;

  @Setter
  private String otherCommunicationValue;

  /**
   * Maximum number of people on the vessel/aircraft
   */
  @Setter
  private Integer maxCapacity;

  @Setter
  private String vesselName;

  /**
   * The letter number of the homeport (fishing vessel) https://en.wikipedia.org/wiki/https://en.wikipedia.org/wiki/Port_letter_and_numberPort_letter_and_number
   */
  @Setter
  private String portLetterNumber;

  /**
   * https://en.wikipedia.org/wiki/Home_port
   */
  @Setter
  private String homeport;

  /**
   * Geographical location that the vessel/aircraft usually operates in. (e.g. "North Sea")
   */
  @Setter
  private String areaOfOperation;

  /**
   * Location that the beacon is located within the vessel.
   * e.g. "Bridge"
   */
  @Setter
  private String beaconLocation;

  /**
   * International Maritime Organisation Number: https://en.wikipedia.org/wiki/IMO_number
   * Uniquely identifies a vessel that has been assigned an IMO number.
   */
  @Setter
  private String imoNumber;

  /**
   * Small Ship Registration Number: https://web.archive.org/web/20220312100939/https://www.ukshipregister.co.uk/
   */
  @Setter
  private String ssrNumber;

  /**
   * Registry of shipping and seamen number: https://web.archive.org/web/20210416112036/https://www.ukshipregister.co.uk/registration/fishing/
   */
  @Setter
  private String rssNumber;

  /**
   * https://en.wikipedia.org/wiki/Official_number
   */
  @Setter
  private String officialNumber;

  /**
   * A description of the location of the oil rig/drilling platform.
   * e.g. Schiehallion Area
   */
  @Setter
  private String rigPlatformLocation;

  @Setter
  @NotNull
  private Boolean mainUse;

  /**
   * Aircraft manufacturer
   * e.g. Boeing.
   */
  @Setter
  private String aircraftManufacturer;

  @Setter
  private String principalAirport;

  @Setter
  private String secondaryAirport;

  /**
   * Registration mark generally found on the tail of an aircraft.
   * e.g."N59LW"
   *
   * Also known as "Aircraft mark", "Tail number" and "Aircraft registration number".
   */
  @Setter
  private String registrationMark;

  /**
   * 24 bit address of an aircraft stored in Hexadecimal: https://en.wikipedia.org/wiki/Aviation_transponder_interrogation_modes#ICAO_24-bit_address
   * e.g. AC82EC
   *
   * Also known as "24-bit address"
   */
  @Setter
  private String hexAddress;

  /**
   * Manufacturer serial number or core number of an aircraft.
   */
  @Setter
  private String cnOrMsnNumber;

  /**
   * Flag noting whether the beacon is a USB dongle in the aircraft
   */
  @Setter
  private Boolean dongle;

  /**
   * Position in the aircraft that the beacon is mounted.
   */
  @Setter
  private String beaconPosition;

  /**
   * Place name or latitude/longitude of where the beacon will be used (Land Use)
   */
  @Setter
  private String workingRemotelyLocation;

  /**
   * Typical number of people working at the `workingRemotelyLocation`.
   */
  @Setter
  private String workingRemotelyPeopleCount;

  @Setter
  private String windfarmLocation;

  @Setter
  private String windfarmPeopleCount;

  @Setter
  private String otherActivityLocation;

  @Setter
  private String otherActivityPeopleCount;

  /**
   * Free text field to capture information that may not have been asked for in the rest of the Beacon registration.
   */
  @Setter
  @NotNull
  private String moreDetails;

  @CreatedDate
  private OffsetDateTime createdDate;

  @Type(type = "uk.gov.mca.beacons.api.beacon.domain.BeaconId")
  @Setter
  @NotNull
  private BeaconId beaconId;

  public List<String> getMmsiNumbers() {
    var mmsiNumbers = new ArrayList<String>();

    if (
      this.getFixedVhfRadioValue() != null &&
      !this.getFixedVhfRadioValue().isBlank()
    ) {
      mmsiNumbers.add(this.getFixedVhfRadioValue());
    }
    if (
      this.getPortableVhfRadioValue() != null &&
      this.getPortableVhfRadioValue().isBlank()
    ) {
      mmsiNumbers.add(this.getPortableVhfRadioValue());
    }

    return mmsiNumbers;
  }

  public String getName() {
    String name = getVesselName();

    if (StringUtils.isBlank(name)) {
      name = getRegistrationMark();
    }

    return Objects.requireNonNullElse(name, "");
  }

  public Map<String, String> getCommunicationTypes() {
    Map<String, String> communicationTypes = new LinkedHashMap<>();

    if (BooleanUtils.isTrue(vhfRadio)) {
      communicationTypes.put("VHF", "");
    }

    if (BooleanUtils.isTrue(fixedVhfRadio)) {
      communicationTypes.put("Fixed VHF/DSC", "");
    }

    if (BooleanUtils.isTrue(portableVhfRadio)) {
      communicationTypes.put("Portable VHF/DSC", getPortableVhfRadioValue());
    }
    if (BooleanUtils.isTrue(satelliteTelephone)) {
      communicationTypes.put(
        "Satellite Telephone",
        getSatelliteTelephoneValue()
      );
    }
    if (BooleanUtils.isTrue(mobileTelephone)) {
      communicationTypes.put(
        "Mobile Telephone(s)",
        BeaconsStringUtils.getMultipleValuesAsString(
          " - ",
          getMobileTelephone1(),
          getMobileTelephone2()
        )
      );
    }
    if (BooleanUtils.isTrue(otherCommunication)) {
      communicationTypes.put("Other", getOtherCommunicationValue());
    }

    return communicationTypes;
  }

  public String getUseType() {
    String activityName = getActivity() == Activity.OTHER
      ? BeaconsStringUtils.valueOrEmpty(otherActivity)
      : BeaconsStringUtils.valueOrEmpty(
        BeaconsStringUtils.enumAsString(activity)
      );

    return purpose != null
      ? String.format("%s (%s)", activityName, purpose.name())
      : activityName;
  }
}
