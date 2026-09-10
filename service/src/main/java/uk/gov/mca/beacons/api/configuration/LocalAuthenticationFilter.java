package uk.gov.mca.beacons.api.configuration;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

/**
 * Authenticates every request as the configured local user, so the {@code @PreAuthorize}
 * annotations guarding Backoffice operations behave as they do in a deployed environment.
 */
public class LocalAuthenticationFilter extends OncePerRequestFilter {

  private final LocalAuthConfiguration config;

  public LocalAuthenticationFilter(LocalAuthConfiguration config) {
    this.config = config;
  }

  @Override
  protected void doFilterInternal(
    HttpServletRequest request,
    HttpServletResponse response,
    FilterChain filterChain
  ) throws ServletException, IOException {
    if (SecurityContextHolder.getContext().getAuthentication() == null) {
      SecurityContextHolder.getContext()
        .setAuthentication(
          new UsernamePasswordAuthenticationToken(
            config.getEmail(),
            null,
            authorities()
          )
        );
    }

    filterChain.doFilter(request, response);
  }

  private List<GrantedAuthority> authorities() {
    return config
      .getRoles()
      .stream()
      .map(role -> new SimpleGrantedAuthority("APPROLE_" + role))
      .collect(Collectors.toList());
  }
}
