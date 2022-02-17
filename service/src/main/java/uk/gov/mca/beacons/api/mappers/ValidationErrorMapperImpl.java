package uk.gov.mca.beacons.api.mappers;

import static uk.gov.mca.beacons.api.dto.ErrorResponseDTO.ValidationError;

import org.springframework.stereotype.Service;
import org.springframework.validation.Errors;
import org.springframework.validation.FieldError;
import uk.gov.mca.beacons.api.dto.ErrorResponseDTO;

@Service
public class ValidationErrorMapperImpl implements ValidationErrorMapper {

  @Override
  public ErrorResponseDTO fromBindingErrors(Errors errors) {
    final var errorResponse = new ErrorResponseDTO();

    for (FieldError fieldError : errors.getFieldErrors()) {
      final var validationError = ValidationError
        .builder()
        .field(fieldError.getField())
        .description(fieldError.getDefaultMessage())
        .build();
      errorResponse.addValidationError(validationError);
    }

    return errorResponse;
  }
}
