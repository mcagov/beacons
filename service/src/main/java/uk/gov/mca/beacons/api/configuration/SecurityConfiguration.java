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
   * Secure the operational API endpoints behind a confidential client grant flow with Azure AD (AAD)
   */
  @Order(1)
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
