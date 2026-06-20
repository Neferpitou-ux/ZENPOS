"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMsg(error.message);
      } else {
        console.log("Login successful!", data);
        // TODO: Redirect to dashboard based on role/branch
        alert("Login successful!");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
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
              {errorMsg && (
                <div style={{ color: "var(--error)", marginBottom: "1rem", fontSize: "0.9rem", textAlign: "center", background: "rgba(239, 68, 68, 0.1)", padding: "0.5rem", borderRadius: "8px" }}>
                  {errorMsg}
                </div>
              )}
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
              
              <button type="submit" className="btn-primary" disabled={isLoading}>
                {isLoading ? "Signing In..." : "Sign In to ZENPOS"}
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
