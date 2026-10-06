import { useEffect, useState } from "react";
import { authApi, getErrorMessage } from "../services/api.js";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const loginAt = localStorage.getItem("loginAt");

  useEffect(() => {
    async function loadProfile() {
      try {
        setProfile(await authApi.profile());
      } catch (requestError) {
        setError(getErrorMessage(requestError));
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  return (
    <>
      <div className="page-heading"><div><p className="eyebrow">ACCOUNT</p><h1>Profile</h1><p className="muted">Your account and current session information.</p></div></div>
      {error && <p className="alert alert-error" role="alert">{error}</p>}
      <section className="panel profile-panel">
        {loading ? <p className="empty-state">Loading profile...</p> : profile && (
          <>
            <div className="profile-avatar">{(user.name || "U").charAt(0).toUpperCase()}</div>
            <h2>{user.name || "Account"}</h2>
            <p className="muted">{user.email || "Signed-in user"}</p>
            <dl className="detail-list profile-details">
              <dt>User ID</dt><dd className="wrap-text">{profile.id}</dd>
              <dt>Role</dt><dd><span className="status status-available">{profile.role}</span></dd>
              <dt>Session started</dt><dd>{loginAt ? new Date(loginAt).toLocaleString() : "Current browser session"}</dd>
              <dt>Authentication</dt><dd>JWT Bearer token stored in this browser</dd>
            </dl>
          </>
        )}
      </section>
    </>
  );
}
