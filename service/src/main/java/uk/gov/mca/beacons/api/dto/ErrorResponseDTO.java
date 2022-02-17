package uk.gov.mca.beacons.api.dto;

import java.util.ArrayList;
import java.util.List;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;

@Getter
public class ErrorResponseDTO {

  private final List<ValidationError> errors = new ArrayList<>();

  public void addValidationError(ValidationError error) {
    errors.add(error);
  }

  @Data
  @Builder
  public static class ValidationError {

    private String field;
    private String description;
  }
}
