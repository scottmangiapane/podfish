import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { postSignIn, postSignUp } from "@/api-service";
import { useRootContext } from '@/contexts/RootContext';

function Auth({ type }: { type: 'sign-in' | 'sign-up' }) {
  const navigate = useNavigate();
  const { dispatch, state } = useRootContext();

  const emailRef = useRef<HTMLInputElement>(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(
    localStorage.getItem('remember_me') === 'true' || false
  );

  useEffect(() => {
    if (state.user) {
      navigate('/');
    }
    emailRef.current?.focus();
  }, []);

  async function onSubmit() {
    let res;
    if (type === 'sign-in') {
      res = await postSignIn(email, password, rememberMe);
    } else {
      res = await postSignUp(email, password);
    }
    if (res.ok && res.data?.userId) {
      localStorage.setItem('user_id', res.data.userId);
      localStorage.setItem('remember_me', '' + rememberMe);
      dispatch({ type: 'SET_USER', data: localStorage.getItem('user_id') });
      navigate('/');
    }
  }

  const title = (type === 'sign-in') ? 'Sign In' : 'Sign Up';
  const confirmPasswordInput = (
    <input
      autoComplete="on"
      name="confirmPassword"
      onChange={ (event) => setConfirmPassword(event.target.value) }
      placeholder="Confirm Password"
      required={ true }
      type="password"
      value={ confirmPassword }
    />
  );
  let submitBtn;
  if (type === 'sign-in') {
    submitBtn = (
      <button className="btn btn-pill" type="submit">{ title }</button>
    );
  } else {
    submitBtn = (
      <button
        className="btn btn-pill"
        disabled={ password !== confirmPassword }
        type="submit">
          { title }
      </button>
    );
  }

  return (
    <div className="center">
      <h1 className="mt-0">{ title }</h1>
      <form className="form" action={ onSubmit }>
        <input
          ref={ emailRef }
          autoComplete="on"
          name="email"
          onChange={ (event) => setEmail(event.target.value) }
          placeholder="Email"
          required={ true }
          type="email"
          value={ email }
        />
        <input
          autoComplete="on"
          name="password"
          onChange={ (event) => setPassword(event.target.value) }
          placeholder="Password"
          required={ true }
          type="password"
          value={ password }
        />
        { type === 'sign-up' && confirmPasswordInput }
        <label className="checkbox-label">
          <input
            checked={ rememberMe }
            defaultChecked={ rememberMe }
            name="remember-me"
            onChange={ (event) => setRememberMe(event.target.checked) }
            type="checkbox"
          />
          Remember me
        </label>
        { submitBtn }
      </form>
    </div>
  );
}

export default Auth;
