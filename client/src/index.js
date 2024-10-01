import React from 'react';
import ReactDOM from 'react-dom/client';
import UserStore from './stores/UserStore';
import DeviceStore from './stores/DeviceStore';
import AppStore from './stores/AppStore';
import { Context } from "./Context";
import AppRouterProvider from './components/AppRouterProvider';
import 'overlayscrollbars/overlayscrollbars.css';
import withAuth from "./hocs/withAuth";

const AppRouterProviderWithAuth = withAuth(AppRouterProvider);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Context.Provider value={{
      app: new AppStore(),
      user: new UserStore(),
      deviceStore: new DeviceStore(),
      isTest: false,
    }}>
      <AppRouterProviderWithAuth />
      {/* <AppRouterProvider /> */}
    </Context.Provider>
  </React.StrictMode>
);