package uk.gov.mca.beacons.api.mappers;

import org.springframework.stereotype.Service;

@Service
public class ModelPatcherFactory<T> {

  public ModelPatcher<T> getModelPatcher() {
    return new ModelPatcher<>();
  }
}
