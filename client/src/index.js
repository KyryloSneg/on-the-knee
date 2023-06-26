import React from 'react';
import ReactDOM from 'react-dom/client';
import { createContext } from 'react';
import UserStore from './stores/UserStore';
import App from './App';
import FiltersStore from './stores/FiltersStore';

export const Context = createContext(null);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Context.Provider value={{
      user: new UserStore(),
      filtersStore: new FiltersStore(),
    }}>
      <App />
    </Context.Provider>
  </React.StrictMode>
);