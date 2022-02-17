package uk.gov.mca.beacons.api.hateoas;

import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class HateoasLinkManager<T> {

  public enum SupportedMethod {
    GET,
    PATCH,
  }

  public List<HateoasLink> getLinksFor(
    T domain,
    IHateoasLinkStrategy<T> linkStrategy
  ) {
    final List<HateoasLink> links = new ArrayList<HateoasLink>();

    if (linkStrategy.userCanGetEntity(domain)) addGetLink(
      domain,
      linkStrategy,
      links
    );

    if (linkStrategy.userCanPatchEntity(domain)) addPatchLink(
      domain,
      linkStrategy,
      links
    );

    return links;
  }

  private void addGetLink(
    T domain,
    IHateoasLinkStrategy<T> linkStrategy,
    List<HateoasLink> links
  ) {
    var link = new HateoasLink(
      SupportedMethod.GET.toString(),
      linkStrategy.getGetPath(domain)
    );
    links.add(link);
  }

  private void addPatchLink(
    T domain,
    IHateoasLinkStrategy<T> linkStrategy,
    List<HateoasLink> links
  ) {
    var link = new HateoasLink(
      SupportedMethod.PATCH.toString(),
      linkStrategy.getPatchPath(domain)
    );
    links.add(link);
  }
}
