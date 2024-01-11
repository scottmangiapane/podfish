import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import Home from "./routes/Home.jsx";
import Podcast from "./routes/Podcast.jsx";
import Root from "./routes/Root.jsx";
import SignIn from "./routes/SignIn.jsx";
import SignUp from "./routes/SignUp.jsx";

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
        path: "/subscriptions/:id",
        element: <Podcast />
      },
      {
        path: "/sign-in",
        element: <SignIn />,
      },
      {
        path: "/sign-up",
        element: <SignUp />,
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
