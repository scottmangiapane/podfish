import Cookies from "js-cookie";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { postSignUp } from "@/api-service";
import { useRootContext } from '@/contexts/RootContext';

// TODO can this be merged with SignIn?
function SignUp() {
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

    const res = await postSignUp(email, password);
    if (res.ok && res.data?.userId) {
      localStorage.setItem('user_id', res.data.userId);
      dispatch({ type: 'SET_USER', data: localStorage.getItem('user_id') });
      navigate('/');
    }
  }

  return (
    <div className="center">
      <h1 className="mt-0">Sign Up</h1>
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
        {/* TODO validate confirm password input */}
        <input
          autoComplete="on"
          name="confirmPassword"
          placeholder="Confirm Password"
          required={ true }
          type="password"
        />
        <button className="btn btn-pill" type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default SignUp;
