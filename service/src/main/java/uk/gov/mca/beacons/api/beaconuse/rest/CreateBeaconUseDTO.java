package uk.gov.mca.beacons.api.beaconuse.rest;

import java.util.UUID;
import javax.validation.constraints.NotNull;
import lombok.*;
import uk.gov.mca.beacons.api.beaconuse.domain.Activity;
import uk.gov.mca.beacons.api.beaconuse.domain.Environment;
import uk.gov.mca.beacons.api.beaconuse.domain.Purpose;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CreateBeaconUseDTO {

  @NotNull
  private Environment environment;

  private Purpose purpose;

  @NotNull
  private Activity activity;

  private String otherActivity;

  private String callSign;

  private Boolean vhfRadio;

  private Boolean fixedVhfRadio;

  private String fixedVhfRadioValue;

  private Boolean portableVhfRadio;

  private String portableVhfRadioValue;

  private Boolean satelliteTelephone;

  private String satelliteTelephoneValue;

  private Boolean mobileTelephone;

  private String mobileTelephone1;

  private String mobileTelephone2;

  private Boolean otherCommunication;

  private String otherCommunicationValue;

  private Integer maxCapacity;

  private String vesselName;

  private String portLetterNumber;

  private String homeport;

  private String areaOfOperation;

  private String beaconLocation;

  private String imoNumber;

  private String ssrNumber;

  private String rssNumber;

  private String officialNumber;

  private String rigPlatformLocation;

  @NotNull
  private Boolean mainUse;

  private String aircraftManufacturer;

  private String principalAirport;

  private String secondaryAirport;

  private String registrationMark;

  private String hexAddress;

  private String cnOrMsnNumber;

  private Boolean dongle;

  private String beaconPosition;

  private String workingRemotelyLocation;

  private String workingRemotelyPeopleCount;

  private String windfarmLocation;

  private String windfarmPeopleCount;

  private String otherActivityLocation;

  private String otherActivityPeopleCount;

  @NotNull
  private String moreDetails;

  /**
   * Not being used as beacon uses are being created as part of a registration, when we
   * move to a more resource focussed API structure, this will be used
   */
  private UUID beaconId;
}
