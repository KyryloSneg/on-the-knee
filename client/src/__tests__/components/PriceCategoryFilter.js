import { Context } from "../../Context";
import { fireEvent, render, screen } from "@testing-library/react";
import { mockContextValue } from "../../utils/consts";
import FilterCategoryBlock from "../../components/FilterCategoryBlock";
import { act } from "react-dom/test-utils";

describe("PriceCategoryFilter", () => {
  test("correct rendering of initial min / max prices", async () => {
    render(
      <Context.Provider value={mockContextValue}>
        <FilterCategoryBlock filter={"price"} filterCategoryBlockId={0} variant="price" />
      </Context.Provider>
    );

    await expect(
      screen.getByDisplayValue("1300")
    ).toBeInTheDocument();

    await expect(
      screen.getByDisplayValue("79900")
    ).toBeInTheDocument();
  });

  describe("input some value", () => {
    it("replaces 0 with other non-zero number by adding it after zero", () => {
      render(
        <Context.Provider value={mockContextValue}>
          <FilterCategoryBlock filter={"price"} filterCategoryBlockId={0} variant="price" />
        </Context.Provider>
      );

      act(() => {
        fireEvent.change(screen.getByDisplayValue("1300"), {target: {value: "0"}});
        fireEvent.change(screen.getByDisplayValue("0"), {target: {value: "01"}});
      });

      expect(screen.getByDisplayValue("1")).toBeInTheDocument();
    });

    it("replaces empty string with 0", () => {
      render(
        <Context.Provider value={mockContextValue}>
          <FilterCategoryBlock filter={"price"} filterCategoryBlockId={0} variant="price" />
        </Context.Provider>
      );

      act(() => {
        fireEvent.change(screen.getByDisplayValue("1300"), {target: {value: ""}});
      });

      expect(screen.getByDisplayValue("0")).toBeInTheDocument();
    });
  });

  describe("validation", () => {
    it("(disables / enables) submit btn when the max price is (lower / greater) than the min one", async () => {
      render(
        <Context.Provider value={mockContextValue}>
          <FilterCategoryBlock filter={"price"} filterCategoryBlockId={0} variant="price" />
        </Context.Provider>
      );
      
      act(() => {
        fireEvent.change(screen.getByDisplayValue("79900"), {target: {value: "799"}});
      });
      
      expect(screen.getByTestId("price-category-filter-btn")).toBeDisabled();

      act(() => {
        fireEvent.change(screen.getByDisplayValue("799"), {target: {value: "79000"}});
      });

      expect(screen.getByTestId("price-category-filter-btn")).not.toBeDisabled();

      act(() => {
        fireEvent.change(screen.getByDisplayValue("1300"), {target: {value: "100000"}});
      });

      expect(screen.getByTestId("price-category-filter-btn")).toBeDisabled();
    });

    it("(disables / enables) submit btn when the max price (is / isn't) equals to 0", () => {
      render(
        <Context.Provider value={mockContextValue}>
          <FilterCategoryBlock filter={"price"} filterCategoryBlockId={0} variant="price" />
        </Context.Provider>
      );

      act(() => {
        fireEvent.change(screen.getByDisplayValue("79900"), {target: {value: "0"}});
      });

      expect(screen.getByTestId("price-category-filter-btn")).toBeDisabled();

      act(() => {
        fireEvent.change(screen.getByDisplayValue("0"), {target: {value: "79000"}});
      });

      expect(screen.getByTestId("price-category-filter-btn")).not.toBeDisabled();
    });

    it("(disables / enables) submit btn when the (min / max) price is (lower / greater) than initial value", () => {
      render(
        <Context.Provider value={mockContextValue}>
          <FilterCategoryBlock filter={"price"} filterCategoryBlockId={0} variant="price" />
        </Context.Provider>
      );

      act(() => {
        fireEvent.change(screen.getByDisplayValue("1300"), {target: {value: "1000"}});
      });

      expect(screen.getByTestId("price-category-filter-btn")).toBeDisabled();

      act(() => {
        fireEvent.change(screen.getByDisplayValue("1000"), {target: {value: "1300"}});
      });

      expect(screen.getByTestId("price-category-filter-btn")).not.toBeDisabled();

      act(() => {
        fireEvent.change(screen.getByDisplayValue("79900"), {target: {value: "80000"}});
      });

      expect(screen.getByTestId("price-category-filter-btn")).toBeDisabled();

      act(() => {
        fireEvent.change(screen.getByDisplayValue("80000"), {target: {value: "79900"}});
      });

      expect(screen.getByTestId("price-category-filter-btn")).not.toBeDisabled();

    });
  })
});
