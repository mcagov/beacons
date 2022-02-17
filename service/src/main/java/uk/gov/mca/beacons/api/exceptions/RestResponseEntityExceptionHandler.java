package uk.gov.mca.beacons.api.exceptions;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;
import uk.gov.mca.beacons.api.mappers.ValidationErrorMapper;

@ControllerAdvice
public class RestResponseEntityExceptionHandler
  extends ResponseEntityExceptionHandler {

  private final ValidationErrorMapper errorResponseService;

  @Autowired
  public RestResponseEntityExceptionHandler(
    ValidationErrorMapper errorResponseService
  ) {
    this.errorResponseService = errorResponseService;
  }

  @Override
  protected ResponseEntity<Object> handleMethodArgumentNotValid(
    MethodArgumentNotValidException ex,
    HttpHeaders headers,
    HttpStatus status,
    WebRequest request
  ) {
    final var errorResponseDTO = errorResponseService.fromBindingErrors(
      ex.getBindingResult()
    );
    return super.handleExceptionInternal(
      ex,
      errorResponseDTO,
      headers,
      status,
      request
    );
  }
}
