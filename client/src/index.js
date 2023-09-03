import React from 'react';
import ReactDOM from 'react-dom/client';
import UserStore from './stores/UserStore';
import DeviceStore from './stores/DeviceStore';
import { Context } from "./Context";
import AppRouterProvider from './components/AppRouterProvider';
import AppStore from './stores/AppStore';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Context.Provider value={{
      app: new AppStore(),
      user: new UserStore(),
      deviceStore: new DeviceStore(),
      isTest: false,
    }}>
      <AppRouterProvider />
    </Context.Provider>
  </React.StrictMode>
);