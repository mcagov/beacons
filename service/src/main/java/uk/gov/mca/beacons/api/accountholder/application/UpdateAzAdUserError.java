package uk.gov.mca.beacons.api.accountholder.application;

import com.microsoft.graph.core.ClientException;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;

public class UpdateAzAdUserError extends ClientException {

  /**
   * Creates the client exception
   *
   * @param message the message to display
   * @param ex      the exception from
   */
  public UpdateAzAdUserError(@NotNull String message, @Nullable Throwable ex) {
    super(message, ex);
  }
}
