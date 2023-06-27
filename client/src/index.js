import React from 'react';
import ReactDOM from 'react-dom/client';
import { createContext } from 'react';
import UserStore from './stores/UserStore';
import App from './App';
import DeviceStore from './stores/DeviceStore';

export const Context = createContext(null);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Context.Provider value={{
      user: new UserStore(),
      deviceStore: new DeviceStore(),
    }}>
      <App />
    </Context.Provider>
  </React.StrictMode>
);