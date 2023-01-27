package uk.gov.mca.beacons.api.search;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

public class OffsetPageRequest implements Pageable {

  private final int offset;
  private final int limit;

  private Sort sort;

  public OffsetPageRequest(int offset, int limit, Sort sort) {
    if (offset < 0) throw new IllegalArgumentException(
      "Offset must not be less than zero!"
    );

    if (limit < 0) throw new IllegalArgumentException(
      "Limit must not be less than zero!"
    );

    this.offset = offset;
    this.limit = limit;

    if (sort != null) {
      this.sort = sort;
    }
  }

  public OffsetPageRequest(int offset, int limit) {
    this(offset, limit, null);
  }

  @Override
  public int getPageNumber() {
    return 0;
  }

  @Override
  public int getPageSize() {
    return limit;
  }

  @Override
  public long getOffset() {
    return offset;
  }

  @Override
  public Sort getSort() {
    return this.sort;
  }

  @Override
  public Pageable next() {
    return null;
  }

  @Override
  public Pageable previousOrFirst() {
    return this;
  }

  @Override
  public Pageable first() {
    return this;
  }

  @Override
  public Pageable withPage(int pageNumber) {
    return null;
  }

  @Override
  public boolean hasPrevious() {
    return false;
  }
}
