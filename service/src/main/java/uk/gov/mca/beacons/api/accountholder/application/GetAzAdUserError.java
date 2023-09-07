package uk.gov.mca.beacons.api.accountholder.application;

import com.microsoft.graph.core.ClientException;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;

public class GetAzAdUserError extends ClientException {

  /**
   * Creates the client exception
   *
   * @param message the message to display
   * @param ex      the exception from
   */
  public GetAzAdUserError(@NotNull String message, @Nullable Throwable ex) {
    super(message, ex);
  }
}
