import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';

import Dropdown from '../UI/dropdown/Dropdown';
import DivForTesting from '../DivForTesting';

describe('SortingFilterBar', () => {
  it('shows / hides the options when clicked on the button', async () => {
    // sorting-filter variant as example (different variant behave almost identically)
    render(<Dropdown variant="sorting-filter" paramKey="sort" />)

    act(() => {
      userEvent.click(screen.getByTestId("dropdown-btn"));
    });

    expect(
      screen.getByTestId("dropdown-options")
    ).toBeInTheDocument()

    act(() => {
      userEvent.click(screen.getByTestId("dropdown-btn"));
    });

    expect(
      screen.queryByTestId("dropdown-options")
    ).toBeNull();
  });

  it("hides the options when clicked outside of them", () => {
    render(<Dropdown variant="sorting-filter" paramKey="sort" />);
    render(<DivForTesting />);

    act(() => {
      userEvent.click(screen.getByTestId("dropdown-btn"));
    });

    act(() => {
      userEvent.click(screen.getByTestId("test-div"));
    });

    expect(
      screen.queryByTestId("dropdown-options")
    ).toBeNull();
  });

  it("button title properly shows the selected option", () => {
    render(<Dropdown variant="sorting-filter" paramKey="sort" />);

    act(() => {
      userEvent.click(screen.getByTestId("dropdown-btn"));
    });

    act(() => {
      userEvent.click(screen.getByTestId("option 0"));
    });

    expect(
      screen.getByTestId("dropdown-btn")
    ).toHaveTextContent('best rating');
  });

  test("selecting option (focusing and turning on active state)", () => {
    render(<Dropdown variant="sorting-filter" paramKey="sort" />);

    act(() => {
      userEvent.click(screen.getByTestId("dropdown-btn"));
    });

    act(() => {
      userEvent.click(screen.getByTestId("option 1"));
    });

    act(() => {
      userEvent.click(screen.getByTestId("dropdown-btn"));
    });

    expect(
      screen.getByTestId("option 1").parentElement.classList.contains("active")
    ).toBeTruthy();

    expect(
      screen.getByTestId("option 1")
    ).toHaveFocus();
  }); 

  describe("keyboard control", () => {
    test("focusing next element when arrow down is clicked", () => {
      render(<Dropdown variant="sorting-filter" paramKey="sort" />);

      act(() => {
        userEvent.click(screen.getByTestId("dropdown-btn"));
      });

      act(() => {
        fireEvent.keyDown(screen.getByTestId("option 0"), {key: 'ArrowDown', code: 'ArrowDown'});
      });

      expect(
        screen.getByTestId("option 1")
      ).toHaveFocus();
    });

    test("focusing previous element when arrow up is clicked", () => {
      render(<Dropdown variant="sorting-filter" paramKey="sort" />);

      act(() => {
        userEvent.click(screen.getByTestId("dropdown-btn"));
      });

      act(() => {
        fireEvent.keyDown(screen.getByTestId("option 0"), {key: 'ArrowUp', code: 'ArrowUp'});
      });

      expect(
        screen.getByTestId("option 3")
      ).toHaveFocus();
    });
  })
});
