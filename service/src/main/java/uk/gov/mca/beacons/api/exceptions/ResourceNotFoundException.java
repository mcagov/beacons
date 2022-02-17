package uk.gov.mca.beacons.api.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.NOT_FOUND, reason = "resource was not found")
public class ResourceNotFoundException extends RuntimeException {}
