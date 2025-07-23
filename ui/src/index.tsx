import { enableMapSet } from "immer";
import React from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import App from "@/App";
import Error from "@/error/Error";
import Home from "@/home/Home";
import Podcast from "@/podcast/Podcast";
import Root from "@/Root";
import Settings from "@/settings/Settings";
import SignIn from "@/sign-in/SignIn";
import SignUp from "@/sign-up/SignUp";
import Subscribe from "@/subscribe/Subscribe";

import "@/index.css";

enableMapSet();

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
            path: "subscribe",
            element: <Subscribe />
          },
          {
            path: "podcasts/:podcastId",
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

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <div className="app">
      <RouterProvider router={router} />
    </div>
  </React.StrictMode>,
);
