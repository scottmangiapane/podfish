import { Link } from "react-router-dom";

import "./Titlebar.css";

function Titlebar() {
  return (
    <div className="titlebar">
      <div className="app-content titlebar-content">
        <Link className="titlebar-item" to={`/`}>Podfish</Link>
        <div>
          <Link className="titlebar-item mr-3" to={`/sign-up`}>Sign Up</Link>
          <Link className="titlebar-item" to={`/sign-in`}>
            <button className="btn btn-pill">Sign In</button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Titlebar;
