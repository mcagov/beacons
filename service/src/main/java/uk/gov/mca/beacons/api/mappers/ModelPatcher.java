package uk.gov.mca.beacons.api.mappers;

import java.util.ArrayList;
import java.util.List;
import java.util.function.BiConsumer;
import java.util.function.Function;

public class ModelPatcher<T> {

  @SuppressWarnings("rawtypes")
  private final List<ModelUpdateMapping> mapping = new ArrayList<>();

  public <TValue> ModelPatcher<T> withMapping(
    Function<T, TValue> getter,
    BiConsumer<T, TValue> setter
  ) {
    mapping.add(new ModelUpdateMapping<>(getter, setter));
    return this;
  }

  public <TValue> T patchModel(T model, T update) {
    this.mapping.forEach(
        mapping -> {
          @SuppressWarnings("unchecked")
          final Function<T, TValue> getter = mapping.getter;
          @SuppressWarnings("unchecked")
          final BiConsumer<T, TValue> setter = mapping.setter;

          TValue updateValue = getter.apply(update);
          if (updateValue != null) {
            setter.accept(model, updateValue);
          }
        }
      );

    return model;
  }

  class ModelUpdateMapping<TValue> {

    public final Function<T, TValue> getter;
    public final BiConsumer<T, TValue> setter;

    public ModelUpdateMapping(
      Function<T, TValue> getter,
      BiConsumer<T, TValue> setter
    ) {
      this.getter = getter;
      this.setter = setter;
    }
  }
}
