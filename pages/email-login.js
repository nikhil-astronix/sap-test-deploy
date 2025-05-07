// stenf 
import { useState } from 'react';
import axios from 'axios';

export default function EmailLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [session, setSession] = useState('');
  const [step, setStep] = useState('login'); // 'login' | 'new-password'
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await axios.post('http://localhost:3000/auth/email-login', {
        email,
        password,
      });

      if (res.data.status === 'NEW_PASSWORD_REQUIRED') {
        setSession(res.data.session);
        setStep('new-password');
        setMessage('New password required.');
        return;
      }

      // Successful login
      if (res.data.status === 'SUCCESS') {
        console.log("Tokens:", res.data);
        setMessage(`Login successful! You're in: ${res.data.groups?.join(', ')}`);
      }
     


    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.detail || "Login failed. Check your credentials.");
    }
  };

  const handleNewPassword = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await axios.post('http://localhost:3000/auth/respond-new-password', {
        email,
        new_password: newPassword,
        session
      });

      console.log("Tokens:", res.data);
      setMessage('Password updated. You are now logged in!');
      setStep('done');

    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.detail || 'Password update failed.');
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h2>Login with Email</h2>

      {step === 'login' && (
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          /><br /><br />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          /><br /><br />
          <button type="submit">Login</button>
        </form>
      )}

      {step === 'new-password' && (
        <form onSubmit={handleNewPassword}>
          <p>New password required for {email}</p>
          <input
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            required
          /><br /><br />
          <button type="submit">Set New Password</button>
        </form>
      )}

      {step === 'done' && (
        <p>✅ All done! You can close this tab or continue using the app.</p>
      )}

      <p>{message}</p>
    </div>
  );
}
