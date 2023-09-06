import React, { useContext } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import routerConfig from '../router/index';
import { Context } from '../Context';
import { Outlet } from 'react-router-dom';

const AppRouterProvider = () => {
  const { user } = useContext(Context);

  return (
    <RouterProvider router={createBrowserRouter(routerConfig(user.isAuth))}>
      <Outlet />
    </RouterProvider>
  );
}

export default AppRouterProvider;
