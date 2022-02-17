package uk.gov.mca.beacons.api.hateoas;

public interface IHateoasLinkStrategy<T> {
  boolean userCanGetEntity(T domain);

  String getGetPath(T domain);

  boolean userCanPatchEntity(T domain);

  String getPatchPath(T domain);
}
