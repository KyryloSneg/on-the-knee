const { render } = require("@testing-library/react")
const { Context } = require("../Context");
const { RouterProvider, Outlet, createBrowserRouter } = require("react-router-dom");
const { default: routerConfig } = require("../router");

module.exports = function renderTestApp(mockContextValue, {route = '/', isAuth = true} = {}) {
  // initial history entry
  window.history.pushState({}, '', route);

  // const router = createMemoryRouter(routerConfig(isAuth), {
  //   initialEntries: [route],
  // });

  const router = createBrowserRouter(routerConfig(isAuth));
  return render(
    <Context.Provider value={mockContextValue}>
      <RouterProvider router={router}>
        <Outlet />
      </RouterProvider>
    </Context.Provider>
  );
}