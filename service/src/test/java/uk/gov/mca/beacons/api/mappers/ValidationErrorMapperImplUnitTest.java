package uk.gov.mca.beacons.api.mappers;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.is;
import static org.mockito.BDDMockito.given;

import java.util.Arrays;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.validation.Errors;
import org.springframework.validation.FieldError;

@ExtendWith(MockitoExtension.class)
class ValidationErrorMapperImplUnitTest {

  @Mock
  private Errors errors;

  @Test
  void shouldBuildTheErrorResponseDTO() {
    given(errors.getFieldErrors())
      .willReturn(
        Arrays.asList(
          new FieldError(
            "BeaconDTO",
            "data.attributes.hexId",
            "Hex ID must not be null"
          ),
          new FieldError(
            "BeaconDTO",
            "data.attributes.manufacturer",
            "Manufacturer must not be null"
          )
        )
      );
    final var getValidationErrorResponseService = new ValidationErrorMapperImpl();

    final var result = getValidationErrorResponseService.fromBindingErrors(
      errors
    );

    assertThat(result.getErrors().size(), is(2));
    final var hexIdError = result.getErrors().get(0);
    assertThat(hexIdError.getField(), is("data.attributes.hexId"));
    assertThat(hexIdError.getDescription(), is("Hex ID must not be null"));
    final var manufacturerError = result.getErrors().get(1);
    assertThat(
      manufacturerError.getField(),
      is("data.attributes.manufacturer")
    );
    assertThat(
      manufacturerError.getDescription(),
      is("Manufacturer must not be null")
    );
  }
}
