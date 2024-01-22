import Cookies from "js-cookie";
import { Link } from "react-router-dom";

import "./Titlebar.css";

function Titlebar() {
  let authButtons = (
    <div>
      <Link className="titlebar-item mr-3" to={`/sign-up`}>Sign Up</Link>
      <Link className="titlebar-item" to={`/sign-in`}>
        <button className="btn btn-pill">Sign In</button>
      </Link>
    </div>
  );

  if (Cookies.get('user')) {
    authButtons = (
      <div>
        <button className="btn btn-pill" to={`/`}>Settings</button>
      </div>
    );
  }

  return (
    <div className="app-content titlebar">
      <Link className="titlebar-item" to={`/`}>Podfish</Link>
      { authButtons }
    </div>
  )
}

export default Titlebar;
