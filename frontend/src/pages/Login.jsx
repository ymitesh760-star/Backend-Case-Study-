import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { authApi, getErrorMessage } from "../services/api.js";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (localStorage.getItem("token")) return <Navigate to="/dashboard" replace />;

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await authApi.login(form);
      localStorage.setItem("token", result.token);
      localStorage.setItem("user", JSON.stringify(result.user));
      localStorage.setItem("loginAt", new Date().toISOString());
      navigate("/dashboard", { replace: true });
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-screen">
      <section className="auth-card">
        <div className="auth-brand"><span className="brand-mark">IT</span></div>
        <p className="eyebrow">COMPANY IT ASSET MANAGEMENT</p>
        <h1>Welcome back</h1>
        <p className="muted">Sign in to manage your company assets.</p>
        {error && <p className="alert alert-error" role="alert">{error}</p>}
        <form className="form-stack" onSubmit={handleSubmit}>
          <label>Email
            <input
              type="email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              placeholder="you@company.com"
              autoComplete="email"
              required
            />
          </label>
          <label>Password
            <input
              type="password"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />
          </label>
          <button className="button button-primary button-full" disabled={loading}>
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>
        <p className="auth-footer">Don’t have an account? <Link to="/register">Register</Link></p>
      </section>
    </main>
  );
}
