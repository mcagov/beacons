import React from "react";
import { Column, Icons } from "@material-table/core";
import { MenuItem, Select, Tooltip } from "@mui/material";
import {
  setEditing,
  setInternalValue,
  useInternalValue,
} from "../hooks/useInternalValue";
import { SelectChangeEvent } from "@mui/material/Select";

type ColumnDef<T extends Record<string, any>> = Column<T> & {
  tableData: any;
};

export interface SelectFilterProps<T extends Record<string, any>> {
  columnDef: Column<T>;
  onFilterChanged: (rowId: string, value: any) => void;
  icons: Icons;
  filterTooltip: string;
  options: { label: string; value: string }[];
}

export function SelectFilter<T extends Record<string, any>>({
  columnDef,
  icons,
  onFilterChanged,
  filterTooltip,
  options,
}: SelectFilterProps<T>) {
  const FilterIcon = icons.Filter as NonNullable<typeof icons.Filter>;
  const filterValue = (columnDef as ColumnDef<T>).tableData.filterValue || "";
  const [{ internalValue, editing }, dispatch] = useInternalValue(filterValue);

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

  const handleChange = (event: SelectChangeEvent<any>) => {
    const value = event.target.value as string;
    setInternalValue(dispatch, value);
    onFilterChanged((columnDef as ColumnDef<T>).tableData.id, value);
  };

  return (
    <Select
      value={editing ? internalValue : filterValue}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      inputProps={{
        "aria-label": `filter data by ${columnDef.title}`,
        "data-testid": "select-filter-input",
      }}
      startAdornment={
        <Tooltip title={filterTooltip}>
          <FilterIcon />
        </Tooltip>
      }
    >
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </Select>
  );
}
