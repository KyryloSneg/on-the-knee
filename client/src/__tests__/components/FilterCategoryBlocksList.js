import { screen } from '@testing-library/react';
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

    act( () => {
      userEvent.click(screen.getByTestId("brand: Apple checked=false"));
    });
    expect(screen.getByTestId("brand: Apple checked=true")).toBeInTheDocument();
  
    act( () => {
      userEvent.click(screen.getByTestId("brand: Apple checked=true"));
    });
    expect(screen.queryByTestId("brand: Apple checked=false")).toBeInTheDocument();
  });
});
