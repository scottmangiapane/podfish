import { useEffect, useRef, useState } from "react";

import "./SignIn.css";

function SignIn() {
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const confirmPasswordRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  useEffect(() => {
    emailRef.current.focus();
  }, []);

  async function submit(event) {
    event.preventDefault();

    await fetch('/api/v1/auth/sign-up', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    })
  }

  return (
    <div className="center">
      <h1>Sign Up for Podfish</h1>
      <form onSubmit={ submit }>
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
        <input
          ref={ confirmPasswordRef }
          autoComplete="on"
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm Password"
          required="required"
          type="password"
          value={ confirmPassword }
        />
        <button className="btn btn-pill" type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default SignIn;
