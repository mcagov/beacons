import React from "react";
import { InputAdornment, TextField, Tooltip } from "@material-ui/core";
import { Column, Icons } from "@material-table/core";
import {
  setEditing,
  setInternalValue,
  useInternalValue,
} from "../hooks/useInternalValue";

type ColumnDef<T extends Record<string, any>> = Column<T> & {
  tableData: any;
};

// columnDef, onFilterChanged, and icons are types defined by @material-table/core
export interface TextFilterProps<T extends Record<string, any>> {
  columnDef: Column<T>;
  onFilterChanged: (rowId: string, value: any) => void;
  icons: Icons;
  filterTooltip: string;
}

export function TextFilter<T extends Record<string, any>>({
  columnDef,
  icons,
  onFilterChanged,
  filterTooltip,
}: TextFilterProps<T>) {
  const FilterIcon = icons.Filter as NonNullable<typeof icons.Filter>;
  const inputRef = React.useRef<HTMLInputElement>(null);
  // Have to use type coercion due to incorrect types provided by @material-table/core
  const filterValue = (columnDef as ColumnDef<T>).tableData.filterValue || "";
  const [{ internalValue, editing }, dispatch] = useInternalValue(filterValue);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      inputRef.current?.blur();
    }
  };

  const handleFocus = () => {
    setEditing(dispatch, true);
    if (internalValue !== filterValue) {
      setInternalValue(dispatch, filterValue);
    }
  };

  const handleBlur = () => {
    setEditing(dispatch, false);
    if (internalValue !== filterValue) {
      onFilterChanged((columnDef as ColumnDef<T>).tableData.id, internalValue);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInternalValue(dispatch, e.target.value);
  };

  return (
    <TextField
      style={columnDef.type === "numeric" ? { float: "right" } : {}}
      type={columnDef.type === "numeric" ? "number" : "search"}
      value={editing ? internalValue : filterValue}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      inputProps={{
        "aria-label": `filter data by ${columnDef.title}`,
        "data-testid": "text-filter-input",
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Tooltip title={filterTooltip}>
              <FilterIcon />
            </Tooltip>
          </InputAdornment>
        ),
        inputRef,
      }}
    />
  );
}
