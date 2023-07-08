import React, { useContext } from 'react';
import { RouterProvider } from 'react-router-dom';
import router from '../router/index';
import { Context } from '../Context';
import { Outlet } from 'react-router-dom';

const AppRouterProvider = () => {
  const { user } = useContext(Context);

  return (
    <RouterProvider router={router(user.isAuth)}>
      <Outlet />
    </RouterProvider>
  );
}

export default AppRouterProvider;
