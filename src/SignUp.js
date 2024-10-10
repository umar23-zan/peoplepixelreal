// SignUp.js
import React, { useState } from 'react';
import { signUp } from './authService';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      await signUp(email, password);
      // Redirect or show success message
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSignUp}>
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
      <button type="submit">Sign Up</button>
    </form>
  );
};

export default SignUp;
