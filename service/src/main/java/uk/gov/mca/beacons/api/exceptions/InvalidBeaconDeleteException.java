package uk.gov.mca.beacons.api.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(
  value = HttpStatus.BAD_REQUEST,
  reason = "Mismatch of beacon id and request body"
)
public class InvalidBeaconDeleteException extends RuntimeException {}
