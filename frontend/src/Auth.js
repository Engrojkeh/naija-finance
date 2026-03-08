import React, { useState } from 'react';
import api from './services/api';

// ==========================================
// 3D ISOMETRIC/GLASS LOGO FOR AUTH
// ==========================================
const ModernLogo3D = () => (
  <svg className="isometric-logo" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" width="80" height="80">
    <path d="M50 10 L85 30 L50 50 L15 30 Z" fill="url(#top_grad)" />
    <path d="M15 30 L50 50 L50 90 L15 70 Z" fill="url(#left_grad)" />
    <path d="M85 30 L50 50 L50 90 L85 70 Z" fill="url(#right_grad)" />

    <path d="M50 0 L90 23 L50 45 L10 23 Z" fill="rgba(255,255,255,0.4)" style={{ transform: 'translateY(-15px)', filter: 'blur(2px)' }} />

    <defs>
      <linearGradient id="top_grad" x1="15" y1="10" x2="85" y2="50" gradientUnits="userSpaceOnUse">
        <stop stopColor="#f97316" />
        <stop offset="1" stopColor="#ea580c" />
      </linearGradient>
      <linearGradient id="left_grad" x1="15" y1="30" x2="50" y2="90" gradientUnits="userSpaceOnUse">
        <stop stopColor="#0f172a" />
        <stop offset="1" stopColor="#1e293b" />
      </linearGradient>
      <linearGradient id="right_grad" x1="50" y1="50" x2="85" y2="90" gradientUnits="userSpaceOnUse">
        <stop stopColor="#334155" />
        <stop offset="1" stopColor="#020617" />
      </linearGradient>
    </defs>
  </svg>
);

function Auth({ onLogin }) {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('Processing...');
    try {
      if (isLoginMode) {
        const response = await api.post('/login', { email, password });
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        onLogin(response.data.user);
      } else {
        const response = await api.post('/register', { name, email, password });
        setMessage(response.data.message);
        setIsLoginMode(true);
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setMessage(error.response.data.error);
      } else {
        setMessage("Server error.");
      }
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card glass-panel-3d anim-pop">
        <div className="auth-logo-wrap">
          <ModernLogo3D />
        </div>

        <h1 className="auth-title">
          {isLoginMode ? 'Welcome back' : 'Create Account'}
        </h1>

        {message && <div className="auth-alert">{message}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLoginMode && (
            <input type="text" placeholder="Full Name" className="input-3d" value={name} onChange={(e) => setName(e.target.value)} required />
          )}
          <input type="email" placeholder="Email Address" className="input-3d" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" className="input-3d" value={password} onChange={(e) => setPassword(e.target.value)} required />

          <button type="submit" className="btn-3d-primary">
            {isLoginMode ? 'Sign In' : 'Get Started'}
          </button>
        </form>

        <button type="button" className="btn-3d-outline" onClick={() => setIsLoginMode(!isLoginMode)}>
          {isLoginMode ? "Don't have an account? Sign up" : "Back to sign in"}
        </button>
      </div>
    </div>
  );
}

export default Auth;