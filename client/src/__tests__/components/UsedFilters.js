import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';

import { mockContextValue } from '../../utils/consts';
import renderTestApp from '../../utils/renderTestApp';

const route = "/catalog?category=phones&price=2000-50000&random=not_existing_query&text=special_query_value";
describe("UsedFilters", () => {
  test("render of the 'remove all filters' and a filter btns", () => {
    renderTestApp(mockContextValue, { route: route });

    expect(screen.getByTestId("remove-all-filters")).toBeInTheDocument();
    expect(screen.getByTestId("filter-btn category: phones")).toBeInTheDocument();
    expect(screen.getByTestId("filter-btn price: 2000-50000")).toBeInTheDocument();
  });

  test("not rendering non-existing filter", () => {
    renderTestApp(mockContextValue, { route: route });
    expect(screen.queryByTestId("filter-btn random: not_existing_query")).toBeNull();
  });

  test("not rendering special query params 'filters'", () => {
    renderTestApp(mockContextValue, { route: route });
    expect(screen.queryByTestId("filter-btn text: special_query_value")).toBeNull();
  });

  test("removing a filter", async () => {
    renderTestApp(mockContextValue, { route: route });
    act(() => {
      userEvent.click(screen.getByTestId("filter-btn category: phones"));
    });

    expect(screen.queryByTestId("filter-btn category: phones")).toBeNull();
  });

  test("removing all filters and hiding the 'used filters' section", () => {
    // aside deciding: whether UsedFilters will be visible or not 
    renderTestApp(mockContextValue, { route: route });

    act(() => {
      userEvent.click(screen.getByTestId("remove-all-filters"));
    });
    
    expect(screen.queryByTestId("used-filters-section")).toBeNull()
  });
});
