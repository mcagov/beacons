package uk.gov.mca.beacons.api.beacon.rest;

import java.time.LocalDate;
import java.util.UUID;
import javax.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CreateBeaconDTO {

  @NotNull
  private String hexId;

  @NotNull
  private String manufacturer;

  @NotNull
  private String model;

  @NotNull
  private String manufacturerSerialNumber;

  private String referenceNumber;

  private String chkCode;

  private LocalDate batteryExpiryDate;

  private LocalDate lastServicedDate;

  private String mti;

  private Boolean svdr;

  private String csta;

  private String beaconType;

  private String protocol;

  private String coding;

  private UUID accountHolderId;
}
