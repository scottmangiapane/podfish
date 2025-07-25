import Cookies from "js-cookie";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { postSignOut } from "@/api-service";
import { useRootContext } from "@/contexts/RootContext";
import AccountCircle from "@/symbols/AccountCircle";

import "@/components/TitleBar.css";

function TitleBar() {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const { dispatch, state } = useRootContext();

  async function search() {
    // TODO
  }

  async function signOut() {
    const res = await postSignOut();
    if (res.ok) {
      dispatch({ type: 'SET_USER', data: Cookies.get('user') || null });
      navigate('/sign-in');
    }
  }

  let actionButtons = (
    <div className="title-bar-item-row">
      <Link className="title-bar-item mr-3" to={"/sign-up"}>Sign Up</Link>
      <Link className="title-bar-item" to={"/sign-in"}>
        <button className="btn btn-pill">Sign In</button>
      </Link>
    </div>
  );

  if (state.user) {
    actionButtons = (
      <div className="title-bar-item-row">
        <form className="form" action={ search }>
          <input
            // ref={ searchRef }
            // autoComplete="on"
            name="search"
            placeholder="Search"
            required={ true }
            type="text"
          />
        </form>
        <div className="title-bar-dropdown">
          <button
            className="btn title-bar-account-btn"
            onClick={ () => setShowDropdown(!showDropdown) }>
            <AccountCircle />
          </button>
          <div
            className="title-bar-dropdown-content"
            onClick={ () => setShowDropdown(false) }
            style={{ visibility: (showDropdown) ? "visible" : "hidden" }}>
            <Link className="title-bar-dropdown-item" to={"/settings"}>Settings</Link>
            <p className="title-bar-dropdown-item" onClick={ signOut }>Sign Out</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="title-bar">
      <Link className="title-bar-item" to={"/"}>
        <img className="title-bar-logo" src="/logo.svg" />
      </Link>
      { actionButtons }
    </div>
  )
}

export default TitleBar;
