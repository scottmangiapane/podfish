import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import Error from "./error/Error";
import Home from "./home/Home";
import Podcast from "./podcast/Podcast";
import App from "./App";
import Root from "./Root";
import Settings from "./settings/Settings";
import SignIn from "./sign-in/SignIn";
import SignUp from "./sign-up/SignUp";

import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <Error />,
    children: [
      {
        path: "/",
        element: <App />,
        children: [
          {
            path: "/",
            element: <Home />
          },
          {
            path: "settings",
            element: <Settings />
          },
          {
            path: "podcasts/:id",
            element: <Podcast />
          }
        ]
      },
      {
        path: "sign-in",
        element: <SignIn />,
        errorElement: <Error />
      },
      {
        path: "sign-up",
        element: <SignUp />,
        errorElement: <Error />
      }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <div className="app">
      <RouterProvider router={router} />
    </div>
  </React.StrictMode>,
);
