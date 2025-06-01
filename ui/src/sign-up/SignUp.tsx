import Cookies from "js-cookie";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { postSignUp } from "../api-service";
import { useRootContext } from '../Root';

function SignIn() {
  const { dispatch, state } = useRootContext();

  const navigate = useNavigate();

  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (state.user) {
      navigate('/');
    }
    emailRef.current?.focus();
  }, []);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const res = await postSignUp(email, password);
    if (res.ok) {
      dispatch({ type: 'SET_USER', data: Cookies.get('user') });
      navigate('/');
    }
  }

  return (
    <div className="center">
      <h1 className="mt-0">Sign Up</h1>
      <form className="form" onSubmit={ submit }>
        <input
          ref={ emailRef }
          autoComplete="on"
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required={ true }
          type="email"
          value={ email }
        />
        <input
          ref={ passwordRef }
          autoComplete="on"
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required={ true }
          type="password"
          value={ password }
        />
        <input
          ref={ confirmPasswordRef }
          autoComplete="on"
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm Password"
          required={ true }
          type="password"
          value={ confirmPassword }
        />
        <button className="btn btn-pill" type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default SignIn;
