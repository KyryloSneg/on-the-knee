import { fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';

import { mockContextValue } from '../../utils/consts';
import renderTestApp from '../../utils/renderTestApp';

describe('FilterCategoryBlocksList', () => {
  it('shows / hides the options when clicked on the button', () => {
    renderTestApp(mockContextValue, { route: "/catalog" });

    act(() => {
      userEvent.click(screen.getByTestId("CategoryBlockBtn: price"));
    });
    expect(screen.getByTestId("filter-category-block price collapsed")).toBeInTheDocument();

    act(() => {
      userEvent.click(screen.getByTestId("CategoryBlockBtn: price"));
    });
    expect(screen.queryByTestId("filter-category-block price expanded")).toBeInTheDocument();
  });


  test("(de-) selecting option (turning on and off active state)", () => {
    renderTestApp(mockContextValue, { route: "/catalog" });

    act(() => {
      userEvent.click(screen.getByTestId("brand: Apple checked=false"));
    });
    expect(screen.getByTestId("brand: Apple checked=true")).toBeInTheDocument();

    act(() => {
      userEvent.click(screen.getByTestId("brand: Apple checked=true"));
    });
    expect(screen.queryByTestId("brand: Apple checked=false")).toBeInTheDocument();
  });

  describe("skip button at the end of aside", () => {

    test("focusing first filter category block btn when there's no selected filters", () => {
      jest.useFakeTimers();

      renderTestApp(mockContextValue, { route: "/catalog" });
      const skipBtn = screen.getByTestId("skip-to-the-next-page-btn aside end");

      checkFilterBtnFocus = jest.fn(() => {
        setTimeout(() => {
          expect(screen.getByTestId("CategoryBlockBtn: price")).toHaveFocus();
        }, 500);
      })
      
      act(() => {
        userEvent.click(skipBtn);
      });
    });

    test("focusing remove all filters btn when there are selected filters", () => {
      renderTestApp(mockContextValue, { route: "/catalog?brand=Apple" });
      const skipBtn = screen.getByTestId("skip-to-the-next-page-btn aside end");

      act(() => {
        userEvent.click(skipBtn);
      });

      expect(screen.getByTestId("remove-all-filters")).toHaveFocus();
    });

  });
});
