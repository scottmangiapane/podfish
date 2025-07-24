import { Link } from "react-router-dom";

import { useRootContext } from "@/contexts/RootContext";

import "@/components/TitleBar.css";

function TitleBar() {
  const { state } = useRootContext();

  let authButtons = (
    <>
      <Link className="title-bar-item mr-3" to={"/sign-up"}>Sign Up</Link>
      <Link className="title-bar-item" to={"/sign-in"}>
        <button className="btn btn-pill">Sign In</button>
      </Link>
    </>
  );

  if (state.user) {
    authButtons = (
      <Link className="title-bar-item" to={"/settings"}>
        <button className="btn btn-pill">Settings</button>
      </Link>
    );
  }

  return (
    <div className="title-bar">
      <Link className="title-bar-item" to={"/"}>
        <img className="title-bar-logo" src="/logo.svg" />
      </Link>
      { authButtons }
    </div>
  )
}

export default TitleBar;
