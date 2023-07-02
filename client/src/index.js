import React from 'react';
import ReactDOM from 'react-dom/client';
import UserStore from './stores/UserStore';
import App from './App';
import DeviceStore from './stores/DeviceStore';
import { Context } from "./Context";

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