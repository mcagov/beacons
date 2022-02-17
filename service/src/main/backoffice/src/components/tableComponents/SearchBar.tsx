/**
 * Here be dragons:
 *
 * Most of this file is taken from @material-table/core with the addition of our
 * own types. It is not possible to replace the SearchBar in MTableToolbar so we have to
 * tell MTableToolbar to not render a SearchBar and replace it with our reimplementation
 *
 * Unfortunately the "source of truth" for the current search text is handled rather strangely
 * in material-table so we have to be careful to make sure our current search is synchronised
 * with what material-table thinks the current search is, the handlers are carefully orchestrated
 * so that:
 *
 * - When a user is typing the value shown to them is the internal value.
 * - When a user clicks away or presses enter a blur event is fired which will tell material-table
 *   what the internal value is.
 * - When a user clicks on the X button the internal value is cleared and material-table is
 *   notified. Clicking the X will also trigger a blur event so handleBlur must allow handleClick
 *   to take precedence.
 */
import React from "react";
import {
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
  Theme,
  withStyles,
} from "@material-ui/core";
import { Icons } from "@material-table/core";
import {
  clearInternalValue,
  setEditing,
  setInternalValue,
  useInternalValue,
} from "../hooks/useInternalValue";

const localization = {
  searchTooltip: "Search",
  searchPlaceholder: "Search",
  searchAriaLabel: "Search",
  clearSearchAriaLabel: "Clear Search",
};

const styles = (theme: Theme) => ({
  searchField: {
    minWidth: 150,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
});

export interface SearchbarProps {
  searchText: string;
  searchAutoFocus: boolean;
  searchFieldVariant: "standard" | "filled" | "outlined";
  searchFieldStyle: React.CSSProperties;
  dataManager: { changeSearchText: (searchText: string) => void };
  onSearchChanged: (searchText: string) => void;
  icons: Icons;
  classes: Record<keyof ReturnType<typeof styles>, string>;
}

export const SearchBar = withStyles(styles)(function ({
  searchAutoFocus,
  searchFieldStyle,
  searchFieldVariant,
  searchText,
  onSearchChanged,
  dataManager,
  icons,
  classes,
}: SearchbarProps) {
  const [{ internalValue }, dispatch] = useInternalValue(searchText);
  const SearchIcon = icons.Search as NonNullable<typeof icons.Search>;
  const ResetSearchIcon = icons.ResetSearch as NonNullable<
    typeof icons.ResetSearch
  >;
  const inputRef = React.useRef<HTMLInputElement>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  const handleSearch = (search: string) => {
    if (search !== searchText) {
      dataManager.changeSearchText(search);
      onSearchChanged(search);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setInternalValue(dispatch, e.target.value);
  };

  const handleFocus = (): void => {
    setEditing(dispatch, true);
  };

  const handleBlur = (e: React.FocusEvent): void => {
    // handleClick needs to take precedence over handleBlur, therefore if the X button is clicked
    // we want to use handleClick and not handleBlur, blur events always fire before click events
    // so as long as handleClick has the desired behaviour this is safe.
    if (e.relatedTarget !== buttonRef.current) {
      setEditing(dispatch, false);
      handleSearch(internalValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key === "Enter") {
      inputRef.current?.blur();
    }
  };

  const handleClick = (): void => {
    clearInternalValue(dispatch);
    handleSearch("");
  };

  return (
    <TextField
      autoFocus={searchAutoFocus}
      className={classes.searchField}
      value={internalValue}
      onChange={handleChange}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      onFocus={handleFocus}
      placeholder={"Search"}
      variant={searchFieldVariant}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Tooltip title={localization.searchTooltip}>
              <SearchIcon fontSize="small" />
            </Tooltip>
          </InputAdornment>
        ),
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              onClick={handleClick}
              ref={buttonRef}
              aria-label={localization.clearSearchAriaLabel}
              data-testid="reset-search"
            >
              <ResetSearchIcon fontSize="small" aria-label="clear" />
            </IconButton>
          </InputAdornment>
        ),
        style: searchFieldStyle,
        inputProps: {
          "aria-label": localization.searchAriaLabel,
        },
        inputRef,
      }}
    />
  );
});
