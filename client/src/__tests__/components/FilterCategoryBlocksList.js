import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';

import FilterCategoryBlocksList from '../../components/FilterCategoryBlocksList';
import { Context } from '../../Context';
import { mockContextValue } from '../../utils/consts';

describe('FilterCategoryBlocksList', () => {
  it('shows / hides the options when clicked on the button', async () => {
    jest.useFakeTimers();
    render(
      <Context.Provider value={mockContextValue}>
        <FilterCategoryBlocksList  />
      </Context.Provider>
    )

    // idk how this solution even works but it does
    jsAnimationEndHandler = jest.fn(() => {
      setTimeout(() => {
        return "executed";
      }, 400) // animation duration + debounce delay
    });


    act(() => {
      userEvent.click(screen.getByTestId("CategoryBlockBtn: 0"));
    });

    // waiting for the end of animation (setTimeout is replaced with fake timers)
    jsAnimationEndHandler();

    await waitFor(() => expect(jsAnimationEndHandler).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(screen.getByTestId("CategoryFilterList: 0").classList.contains("collapsed")).toBeTruthy());

    act(() => {
      userEvent.click(screen.getByTestId("CategoryBlockBtn: 0"));
    });

    jsAnimationEndHandler();

    await waitFor(() => expect(jsAnimationEndHandler).toHaveBeenCalledTimes(2));
    await waitFor(() => expect(screen.getByTestId("CategoryFilterList: 0").classList.contains("collapsed")).toBeFalsy());
  });


  test("(de-) selecting option (turning on and off active state)", async () => {
    render(
      <Context.Provider value={mockContextValue}>
        <FilterCategoryBlocksList />
      </Context.Provider>
    );

    await act(async () => {
      userEvent.click(screen.getByTestId("category: phones"));
      // react-testing-library is kidding me: in the act the component is re-rendered while out of it it's not
      expect(await screen.findByTestId("category: phones - icon checked")).toBeInTheDocument();
    });

    await act(async () => {
      userEvent.click(screen.getByTestId("category: phones"));
      expect(await screen.queryByTestId("category: phones - icon checked")).toBeNull();
    });
  });

  describe("keyboard control", () => {
    test("focusing next option when arrow down is clicked", () => {
      render(
        <Context.Provider value={mockContextValue}>
          <FilterCategoryBlocksList />
        </Context.Provider>
      );

      screen.getByTestId("category: TV").focus();

      act(() => {
        fireEvent.keyDown(screen.getByTestId("category: TV"), {key: 'ArrowDown', code: 'ArrowDown'});
      });

      expect(
        screen.getByTestId("category: computers")
      ).toHaveFocus();
    });

    test("focusing previous option when arrow up is clicked", () => {
      render(
        <Context.Provider value={mockContextValue}>
          <FilterCategoryBlocksList />
        </Context.Provider>
      );

      screen.getByTestId("category: TV").focus();

      act(() => {
        fireEvent.keyDown(screen.getByTestId("category: TV"), {key: 'ArrowUp', code: 'ArrowUp'});
      });

      expect(
        screen.getByTestId("category: phones")
      ).toHaveFocus();
    });

    test("focusing last option when arrow up is clicked on the first option and vice versa", () => {
      render(
        <Context.Provider value={mockContextValue}>
          <FilterCategoryBlocksList />
        </Context.Provider>
      );

      screen.getByTestId("category: phones").focus();

      act(() => {
        fireEvent.keyDown(screen.getByTestId("category: phones"), {key: 'ArrowUp', code: 'ArrowUp'});
      });

      expect(
        screen.getByTestId("category: computers")
      ).toHaveFocus();

      act(() => {
        fireEvent.keyDown(screen.getByTestId("category: computers"), {key: 'ArrowDown', code: 'ArrowDown'});
      });

      expect(
        screen.getByTestId("category: phones")
      ).toHaveFocus();
    });
  })
});
