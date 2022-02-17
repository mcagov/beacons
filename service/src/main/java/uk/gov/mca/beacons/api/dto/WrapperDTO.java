package uk.gov.mca.beacons.api.dto;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.validation.Valid;

public class WrapperDTO<T> {

  private final Map<String, Object> meta = new HashMap<>();

  @Valid
  private T data;

  private final List<DomainDTO<?>> included = new ArrayList<>();

  public Map<String, Object> getMeta() {
    return meta;
  }

  public void addMeta(String key, Object value) {
    meta.put(key, value);
  }

  public T getData() {
    return data;
  }

  public void setData(T dataDTO) {
    this.data = dataDTO;
  }

  public List<DomainDTO<?>> getIncluded() {
    return included;
  }

  public void addIncluded(DomainDTO<?> includedDTO) {
    included.add(includedDTO);
  }
}
