package uk.gov.mca.beacons.api.hateoas;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.core.Is.is;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;
import static org.mockito.Mockito.times;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
import org.springframework.web.util.UriComponentsBuilder;

@ExtendWith(MockitoExtension.class)
public class HateoasLinkPathBuilderTest {

  final String path = "/my-path/to/a-controller";
  UriComponentsBuilder componentsBuilder;

  @Mock
  WebMvcLinkBuilder linkBuilder;

  @BeforeEach
  void beforeEach() {
    componentsBuilder = UriComponentsBuilder.fromPath(path);
    given(linkBuilder.toUriComponentsBuilder()).willReturn(componentsBuilder);
  }

  @Test
  void buildGetForBeaconShouldReturnExpectedLink() {
    var result = HateoasLinkPathBuilder.build(linkBuilder);

    then(linkBuilder).should(times(1)).toUriComponentsBuilder();
    assertThat(result, is(path));
  }
}
