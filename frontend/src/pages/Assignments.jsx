import { useEffect, useState } from "react";
import { assetApi, assignmentApi, authApi, getErrorMessage } from "../services/api.js";

export default function Assignments() {
  const [assignments, setAssignments] = useState([]);
  const [assets, setAssets] = useState([]);
  const [profile, setProfile] = useState(null);
  const [assetId, setAssetId] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadData() {
    setLoading(true);
    try {
      const [assignmentResult, assetResult, profileResult] = await Promise.all([
        assignmentApi.list(),
        assetApi.list(),
        authApi.profile(),
      ]);
      setAssignments(assignmentResult.assignments || []);
      setAssets(assetResult.assets || []);
      setProfile(profileResult);
      setError("");
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadData(); }, []);

  async function assignAsset(event) {
    event.preventDefault();
    setError("");
    setNotice("");
    try {
      await assignmentApi.create({ asset: assetId, user: profile.id });
      setAssetId("");
      setNotice("Asset assigned to your account.");
      await loadData();
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    }
  }

  async function returnAsset(assignment) {
    setError("");
    setNotice("");
    try {
      await assignmentApi.returnAsset(assignment._id);
      setNotice("Asset returned successfully.");
      await loadData();
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    }
  }

  const availableAssets = assets.filter((asset) => asset.status === "AVAILABLE");

  return (
    <>
      <div className="page-heading">
        <div><p className="eyebrow">CHECKOUT & RETURNS</p><h1>Assignments</h1><p className="muted">See who has each asset and track returns.</p></div>
      </div>
      {error && <p className="alert alert-error" role="alert">{error}</p>}
      {notice && <p className="alert alert-success" role="status">{notice}</p>}
      <section className="panel form-panel">
        <div className="panel-heading"><div><h2>Assign an asset</h2><p>New assignments are made to your signed-in account.</p></div></div>
        <form className="assign-form" onSubmit={assignAsset}>
          <label>Available asset
            <select value={assetId} onChange={(event) => setAssetId(event.target.value)} required>
              <option value="">Select an asset</option>
              {availableAssets.map((asset) => <option key={asset._id} value={asset._id}>{asset.name} · {asset.serialNumber}</option>)}
            </select>
          </label>
          <label>Assign to
            <input value={profile ? `${profile.id} (your account)` : "Loading account..."} readOnly />
          </label>
          <button className="button button-primary" disabled={!profile || availableAssets.length === 0}>Assign asset</button>
        </form>
        {profile && <p className="form-hint">The API does not provide a user directory, so assignment is limited to the logged-in user.</p>}
        {availableAssets.length === 0 && <p className="form-hint">There are no available assets to assign.</p>}
      </section>
      <section className="panel table-panel">
        <div className="panel-heading"><div><h2>All assignments</h2><p>{assignments.length} assignment{assignments.length === 1 ? "" : "s"}</p></div></div>
        {loading ? <p className="empty-state">Loading assignments...</p> : assignments.length === 0 ? (
          <p className="empty-state">No assignments found.</p>
        ) : (
          <div className="table-scroll">
            <table>
              <thead><tr><th>Asset</th><th>User</th><th>Assignment date</th><th>Return date</th><th>Status</th><th>Action</th></tr></thead>
              <tbody>
                {assignments.map((assignment) => (
                  <tr key={assignment._id}>
                    <td className="strong-cell">{assignment.asset?.name || "Asset not available"}</td>
                    <td>{assignment.user?.name || assignment.user?.email || "User not available"}</td>
                    <td>{assignment.assignedAt ? new Date(assignment.assignedAt).toLocaleDateString() : "—"}</td>
                    <td>{assignment.returnedAt ? new Date(assignment.returnedAt).toLocaleDateString() : "—"}</td>
                    <td><span className={`status status-${assignment.status?.toLowerCase()}`}>{assignment.status}</span></td>
                    <td>{assignment.status === "ASSIGNED" && <button className="button button-small button-outline" onClick={() => returnAsset(assignment)}>Return</button>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
