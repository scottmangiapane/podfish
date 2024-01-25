import { useContext } from "react";
import { Link } from "react-router-dom";

import { RootContext } from './Root';

import "./Titlebar.css";

function Titlebar() {
  const { state } = useContext(RootContext);

  let authButtons = (
    <div>
      <Link className="titlebar-item mr-3" to={"/sign-up"}>Sign Up</Link>
      <Link className="titlebar-item" to={"/sign-in"}>
        <button className="btn btn-pill">Sign In</button>
      </Link>
    </div>
  );

  if (state.user) {
    authButtons = (
      <div>
        <button className="btn btn-pill" to={"/"}>Settings</button>
      </div>
    );
  }

  return (
    <div className="app-content titlebar">
      <Link className="titlebar-item" to={"/"}>Podfish</Link>
      { authButtons }
    </div>
  )
}

export default Titlebar;
