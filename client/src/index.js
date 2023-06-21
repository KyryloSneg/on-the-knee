import React from 'react';
import ReactDOM from 'react-dom/client';
import { createContext } from 'react';
import UserStore from './stores/UserStore';
import App from './App';

export const Context = createContext(null);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Context.Provider value={{
      user: new UserStore(),
    }}>
      <App />
    </Context.Provider>
  </React.StrictMode>
);