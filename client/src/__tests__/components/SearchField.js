import { fireEvent, render, screen, act } from "@testing-library/react";
import { Context } from "../../Context";
import { mockContextValue } from "../../utils/consts";
import FilterCategoryBlocksList from "../../components/FilterCategoryBlocksList";
import userEvent from "@testing-library/user-event";

describe("SearchField", () => {
  it("renders search field when filter options amount is big enough (greater than FILTERS_OPTIONS_LENGTH_LIMIT const)", () => {
    render(
      <Context.Provider value={mockContextValue}>
        <FilterCategoryBlocksList />
      </Context.Provider>
    );

    expect(
      screen.getByTestId("search-field-input: 3")
    ).toBeInTheDocument();
  });

  it("shows 'delete-input-content' button when field isn't empty, deletes input content and hides it on click", () => {
    render(
      <Context.Provider value={mockContextValue}>
        <FilterCategoryBlocksList />
      </Context.Provider>
    );

    act(() => {
      fireEvent.change(screen.getByTestId("search-field-input: 3"), {target: {value: "lorem ipsum"}})
    });

    expect(
      screen.getByTestId("delete-input-content-btn: 3")
    ).toBeInTheDocument();

    act(() => {
      userEvent.click(screen.getByTestId("delete-input-content-btn: 3"));
    });

    expect(
      screen.getByTestId("search-field-input: 3").value
    ).toBe("");

    expect(
      screen.queryByTestId("delete-input-content-btn: 3")
    ).toBeNull();
  });
});
