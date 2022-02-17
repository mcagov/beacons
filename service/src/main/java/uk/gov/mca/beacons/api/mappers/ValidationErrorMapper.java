package uk.gov.mca.beacons.api.mappers;

import org.springframework.validation.Errors;
import uk.gov.mca.beacons.api.dto.ErrorResponseDTO;

public interface ValidationErrorMapper {
  ErrorResponseDTO fromBindingErrors(Errors errors);
}
