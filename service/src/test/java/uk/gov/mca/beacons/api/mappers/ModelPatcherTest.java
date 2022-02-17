package uk.gov.mca.beacons.api.mappers;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.core.IsNull.nullValue;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import lombok.Getter;
import lombok.Setter;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class ModelPatcherTest {

  private ModelPatcher<FakeModel> patcher;

  @BeforeEach
  public void before() {
    patcher =
      new ModelPatcherFactory<FakeModel>()
        .getModelPatcher()
        .withMapping(FakeModel::getFirstDate, FakeModel::setFirstDate)
        .withMapping(FakeModel::getSecondDate, FakeModel::setSecondDate)
        .withMapping(FakeModel::getThirdDate, FakeModel::setThirdDate)
        .withMapping(FakeModel::getFirstString, FakeModel::setFirstString)
        .withMapping(FakeModel::getSecondString, FakeModel::setSecondString)
        .withMapping(FakeModel::getThirdString, FakeModel::setThirdString)
        .withMapping(FakeModel::getFirstInt, FakeModel::setFirstInt)
        .withMapping(FakeModel::getSecondInt, FakeModel::setSecondInt)
        .withMapping(FakeModel::getThirdInt, FakeModel::setThirdInt)
        .withMapping(FakeModel::getFirstBoolean, FakeModel::setFirstBoolean)
        .withMapping(FakeModel::getSecondBoolean, FakeModel::setSecondBoolean)
        .withMapping(FakeModel::getThirdBoolean, FakeModel::setThirdBoolean);
  }

  @Test
  void shouldMapUpdatedValuesWithoutChangingTheRest() {
    var oldModel = new FakeModel();
    oldModel.setFirstDate(
      OffsetDateTime.of(
        LocalDateTime.of(1983, 3, 13, 13, 13, 0),
        ZoneOffset.ofHours(0)
      )
    );
    oldModel.setSecondString("The A String");
    oldModel.setThirdInt(3);
    oldModel.setFirstBoolean(false);
    var updateModel = new FakeModel();
    updateModel.setFirstDate(
      OffsetDateTime.of(
        LocalDateTime.of(1992, 11, 8, 1, 2, 0),
        ZoneOffset.ofHours(0)
      )
    );
    updateModel.setSecondString("The B String");
    updateModel.setThirdInt(33);
    updateModel.setFirstBoolean(true);

    var result = patcher.patchModel(oldModel, updateModel);
    assertThat(result.firstDate, is(updateModel.firstDate));
    assertThat(result.secondDate, is(nullValue()));
    assertThat(result.thirdDate, is(nullValue()));
    assertThat(result.firstString, is(nullValue()));
    assertThat(result.secondString, is(updateModel.secondString));
    assertThat(result.thirdString, is(nullValue()));
    assertThat(result.firstInt, is(0));
    assertThat(result.secondInt, is(0));
    assertThat(result.thirdInt, is(updateModel.thirdInt));
    assertThat(result.firstBoolean, is(true));
    assertThat(result.secondBoolean, is(nullValue()));
    assertThat(result.thirdBoolean, is(nullValue()));
  }

  @Test
  void shouldMapNewValuesWithoutChangingTheExisting() {
    var oldModel = new FakeModel();
    oldModel.setFirstDate(
      OffsetDateTime.of(
        LocalDateTime.of(1983, 3, 13, 13, 13, 0),
        ZoneOffset.ofHours(0)
      )
    );
    oldModel.setSecondString("The A String");
    oldModel.setThirdInt(3);
    oldModel.setFirstBoolean(false);
    var updateModel = new FakeModel();
    updateModel.setSecondDate(
      OffsetDateTime.of(
        LocalDateTime.of(1992, 11, 8, 1, 2, 0),
        ZoneOffset.ofHours(0)
      )
    );
    updateModel.setThirdString("The B String");
    updateModel.setFirstInt(11);
    updateModel.setSecondBoolean(true);

    var result = patcher.patchModel(oldModel, updateModel);
    assertThat(result.firstDate, is(oldModel.firstDate));
    assertThat(result.secondDate, is(updateModel.secondDate));
    assertThat(result.thirdDate, is(nullValue()));
    assertThat(result.firstString, is(nullValue()));
    assertThat(result.secondString, is(oldModel.secondString));
    assertThat(result.thirdString, is(updateModel.thirdString));
    assertThat(result.firstInt, is(updateModel.firstInt));
    assertThat(result.secondInt, is(0));
    assertThat(result.thirdInt, is(oldModel.thirdInt));
    assertThat(result.firstBoolean, is(false));
    assertThat(result.secondBoolean, is(true));
    assertThat(result.thirdBoolean, is(nullValue()));
  }

  @Getter
  @Setter
  class FakeModel {

    private String firstString;

    private String secondString;
    private String thirdString;
    private OffsetDateTime firstDate;
    private OffsetDateTime secondDate;
    private OffsetDateTime thirdDate;
    private int firstInt;
    private int secondInt;
    private int thirdInt;
    private Boolean firstBoolean;
    private Boolean secondBoolean;
    private Boolean thirdBoolean;
  }
}
