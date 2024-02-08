import Cookies from "js-cookie";
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { postSignIn } from "../api-service";
import { RootContext } from '../Root';

function SignIn() {
  const { dispatch, state } = useContext(RootContext);

  const navigate = useNavigate();
  if (state.user) {
    navigate('/');
  }

  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    emailRef.current.focus();
  }, []);

  async function submit(event) {
    event.preventDefault();

    const res = await postSignIn(email, password);
    if (res.ok) {
      dispatch({ type: 'SET_USER', data: Cookies.get('user') });
      navigate('/');
    }
  }

  return (
    <div className="center">
      <h1 className="mt-0">Sign In</h1>
      <form className="form" onSubmit={ submit }>
        <input
          ref={ emailRef }
          autoComplete="on"
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required="required"
          type="email"
          value={ email }
        />
        <input
          ref={ passwordRef }
          autoComplete="on"
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required="required"
          type="password"
          value={ password }
        />
        <label className="checkbox-label">
          <input type="checkbox" v-model="rememberEmail" />
          Remember me
        </label>
        <button className="btn btn-pill" type="submit">Sign In</button>
      </form>
    </div>
  );
}

export default SignIn;
