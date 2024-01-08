import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';

import Home from './routes/home.jsx';
import Root from './routes/root.jsx';
import SignIn from './routes/sign-in.jsx';

import './index.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "sign-in",
        element: <SignIn />,
      },
    ]
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
