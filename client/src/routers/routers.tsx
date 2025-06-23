import React, { ReactElement } from "react";
import { Navigate, useLocation, useRoutes } from "react-router-dom";
import {
  StartPage,
  RegistrationPage,
  ProfilePage,
  NoMatchPage,
  LoginPage,
  ErrorPage,
  SettingsPage,
} from "../pages";
import { RouteNames } from "./routeNames";
import { PrimaryLayout, ProfileLayout } from "../layouts";
import { useAppSelector } from "../store/useAppSelect";

type PrivateRouteProps = {
  children: ReactElement;
};

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { isLogin } = useAppSelector((state) => state.authState);
  const location = useLocation();
  const authPath = [RouteNames.LOGIN, RouteNames.REGISTRATION];
  const isExcludePath = authPath.includes(location.pathname as RouteNames);
  
  if (isLogin && isExcludePath) {
    return (
      <Navigate to={RouteNames.PROFILE} replace state={{ from: location }} />
    );
  } else if (!isLogin && !isExcludePath) {
    return <Navigate to={RouteNames.LOGIN} replace />;
  }

  return children;
};

type PublicRouteProps = {
  children: ReactElement;
};

export const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { isLogin } = useAppSelector((state) => state.authState);

  if (isLogin) {
    return <Navigate to={RouteNames.PROFILE} replace />;
  }

  return children;
};

export const Routers: React.FC = () => {
  const routes = useRoutes([
    {
      path: RouteNames.START,
      element: (
        <PublicRoute>
          <PrimaryLayout>
            <StartPage />
          </PrimaryLayout>
        </PublicRoute>
      ),
    },
    {
      path: RouteNames.LOGIN,
      element: (
        <PublicRoute>
          <PrimaryLayout>
            <LoginPage />
          </PrimaryLayout>
        </PublicRoute>
      ),
    },
    {
      path: RouteNames.REGISTRATION,
      element: (
        <PublicRoute>
          <PrimaryLayout>
            <RegistrationPage />
          </PrimaryLayout>
        </PublicRoute>
      ),
    },
    {
      element: (
        <PrivateRoute>
          <ProfileLayout />
        </PrivateRoute>
      ),
      children: [
        {
          path: RouteNames.PROFILE,
          element: <ProfilePage />,
        },
        {
          path: RouteNames.SETTINGS,
          element: <SettingsPage />,
        },
      ],
    },
    {
      path: RouteNames.ERROR,
      element: (
        <PrimaryLayout>
          <ErrorPage />
        </PrimaryLayout>
      ),
    },
    {
      path: RouteNames.NOMATCH,
      element: (
        <PrimaryLayout>
          <NoMatchPage />
        </PrimaryLayout>
      ),
    },
  ]);

  return routes;
};
