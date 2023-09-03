const { render } = require("@testing-library/react")
const { Context } = require("../Context");
const AppRouterProvider = require("../components/AppRouterProvider").default;

module.exports = function renderTestApp(mockContextValue) {
  return render(
    <Context.Provider value={mockContextValue}>
      <AppRouterProvider />
    </Context.Provider>
  );
}