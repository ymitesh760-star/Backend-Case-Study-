import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { authApi, getErrorMessage } from "../services/api.js";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "EMPLOYEE" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  if (localStorage.getItem("token")) return <Navigate to="/dashboard" replace />;

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      await authApi.register(form);
      setSuccess("Account registered successfully. The current backend assigns new accounts the EMPLOYEE role.");
      window.setTimeout(() => navigate("/login", { replace: true }), 1400);
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
        <h1>Create your account</h1>
        <p className="muted">Register to access the asset management system.</p>
        {error && <p className="alert alert-error" role="alert">{error}</p>}
        {success && <p className="alert alert-success" role="status">{success}</p>}
        <form className="form-stack" onSubmit={handleSubmit}>
          <label>Name
            <input
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              autoComplete="name"
              required
            />
          </label>
          <label>Email
            <input
              type="email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              autoComplete="email"
              required
            />
          </label>
          <label>Password
            <input
              type="password"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              autoComplete="new-password"
              required
            />
          </label>
          <label>Role
            <select value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })}>
              <option value="EMPLOYEE">EMPLOYEE</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </label>
          <button className="button button-primary button-full" disabled={loading}>
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>
        <p className="auth-footer">Already registered? <Link to="/login">Login</Link></p>
      </section>
    </main>
  );
}
