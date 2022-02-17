package uk.gov.mca.beacons.api.beaconuse.domain;

import java.time.OffsetDateTime;
import javax.persistence.*;
import javax.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Type;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import uk.gov.mca.beacons.api.beacon.domain.BeaconId;
import uk.gov.mca.beacons.api.shared.domain.base.BaseAggregateRoot;

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

  @Setter
  private String callSign;

  @Setter
  private Boolean vhfRadio;

  @Setter
  private Boolean fixedVhfRadio;

  @Setter
  private String fixedVhfRadioValue;

  @Setter
  private Boolean portableVhfRadio;

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

  @Setter
  private Integer maxCapacity;

  @Setter
  private String vesselName;

  @Setter
  private String portLetterNumber;

  @Setter
  private String homeport;

  @Setter
  private String areaOfOperation;

  @Setter
  private String beaconLocation;

  @Setter
  private String imoNumber;

  @Setter
  private String ssrNumber;

  @Setter
  private String rssNumber;

  @Setter
  private String officialNumber;

  @Setter
  private String rigPlatformLocation;

  @Setter
  @NotNull
  private Boolean mainUse;

  @Setter
  private String aircraftManufacturer;

  @Setter
  private String principalAirport;

  @Setter
  private String secondaryAirport;

  @Setter
  private String registrationMark;

  @Setter
  private String hexAddress;

  @Setter
  private String cnOrMsnNumber;

  @Setter
  private Boolean dongle;

  @Setter
  private String beaconPosition;

  @Setter
  private String workingRemotelyLocation;

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

  @Setter
  @NotNull
  private String moreDetails;

  @CreatedDate
  private OffsetDateTime createdDate;

  @Type(type = "uk.gov.mca.beacons.api.beacon.domain.BeaconId")
  @Setter
  @NotNull
  private BeaconId beaconId;
}
