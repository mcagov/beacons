package uk.gov.mca.beacons.api.configuration;

import com.azure.spring.aad.webapi.AADResourceServerWebSecurityConfigurerAdapter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class SecurityConfiguration {

  /**
   * Secure the migration endpoints behind HTTP Basic Auth.
   */
  @Order(1)
  @Configuration
  @Profile("migration | dev")
  public static class BasicAuthConfiguration
    extends WebSecurityConfigurerAdapter {

    @Value("${beacons.security.basic.user.name}")
    private String username;

    @Value("${beacons.security.basic.user.password}")
    private String password;

    /**
     * Creates a HTTP basic auth security filter for the migration and job endpoints.
     * <p>
     * NOTE: The HTTP session has to be stateless for the basic auth security filter.
     * Otherwise Spring allows access to Azure authenticated endpoints if a user
     * has a session through authenticating via basic auth.
     */
    @Override
    protected void configure(HttpSecurity http) throws Exception {
      http
        .cors()
        .and()
        .requestMatchers()
        .antMatchers("/spring-api/migrate/**", "/spring-api/job/**")
        .and()
        .csrf()
        .disable()
        .authorizeRequests()
        .anyRequest()
        .authenticated()
        .and()
        .httpBasic()
        .and()
        .sessionManagement()
        .sessionCreationPolicy(SessionCreationPolicy.STATELESS);
    }

    @Override
    protected void configure(AuthenticationManagerBuilder auth)
      throws Exception {
      auth
        .inMemoryAuthentication()
        .withUser(username)
        .password("{noop}" + password)
        .roles("migration");
    }
  }

  /**
   * Secure the operational API endpoints behind a confidential client grant flow with Azure AD (AAD)
   */
  @Order(2)
  @Configuration
  @Profile("default | dev")
  public static class AzureAdSecurityConfiguration
    extends AADResourceServerWebSecurityConfigurerAdapter {

    @Override
    protected void configure(HttpSecurity http) throws Exception {
      super.configure(http);
      http.cors().and().authorizeRequests().antMatchers("/**").authenticated();
    }

    @Override
    public void configure(WebSecurity web) {
      web
        .ignoring()
        .antMatchers(
          "/spring-api/actuator/health",
          "/spring-api/actuator/info",
          "/swagger-ui.html",
          "/swagger-ui/**",
          "/v3/api-docs/**",
          /*
           * Permit global access to Backoffice SPA static assets because the user is required to sign in with Azure AD
           * prior to accessing protected data in any case.  There is no security benefit from securing the application
           * itself.
           *
           * The path to the Backoffice SPA's static assets is configured in build.gradle.
           */
          "/backoffice/**"
        );
    }
  }
}
