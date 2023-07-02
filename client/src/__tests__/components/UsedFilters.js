import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';

import UsedFilters from "../../components/UsedFilters";
import Aside from '../../components/Aside';
import { mockContextValue } from '../../utils/consts';
import { Context } from '../../Context';

describe("UsedFilters", () => {
  test("render of the 'remove all filters' and 'remove filter' btns ", () => {
    render(
      <Context.Provider value={mockContextValue}>
        <UsedFilters />
      </Context.Provider>
    );

    expect(screen.getByTestId("remove-all-filters")).toBeInTheDocument();
    expect(screen.getByTestId("category: phones")).toBeInTheDocument();
  });

  test("removing a filter", () => {
    render(
      <Context.Provider value={mockContextValue}>
        <UsedFilters />
      </Context.Provider>
    );

    act(() => {
      userEvent.click(screen.getByTestId("category: phones"));
    });

    expect(screen.queryByTestId("category: phones")).toBeNull();
  })

  test("removing all filters and hiding the 'used filters' section", async () => {
    // aside deciding: whether UsedFilters will be visible or not 
    render(
      <Context.Provider value={mockContextValue}>
        <Aside />
      </Context.Provider>
    );

    act(() => {
      userEvent.click(screen.getByTestId("remove-all-filters"));
    });
    
    await waitFor(() => expect(screen.queryByTestId("used-filters-section")).toBeNull());
  })
});
