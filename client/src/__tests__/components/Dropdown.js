import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import { mockContextValue } from '../../utils/consts';

import renderTestApp from '../../utils/renderTestApp';
import DivForTesting from '../../components/DivForTesting';

describe('SortingFilterBar', () => {

  describe("sorting-filter", () => {

    it('shows / hides the options when clicked on the button', async () => {
      const { container } = renderTestApp(mockContextValue, { route: "/catalog" });

      act(() => {
        userEvent.click(screen.getByTestId("dropdown-sorting-filter-btn"));
      });

      expect(
        screen.getByTestId("dropdown-options-sort")
      ).toBeInTheDocument()

      act(() => {
        userEvent.click(screen.getByTestId("dropdown-sorting-filter-btn"));
      });

      expect(
        screen.queryByTestId("dropdown-options-sort")
      ).toBeNull();
    });

    it("hides the options when clicked outside of them", () => {
      const { container } = renderTestApp(mockContextValue, { route: "/catalog" });
      render(<DivForTesting />);

      act(() => {
        userEvent.click(screen.getByTestId("dropdown-sorting-filter-btn"));
      });

      act(() => {
        userEvent.click(screen.getByTestId("test-div"));
      });

      expect(
        screen.queryByTestId("dropdown-options-sort")
      ).toBeNull();
    });

    it("button title properly shows the selected option", async () => {
      jest.useFakeTimers();
      const { container } = renderTestApp(mockContextValue, { route: "/catalog" });
      // idk how this solution even works x2
      testValueAfterSelect = jest.fn(() => {
        setTimeout(() => {
          expect(
            screen.findByTestId("dropdown-sorting-filter-btn")
          ).toHaveTextContent('worst rating');
        }, 500);
      });

      act(() => {
        userEvent.click(screen.getByTestId("dropdown-sorting-filter-btn"));
      });

      // `dropdown-option-${paramKey} ${opt.id}`
      act(() => {
        userEvent.click(screen.getByTestId("dropdown-option-sort 1"));
      });

      window.history.pushState({}, 'Test page with query params', "/catalog?sort=asc%2Crating")
      testValueAfterSelect();

    });

    test("selecting option (focusing and turning on active state)", () => {
      const { container } = renderTestApp(mockContextValue, { route: "/catalog" });

      act(() => {
        userEvent.click(screen.getByTestId("dropdown-sorting-filter-btn"));
      });

      act(() => {
        userEvent.click(screen.getByTestId("dropdown-option-sort 1"));
      });

      act(() => {
        userEvent.click(screen.getByTestId("dropdown-sorting-filter-btn"));
      });

      expect(
        screen.getByTestId("dropdown-option-sort 1").parentElement.classList.contains("active")
      ).toBeTruthy();

      expect(
        screen.getByTestId("dropdown-option-sort 1")
      ).toHaveFocus();
    }); 

    describe("keyboard control", () => {
      test("focusing next element when arrow down is clicked", () => {
        const { container } = renderTestApp(mockContextValue, { route: "/catalog" });

        act(() => {
          userEvent.click(screen.getByTestId("dropdown-sorting-filter-btn"));
        });

        act(() => {
          fireEvent.keyDown(screen.getByTestId("dropdown-option-sort 0"), {key: 'ArrowDown', code: 'ArrowDown'});
        });

        expect(
          screen.getByTestId("dropdown-option-sort 1")
        ).toHaveFocus();
      });

      test("focusing previous element when arrow up is clicked", () => {
        const { container } = renderTestApp(mockContextValue, { route: "/catalog" });

        act(() => {
          userEvent.click(screen.getByTestId("dropdown-sorting-filter-btn"));
        });

        act(() => {
          fireEvent.keyDown(screen.getByTestId("dropdown-option-sort 1"), {key: 'ArrowUp', code: 'ArrowUp'});
        });

        expect(
          screen.getByTestId("dropdown-option-sort 0")
        ).toHaveFocus();
      });

      test("focusing first element when arrow down is fired on the last one", () => {
        const { container } = renderTestApp(mockContextValue, { route: "/catalog" });

        act(() => {
          userEvent.click(screen.getByTestId("dropdown-sorting-filter-btn"));
        });

        act(() => {
          fireEvent.keyDown(screen.getByTestId("dropdown-option-sort 3"), {key: 'ArrowDown', code: 'ArrowDown'});
        });

        expect(
          screen.getByTestId("dropdown-option-sort 0")
        ).toHaveFocus();
      });

      test("focusing last element when arrow up is fired on the first one", () => {
        const { container } = renderTestApp(mockContextValue, { route: "/catalog" });

        act(() => {
          userEvent.click(screen.getByTestId("dropdown-sorting-filter-btn"));
        });

        act(() => {
          fireEvent.keyDown(screen.getByTestId("dropdown-option-sort 0"), {key: 'ArrowUp', code: 'ArrowUp'});
        });

        expect(
          screen.getByTestId("dropdown-option-sort 3")
        ).toHaveFocus();
      });

    })
  });
});
