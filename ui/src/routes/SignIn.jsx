import { useEffect, useRef, useState } from "react";

import "./SignIn.css";

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  useEffect(() => {
    emailRef.current.focus();
  }, []);

  async function submit(event) {
    event.preventDefault();

    const res = await fetch('/api/v1/auth/sign-in', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    })

    console.log(res);
  }

  return (
    <div className="center">
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
