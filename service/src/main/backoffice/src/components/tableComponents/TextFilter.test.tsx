import React, { forwardRef } from "react";
import { TextFilter, TextFilterProps } from "./TextFilter";
import { render } from "@testing-library/react";
import { Icons } from "@material-table/core";
import { FilterList } from "@material-ui/icons";
import userEvent from "@testing-library/user-event";

const tableIcons: Icons = {
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
};

type RenderTextFilterParams = Pick<
  TextFilterProps<any>,
  "onFilterChanged" | "columnDef"
>;

function renderTextFilter({
  columnDef,
  onFilterChanged,
}: RenderTextFilterParams) {
  return render(
    <TextFilter
      columnDef={columnDef}
      onFilterChanged={onFilterChanged}
      icons={tableIcons}
      filterTooltip=""
    />
  );
}

describe("TextFilter", () => {
  it("Should call onFilterChanged after blur", () => {
    const columnDef = {
      tableData: {
        id: "test id",
        filterValue: "",
      },
      title: "Test",
    };

    const onFilterChanged = jest.fn();

    const { getByTestId } = renderTextFilter({ columnDef, onFilterChanged });
    const inputNode = getByTestId("text-filter-input");

    userEvent.type(inputNode, "testing 123");
    inputNode.blur();

    expect(onFilterChanged).toHaveBeenCalledWith("test id", "testing 123");
    expect(onFilterChanged).toHaveBeenCalledTimes(1);
  });

  it("Should not call onFilterChanged if the value does not change", () => {
    const columnDef = {
      tableData: {
        id: "test id",
        filterValue: "Already filled",
      },
      title: "Test",
    };

    const onFilterChanged = jest.fn();

    const { getByTestId } = renderTextFilter({ columnDef, onFilterChanged });
    const inputNode = getByTestId("text-filter-input");

    userEvent.clear(inputNode);
    userEvent.type(inputNode, "Already filled");
    inputNode.blur();

    expect(onFilterChanged).toHaveBeenCalledTimes(0);
  });
});
