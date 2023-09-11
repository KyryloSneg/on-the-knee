import { fireEvent, screen } from "@testing-library/react";
import { mockContextValue } from "../../utils/consts";
import { act } from "react-dom/test-utils";
import renderTestApp from "../../utils/renderTestApp";

describe("PriceCategoryFilter", () => {
  test("correct rendering of initial min / max prices", () => {
    renderTestApp(mockContextValue, { route: "/catalog" });

    expect(screen.getByTestId("price-category-min").value).toBe("1300");
    expect(screen.getByTestId("price-category-max").value).toBe("79900");
  });

  describe("input some value", () => {
    it("replaces 0 with other non-zero number by adding it after zero", () => {
      renderTestApp(mockContextValue, { route: "/catalog" });

      act(() => {
        fireEvent.change(screen.getByTestId("price-category-min"), {target: {value: "0"}});
        fireEvent.change(screen.getByTestId("price-category-min"), {target: {value: "01"}});
      });

      expect(screen.getByTestId("price-category-min").value).toBe("1");
    });

    it("replaces empty string with 0", () => {
      renderTestApp(mockContextValue, { route: "/catalog" });

      act(() => {
        fireEvent.change(screen.getByTestId("price-category-min"), {target: {value: ""}});
      });

      expect(screen.getByTestId("price-category-min").value).toBe("0");
    });
  });

  describe("validation", () => {
    it("(disables / enables) submit btn when the max price is (lower / greater) than the min one", () => {
      renderTestApp(mockContextValue, { route: "/catalog" });
      
      act(() => {
        fireEvent.change(screen.getByTestId("price-category-max"), {target: {value: "799"}});
      });
      expect(screen.getByTestId("price-category-filter-btn")).toBeDisabled();

      act(() => {
        fireEvent.change(screen.getByTestId("price-category-max"), {target: {value: "79000"}});
      });
      expect(screen.getByTestId("price-category-filter-btn")).not.toBeDisabled();

      act(() => {
        fireEvent.change(screen.getByTestId("price-category-min"), {target: {value: "100000"}});
      });
      expect(screen.getByTestId("price-category-filter-btn")).toBeDisabled();
    });

    it("(disables / enables) submit btn when the max price (is / isn't) equals to 0", () => {
      renderTestApp(mockContextValue, { route: "/catalog" });

      act(() => {
        fireEvent.change(screen.getByTestId("price-category-max"), {target: {value: "0"}});
      });
      expect(screen.getByTestId("price-category-filter-btn")).toBeDisabled();

      act(() => {
        fireEvent.change(screen.getByTestId("price-category-max"), {target: {value: "79000"}});
      });
      expect(screen.getByTestId("price-category-filter-btn")).not.toBeDisabled();
    });

    it("(disables / enables) submit btn when the (min / max) price is (lower / greater) than initial value", () => {
      renderTestApp(mockContextValue, { route: "/catalog" });

      act(() => {
        fireEvent.change(screen.getByTestId("price-category-min"), {target: {value: "1000"}});
      });
      expect(screen.getByTestId("price-category-filter-btn")).toBeDisabled();

      act(() => {
        fireEvent.change(screen.getByTestId("price-category-min"), {target: {value: "1300"}});
      });
      expect(screen.getByTestId("price-category-filter-btn")).not.toBeDisabled();

      act(() => {
        fireEvent.change(screen.getByTestId("price-category-max"), {target: {value: "80000"}});
      });
      expect(screen.getByTestId("price-category-filter-btn")).toBeDisabled();

      act(() => {
        fireEvent.change(screen.getByTestId("price-category-max"), {target: {value: "79900"}});
      });
      expect(screen.getByTestId("price-category-filter-btn")).not.toBeDisabled();
    });
  })
});
