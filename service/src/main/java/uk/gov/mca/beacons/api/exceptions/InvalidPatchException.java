package uk.gov.mca.beacons.api.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(
  value = HttpStatus.CONFLICT,
  reason = "resource identifier does not match model identifier"
)
public class InvalidPatchException extends RuntimeException {}
