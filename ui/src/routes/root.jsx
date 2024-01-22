import { Outlet } from "react-router-dom";

import Playbar from "../Playbar";
import Titlebar from "../Titlebar";

function Root() {
  return (
    <>
      <Titlebar />
      <div className="app-body">
        <div className="app-content">
          <Outlet />
        </div>
      </div>
      <Playbar />
    </>
  );
}

export default Root;
