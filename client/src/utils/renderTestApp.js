const { render } = require("@testing-library/react")
const { Context } = require("../Context");
const { createMemoryRouter, RouterProvider, Outlet } = require("react-router-dom");
const { default: routerConfig } = require("../router");
const AppRouterProvider = require("../components/AppRouterProvider").default;

module.exports = function renderTestApp(mockContextValue, {route = '/', isAuth = true} = {}) {
  const router = createMemoryRouter(routerConfig(isAuth), {
    initialEntries: [route],
  });
  return render(
    <Context.Provider value={mockContextValue}>
      <RouterProvider router={router}>
        <Outlet />
      </RouterProvider>
    </Context.Provider>
  );
}