import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { postSignIn } from "@/api-service";
import { useRootContext } from "@/contexts/RootContext";

function SignIn() {
  const navigate = useNavigate();
  const { dispatch, state } = useRootContext();

  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state.user) {
      navigate('/');
    }
    emailRef.current?.focus();
  }, []);

  async function submit(formData: FormData) {
    const email = formData.get('email')?.toString() || '';
    const password = formData.get('password')?.toString() || '';
    const rememberMe = formData.get('remember-me')?.toString() === 'on';
    const res = await postSignIn(email, password, rememberMe);
    if (res.ok && res.data?.userId) {
      localStorage.setItem('user_id', res.data.userId);
      localStorage.setItem('remember_me', rememberMe.toString());
      dispatch({ type: 'SET_USER', data: localStorage.getItem('user_id') });
      navigate('/');
    }
  }

  return (
    <div className="center">
      <h1 className="mt-0">Sign In</h1>
      <form className="form" action={ submit }>
        <input
          ref={ emailRef }
          autoComplete="on"
          name="email"
          placeholder="Email"
          required={ true }
          type="email"
        />
        <input
          autoComplete="on"
          name="password"
          placeholder="Password"
          required={ true }
          type="password"
        />
        <label className="checkbox-label">
          <input
            defaultChecked={ localStorage.getItem('remember_me') === 'true' }
            name="remember-me"
            type="checkbox"
          />
          Remember me
        </label>
        <button className="btn btn-pill" type="submit">Sign In</button>
      </form>
    </div>
  );
}

export default SignIn;
