import { fireEvent, screen, waitFor } from '@testing-library/react';
import { mockContextValue } from '../../utils/consts';
import getElemByClass from '../../utils/getElemByClass';
import { act } from 'react-dom/test-utils';
import userEvent from '@testing-library/user-event';
import renderTestApp from '../../utils/renderTestApp';

describe("SearchProductsForm", () => {

  describe("input focus", () => {

    test("focus on not empty value", () => {
      // we must render EVERY element that contains a link like this:
      const { container } = renderTestApp(mockContextValue);

      const input = getElemByClass(container, "search-product-line")
      act(() => {
        userEvent.type(input, "test")
      });

      expect(getElemByClass(container, "focusedSearch")).toBeInTheDocument();
    });

    test("blur on empty results and input value", async () => {
      const { container } = renderTestApp({ ...mockContextValue, isEmptySearchResults: true });

      const input = getElemByClass(container, "search-product-line")
      act(() => {
        userEvent.type(input, "test")
        fireEvent.change(input, { target: { value: '' } });
      });

      expect(screen.getByTestId("navbar-btn-group").classList.contains("focusedSearch")).toBeFalsy();
    });

  });

  describe("history search results", () => {

    it("shows history search results when there's no input value", () => {
      const { container } = renderTestApp(mockContextValue);

      const input = getElemByClass(container, "search-product-line")
      act(() => {
        userEvent.type(input, "test")
        fireEvent.change(input, { target: { value: '' } });
      });

      expect(getElemByClass(container, "search-result-history")).toBeInTheDocument();

      act(() => {
        userEvent.type(input, "test")
      });

      expect(screen.queryByTestId("3-searchResultHistory")).toBeNull();
    });

    describe("deleting history results", () => {

      test("deleting ONE search result history", () => {
        const { container } = renderTestApp(mockContextValue);

        const input = getElemByClass(container, "search-product-line")
        act(() => {
          userEvent.type(input, "test")
          fireEvent.change(input, { target: { value: '' } });
        });

        const resultHistory = screen.getByTestId("3-searchResultHistory");
        const deleteOneBtn = getElemByClass(resultHistory, "clear-search-result");

        act(() => {
          userEvent.click(deleteOneBtn);
        });

        expect(screen.queryByTestId("3-searchResultHistory")).toBeNull();
      });

      test("deleting ALL search results history", () => {
        const { container } = renderTestApp(mockContextValue);

        const input = getElemByClass(container, "search-product-line")
        act(() => {
          userEvent.type(input, "test")
          fireEvent.change(input, { target: { value: '' } });
        });

        const deleteAllBtn = getElemByClass(container, "clear-search-results-history");

        act(() => {
          userEvent.click(deleteAllBtn);
        });

        expect(screen.queryByTestId("clear-search-results-history")).toBeNull();
      });

    });

    test("focusing the input and deleting its value on the delete input content btn click", () => {
      const { container } = renderTestApp(mockContextValue);

      const input = getElemByClass(container, "search-product-line")
      act(() => {
        userEvent.type(input, "test")
      });

      const deleteInputContentBtn = getElemByClass(container, "delete-input-content-btn");
      act(() => {
        userEvent.click(deleteInputContentBtn);
      });

      expect(input.value).toBe("");
      expect(input).toHaveFocus();
    });

    describe("bluring the form with keyboard", () => {

      it("leaving with (shift + tab) on mobile resolution", () => {
        const { container } = renderTestApp(mockContextValue);

        const input = getElemByClass(container, "search-product-line");
        act(() => {
          userEvent.type(input, "test"); // active element: input
        });

        act(() => {
          userEvent.tab({ shift: true }); // active element: back btn
          userEvent.tab({ shift: true }); // active element: outside of the form
        });

        expect(screen.getByTestId("navbar-btn-group").classList.contains("focusedSearch")).toBeFalsy();
      });

      it("leaving with (tab)", () => {
        const { container } = renderTestApp({ ...mockContextValue, isEmptySearchResults: true });

        const input = getElemByClass(container, "search-product-line");
        act(() => {
          userEvent.type(input, "test"); // active element: input
        });

        act(() => {
          userEvent.tab(); // active element: our default option
          userEvent.tab(); // active element: delete input content btn
          userEvent.tab(); // active element: submit btn
          userEvent.tab(); // active element: outside of the form
        });

        expect(screen.getByTestId("navbar-btn-group").classList.contains("focusedSearch")).toBeFalsy();
      });

    });

    describe("filtering the options", () => {

      test("options by such a filters are found", async () => {
        const { container } = renderTestApp(mockContextValue);
        const input = getElemByClass(container, "search-product-line");

        act(() => {
          // normal input value
          userEvent.type(input, "mice");
        });

        // {id}-searchResultHistory
        await expect(screen.getByTestId("3-searchResultHistory")).toBeInTheDocument();
        await expect(screen.getByTestId("3-searchResultHistory")).toBeInTheDocument();

        act(() => {
          // testing singularized value
          fireEvent.change(input, { target: { value: '' } });
          userEvent.type(input, "mouse");
        });

        await expect(screen.getByTestId("3-searchResultHistory")).toBeInTheDocument();
        await expect(screen.getByTestId("3-searchResultHistory")).toBeInTheDocument();

        act(() => {
          // testing plural value
          fireEvent.change(input, { target: { value: '' } });
          userEvent.type(input, "mouses");
        });

        await expect(screen.getByTestId("3-searchResultHistory")).toBeInTheDocument();
        await expect(screen.getByTestId("3-searchResultHistory")).toBeInTheDocument();
      });

      test("empty results", async () => {
        const { container } = renderTestApp(mockContextValue);
        const input = getElemByClass(container, "search-product-line");

        act(() => {
          userEvent.type(input, "some-random-str");
        });

        // {id}-searchResultHistory
        await expect(screen.queryByTestId("3-searchResultHistory")).toBeNull();
        await expect(screen.queryByTestId("3-searchResultHistory")).toBeNull();
      });

    });

    test("selecting default option if user doesn't press up and down arrows", () => {
      const { container } = renderTestApp(mockContextValue);
      const input = getElemByClass(container, "search-product-line");

      act(() => {
        userEvent.type(input, "mice");
      });

      expect(screen.getByTestId("backup-searchResultHistory").classList.contains("active")).toBeTruthy();
    });

    describe("keyboard controls and selecting values", () => {

      test("when there's some options", () => {
        const { container } = renderTestApp(mockContextValue);
        const input = getElemByClass(container, "search-product-line");

        act(() => {
          userEvent.type(input, "mice");
        });

        act(() => {
          fireEvent.keyDown(window, { key: "ArrowDown" });
        });

        expect(input).toHaveDisplayValue("mice bloody");
        expect(screen.getByTestId("3-searchResultHistory").classList.contains("active")).toBeTruthy();

        act(() => {
          fireEvent.keyDown(window, { key: "ArrowDown" });
        });

        expect(input).toHaveDisplayValue("mice");
        expect(screen.getByTestId("5-searchResultHistory").classList.contains("active")).toBeTruthy();

        act(() => {
          fireEvent.keyDown(window, { key: "ArrowDown" });
        });

        expect(input).toHaveDisplayValue("mice");
        expect(screen.getByTestId("backup-searchResultHistory").classList.contains("active")).toBeTruthy();

        act(() => {
          fireEvent.keyDown(window, { key: "ArrowUp" });
        });

        expect(input).toHaveDisplayValue("mice");
        expect(screen.getByTestId("5-searchResultHistory").classList.contains("active")).toBeTruthy();

        act(() => {
          fireEvent.keyDown(window, { key: "ArrowUp" });
        });

        expect(input).toHaveDisplayValue("mice bloody");
        expect(screen.getByTestId("3-searchResultHistory").classList.contains("active")).toBeTruthy();
      });

      test("no controls on empty results", () => {
        const { container } = renderTestApp({ ...mockContextValue, isEmptySearchResults: true });
        const input = getElemByClass(container, "search-product-line");

        act(() => {
          userEvent.type(input, "test");
        });

        act(() => {
          fireEvent.keyDown(window, { key: "ArrowDown" });
        });

        // nothing has changed
        expect(screen.getByTestId("backup-searchResultHistory").classList.contains("active")).toBeTruthy();
      });

      test("unselecting option and disabling keyboard controls on unfocusing the input", () => {
        const { container } = renderTestApp(mockContextValue);
        const input = getElemByClass(container, "search-product-line");

        act(() => {
          userEvent.type(input, "mice");
        });

        act(() => {
          fireEvent.keyDown(window, { key: "ArrowDown" });
        });

        act(() => {
          userEvent.tab();
        });

        expect(container.querySelector(".search-result.active")).toBeNull();
      });

    });

    test("changing backup value to the input's one on bluring the form", () => {
      const { container } = renderTestApp(mockContextValue);
      const input = getElemByClass(container, "search-product-line");
      
      act(() => {
        userEvent.type(input, "mice");
      });
      
      act(() => {
        fireEvent.keyDown(window, { key: "ArrowDown" });
      });
      
      const darkBg = screen.getByTestId("app-dark-bg");
      act(() => {
        userEvent.click(darkBg);
      });

      act(() => {
        userEvent.click(input);
      });

      expect(screen.getByTestId("backup-searchResultHistory")).toHaveTextContent("mice bloody");
    });

    test("highlighting matching to the input value part of the default options", () => {
      const { container } = renderTestApp(mockContextValue);
      const input = getElemByClass(container, "search-product-line");

      act(() => {
        userEvent.type(input, "gaming");
      });

      const liElem = screen.getByTestId("1-searchResultHistory");
      const matchingSegment = liElem.querySelector(".matching-search-result-segment");
      const notMatchingSegment = matchingSegment.nextElementSibling;

      expect(matchingSegment).toHaveTextContent("gaming");
      expect(notMatchingSegment).toHaveTextContent("mouse");
    });

    describe("back button", () => {

      test("(showing / hiding) the back btn on the form (focus / blur)", () => {
        const { container } = renderTestApp({ ...mockContextValue, isEmptySearchResults: true });

        const input = getElemByClass(container, "search-product-line")
        act(() => {
          userEvent.type(input, "test")
        });

        expect(screen.getByTestId("search-product-back-btn")).toBeInTheDocument();
        act(() => {
          fireEvent.change(input, { target: { value: '' } });
        });

        expect(screen.getByTestId("search-product-back-btn").style.display).toBe("");
      });

      test("unfocusing the form on back btn click", () => {
        const { container } = renderTestApp(mockContextValue);

        const input = getElemByClass(container, "search-product-line")
        act(() => {
          userEvent.type(input, "test")
        });

        const backBtn = screen.getByTestId("search-product-back-btn");
        act(() => {
          userEvent.click(backBtn);
        })

        expect(screen.getByTestId("navbar-btn-group").classList.contains("focusedSearch")).toBeFalsy();
        // make sure that we do not focus any element
        expect(document.body).toHaveFocus();
      });
    });

  });
});