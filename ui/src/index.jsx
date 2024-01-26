import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import Home from "./home/Home.jsx";
import Podcast from "./podcast/Podcast.jsx";
import Root from "./Root.jsx";
import Settings from "./settings/Settings.jsx";
import SignIn from "./sign-in/SignIn.jsx";
import SignUp from "./sign-up/SignUp.jsx";

import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/",
        element: <Home />
      },
      {
        path: "/settings",
        element: <Settings />
      },
      {
        path: "/sign-in",
        element: <SignIn />,
      },
      {
        path: "/sign-up",
        element: <SignUp />,
      },
      {
        path: "/subscriptions/:id",
        element: <Podcast />
      },
    ]
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <div className="app">
      <RouterProvider router={router} />
    </div>
  </React.StrictMode>,
);
