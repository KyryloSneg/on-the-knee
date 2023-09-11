import { fireEvent, screen, act } from "@testing-library/react";
import { mockContextValue } from "../../utils/consts";
import userEvent from "@testing-library/user-event";
import renderTestApp from "../../utils/renderTestApp";

describe("SearchField", () => {
  it("renders search field when filter options amount is big enough (greater than FILTERS_OPTIONS_LENGTH_LIMIT const)", () => {
    renderTestApp(mockContextValue, { route: "/catalog" });

    expect(screen.getByTestId("search-field-input: hz")).toBeInTheDocument();
    expect(screen.queryByTestId("search-field-input: category")).toBeNull();
  });

  it("shows 'delete-input-content' button when field isn't empty, deletes input content and hides it on click", () => {
    renderTestApp(mockContextValue, { route: "/catalog" });

    act(() => {
      fireEvent.change(screen.getByTestId("search-field-input: hz"), {target: {value: "lorem ipsum"}})
    });
    expect(screen.getByTestId("delete-input-content-btn: hz")).toBeInTheDocument();

    act(() => {
      userEvent.click(screen.getByTestId("delete-input-content-btn: hz"));
    });

    expect(screen.getByTestId("search-field-input: hz").value).toBe("");
    expect(screen.queryByTestId("delete-input-content-btn: hz")).toBeNull();
  });

  test("filtering some options (category filters for example)", () => {
    jest.useFakeTimers();
    renderTestApp(mockContextValue, { route: "/catalog" });

    // value: "50"
    onDebounce = jest.fn(() => {
      // debounce time
      setTimeout(() => {
        expect(screen.getByTestId("CategoryFilterList: hz").children.length).toBe(1);
        expect(screen.getByTestId("hz: 50 checked=false")).toBeInTheDocument();
      }, 200);
    });

    act(() => {
      fireEvent.change(screen.getByTestId("search-field-input: hz"), {target: {value: "50"}})
    });
    onDebounce();

    // value: "more"
    onDebounce = jest.fn(() => {
      // debounce time
      setTimeout(() => {
        expect(screen.getByTestId("CategoryFilterList: hz").children.length).toBe(1);
        expect(screen.getByTestId("hz: 240 and more checked=false")).toBeInTheDocument();
      }, 200);
    });

    act(() => {
      fireEvent.change(screen.getByTestId("search-field-input: hz"), {target: {value: "more"}})
    });
    onDebounce();

    // value: "4"
    onDebounce = jest.fn(() => {
      // debounce time
      setTimeout(() => {
        expect(screen.getByTestId("CategoryFilterList: hz").children.length).toBe(3);
        expect(screen.getByTestId("hz: 140 checked=false")).toBeInTheDocument();
        expect(screen.getByTestId("hz: 144 checked=false")).toBeInTheDocument();
        expect(screen.getByTestId("hz: 240 and more checked=false")).toBeInTheDocument();
      }, 200);
    });

    act(() => {
      fireEvent.change(screen.getByTestId("search-field-input: hz"), {target: {value: "4"}})
    });
    onDebounce();
  });
});
