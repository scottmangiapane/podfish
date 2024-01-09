import { Outlet } from "react-router-dom";

import Titlebar from "../Titlebar";

function Root() {
  return (
    <>
      <Titlebar />
      <div className="app-content">
        <div className="app-body">
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default Root;
