import React, { forwardRef } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SearchBar, SearchbarProps } from "./SearchBar";
import { Icons } from "@material-table/core";
import { Clear, Search } from "@mui/icons-material";
import { ThemeProvider } from "@mui/styles";
import { createTheme } from "@mui/material/styles";

const tableIcons: Icons = {
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
};

type RenderSearchBarParams = Pick<
  SearchbarProps,
  "dataManager" | "searchText" | "onSearchChanged"
>;

function renderSearchBar({
  dataManager,
  searchText,
  onSearchChanged,
}: RenderSearchBarParams) {
  return render(
    <ThemeProvider theme={createTheme()}>
      <SearchBar
        searchAutoFocus={false}
        searchFieldVariant="outlined"
        onSearchChanged={onSearchChanged}
        icons={tableIcons}
        searchFieldStyle={{}}
        searchText={searchText}
        dataManager={dataManager}
      />
    </ThemeProvider>
  );
}

describe("SearchBar", () => {
  it("Should only call prop change handlers after blur", () => {
    const onSearchChanged = jest.fn();
    const changeSearchText = jest.fn();

    renderSearchBar({
      dataManager: { changeSearchText },
      onSearchChanged,
      searchText: "",
    });

    const inputNode = screen.getByPlaceholderText(/search/i);
    userEvent.type(inputNode, "A query");
    inputNode.blur();

    expect(onSearchChanged).toHaveBeenCalledWith("A query");
    expect(onSearchChanged).toHaveBeenCalledTimes(1);

    expect(changeSearchText).toHaveBeenCalledWith("A query");
    expect(changeSearchText).toHaveBeenCalledTimes(1);
  });

  it("Should not call the change handlers if the value does not change", () => {
    const onSearchChanged = jest.fn();
    const changeSearchText = jest.fn();

    renderSearchBar({
      dataManager: { changeSearchText },
      onSearchChanged,
      searchText: "Prefilled",
    });

    const inputNode = screen.getByPlaceholderText(/search/i);
    userEvent.clear(inputNode);
    userEvent.type(inputNode, "Prefilled");
    inputNode.blur();

    expect(changeSearchText).toHaveBeenCalledTimes(0);
    expect(onSearchChanged).toHaveBeenCalledTimes(0);
  });

  it("Should call the change handlers once if the user types something and then presses the reset search button", () => {
    const onSearchChanged = jest.fn();
    const changeSearchText = jest.fn();

    renderSearchBar({
      dataManager: { changeSearchText },
      onSearchChanged,
      searchText: "Prefilled",
    });

    const inputNode = screen.getByPlaceholderText(/search/i);
    const buttonNode = screen.getByTestId("reset-search");

    userEvent.type(inputNode, "More");
    userEvent.click(buttonNode);

    expect(changeSearchText).toHaveBeenCalledWith("");
    expect(onSearchChanged).toHaveBeenCalledWith("");
    expect(changeSearchText).toHaveBeenCalledTimes(1);
    expect(onSearchChanged).toHaveBeenCalledTimes(1);
  });
});
