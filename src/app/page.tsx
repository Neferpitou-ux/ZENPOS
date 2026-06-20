"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [activeBranch, setActiveBranch] = useState(0);

  // Simulate subtle branch indicator animation
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveBranch((prev) => (prev + 1) % 14);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic to handle login, connect to Supabase later
    console.log("Logging in with:", email, password);
  };

  return (
    <>
      <div className="bg-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>
      
      <main className="container">
        <section className="left-panel">
          <div className="brand">
            <div className="brand-icon">Z</div>
            <div className="brand-text">ZENPOS</div>
          </div>
          
          <div className="hero-content">
            <h1 className="hero-title">Elevate Your Operations</h1>
            <p className="hero-subtitle">
              The next-generation Cloud POS & Inventory Management system designed exclusively for FEE Massage Group. Unify your 14 branches with real-time insights and unparalleled security.
            </p>
            
            <div className="features">
              <div className="feature-item">
                <span className="feature-icon">✦</span>
                <span>Centralized Branch Management</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">✦</span>
                <span>Real-Time Inventory Tracking</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">✦</span>
                <span>Smart Expired Product Alerts</span>
              </div>
            </div>
          </div>
        </section>

        <section className="right-panel">
          <div className="glass-card">
            <div className="login-header">
              <h2 className="login-title">Welcome Back</h2>
              <p className="login-desc">Sign in to access your dashboard</p>
            </div>
            
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label className="form-label" htmlFor="email">Email Address</label>
                <input 
                  type="email" 
                  id="email" 
                  className="form-input" 
                  placeholder="name@feemassage.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>
              
              <div className="form-group">
                <label className="form-label" htmlFor="password">Password</label>
                <input 
                  type="password" 
                  id="password" 
                  className="form-input" 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
              </div>
              
              <div className="form-options">
                <label className="checkbox-label">
                  <input type="checkbox" className="checkbox-input" />
                  <div className="checkbox-custom"></div>
                  Remember me
                </label>
                <a href="#" className="forgot-link">Forgot Password?</a>
              </div>
              
              <button type="submit" className="btn-primary">
                Sign In to ZENPOS
              </button>
            </form>

            <div className="branch-indicator" title="Connecting 14 Branches">
              {Array.from({ length: 14 }).map((_, i) => (
                <div 
                  key={i} 
                  className={`branch-dot ${i === activeBranch ? 'active' : ''}`}
                ></div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
