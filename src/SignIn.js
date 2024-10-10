// SignIn.js
import React, { useState } from 'react';
import { signIn } from './authService';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      await signIn(email, password);
      // Redirect or show success message
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSignIn}>
      <input 
        type="email" 
        placeholder="Email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
      />
      <input 
        type="password" 
        placeholder="Password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
      />
      <button type="submit">Sign In</button>
    </form>
  );
};

export default SignIn;
