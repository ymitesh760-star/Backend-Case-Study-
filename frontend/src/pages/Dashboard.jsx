import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { assetApi, assignmentApi, getErrorMessage } from "../services/api.js";

export default function Dashboard() {
  const [assets, setAssets] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [error, setError] = useState("");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    async function loadSummary() {
      try {
        const [assetResult, assignmentResult] = await Promise.all([
          assetApi.list(),
          assignmentApi.list(),
        ]);
        setAssets(assetResult.assets || []);
        setAssignments(assignmentResult.assignments || []);
      } catch (requestError) {
        setError(getErrorMessage(requestError));
      }
    }
    loadSummary();
  }, []);

  const stats = [
    { label: "Total assets", value: assets.length, tone: "blue" },
    { label: "Available assets", value: assets.filter((asset) => asset.status === "AVAILABLE").length, tone: "green" },
    { label: "Assigned assets", value: assets.filter((asset) => asset.status === "ASSIGNED").length, tone: "orange" },
    { label: "Total assignments", value: assignments.length, tone: "purple" },
  ];

  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">OVERVIEW</p>
          <h1>Good to see you, {user.name || "there"}</h1>
          <p className="muted">Here’s what’s happening with your company’s IT assets.</p>
        </div>
      </div>
      {error && <p className="alert alert-error" role="alert">{error}</p>}
      <section className="stats-grid" aria-label="Asset summary">
        {stats.map((stat) => (
          <article className="stat-card" key={stat.label}>
            <span className={`stat-icon icon-${stat.tone}`} aria-hidden="true">{stat.label.slice(0, 1)}</span>
            <p>{stat.label}</p>
            <strong>{stat.value}</strong>
          </article>
        ))}
      </section>
      <section className="welcome-panel">
        <div>
          <p className="eyebrow">ASSET MANAGEMENT</p>
          <h2>Everything in its right place.</h2>
          <p>Review equipment, keep track of assignments, and see what needs attention.</p>
        </div>
        <div className="welcome-actions">
          <Link className="button button-primary" to="/assets">Browse assets</Link>
          <Link className="button button-outline" to="/assignments">View assignments</Link>
        </div>
      </section>
    </>
  );
}
