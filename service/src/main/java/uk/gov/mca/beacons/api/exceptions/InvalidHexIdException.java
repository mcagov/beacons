package uk.gov.mca.beacons.api.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(
  value = HttpStatus.BAD_REQUEST,
  reason = "Hex ID must be 15 or 23 hexadecimal characters"
)
public class InvalidHexIdException extends RuntimeException {}
