package uk.gov.mca.beacons.api.beacon.rest;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;
import javax.validation.constraints.NotNull;
import lombok.*;
import uk.gov.mca.beacons.api.beacon.domain.BeaconStatus;
import uk.gov.mca.beacons.api.dto.DomainDTO;

public class UpdateBeaconDTO extends DomainDTO<UpdateBeaconDTO.Attributes> {

  private final String type = "beacon";

  @Override
  public String getType() {
    return type;
  }

  @Getter
  @Setter
  @Builder
  @NoArgsConstructor
  @AllArgsConstructor
  public static class Attributes {

    @NotNull
    private UUID id;

    @NotNull
    private String hexId;

    @NotNull
    private String manufacturer;

    @NotNull
    private String model;

    @NotNull
    private String manufacturerSerialNumber;

    @NotNull
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

    private BeaconStatus status;

    private OffsetDateTime createdDate;

    private OffsetDateTime lastModifiedDate;

    @NotNull
    private UUID accountHolderId;
  }
}
