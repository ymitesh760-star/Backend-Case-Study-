import { useEffect, useState } from "react";
import AssetCard from "../components/AssetCard.jsx";
import { assetApi, getErrorMessage } from "../services/api.js";

const emptyForm = { name: "", category: "", serialNumber: "", status: "AVAILABLE" };

export default function Assets() {
  const [assets, setAssets] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [viewingAsset, setViewingAsset] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadAssets() {
    setLoading(true);
    try {
      const result = await assetApi.list();
      setAssets(result.assets || []);
      setError("");
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadAssets(); }, []);

  async function createAsset(event) {
    event.preventDefault();
    setError("");
    setNotice("");
    try {
      await assetApi.create(form);
      setForm(emptyForm);
      setShowForm(false);
      setNotice("Asset added successfully.");
      await loadAssets();
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    }
  }

  async function viewAsset(id) {
    setError("");
    try {
      const asset = await assetApi.get(id);
      setViewingAsset(asset);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    }
  }

  async function deleteAsset(asset) {
    if (!window.confirm(`Delete "${asset.name}"?`)) return;
    setError("");
    setNotice("");
    try {
      await assetApi.remove(asset._id);
      setNotice("Asset deleted successfully.");
      await loadAssets();
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    }
  }

  return (
    <>
      <div className="page-heading">
        <div><p className="eyebrow">INVENTORY</p><h1>Assets</h1><p className="muted">Manage company equipment and availability.</p></div>
        <button className="button button-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Close form" : "+ Add asset"}
        </button>
      </div>
      {error && <p className="alert alert-error" role="alert">{error}</p>}
      {notice && <p className="alert alert-success" role="status">{notice}</p>}
      {showForm && (
        <section className="panel form-panel">
          <h2>Add an asset</h2>
          <form className="asset-form" onSubmit={createAsset}>
            <label>Asset name<input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required /></label>
            <label>Category<input value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} required /></label>
            <label>Serial number<input value={form.serialNumber} onChange={(event) => setForm({ ...form, serialNumber: event.target.value })} required /></label>
            <label>Status
              <select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}>
                <option value="AVAILABLE">AVAILABLE</option>
                <option value="ASSIGNED">ASSIGNED</option>
                <option value="MAINTENANCE">MAINTENANCE</option>
              </select>
            </label>
            <button className="button button-primary form-submit">Save asset</button>
          </form>
        </section>
      )}
      <section className="panel table-panel">
        <div className="panel-heading"><div><h2>All assets</h2><p>{assets.length} item{assets.length === 1 ? "" : "s"} in inventory</p></div></div>
        {loading ? <p className="empty-state">Loading assets...</p> : assets.length === 0 ? (
          <p className="empty-state">No assets found. Add your first asset to get started.</p>
        ) : (
          <div className="table-scroll">
            <table>
              <thead><tr><th>Name</th><th>Category</th><th>Serial number</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {assets.map((asset) => (
                  <AssetCard
                    key={asset._id}
                    asset={asset}
                    actions={
                      <>
                        <button className="text-button" onClick={() => viewAsset(asset._id)}>View</button>
                        <button className="text-button text-danger" onClick={() => deleteAsset(asset)}>Delete</button>
                      </>
                    }
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
      {viewingAsset && (
        <div className="modal-backdrop" role="presentation" onClick={() => setViewingAsset(null)}>
          <section className="modal-card" role="dialog" aria-modal="true" aria-labelledby="asset-title" onClick={(event) => event.stopPropagation()}>
            <button className="modal-close" aria-label="Close asset details" onClick={() => setViewingAsset(null)}>×</button>
            <p className="eyebrow">ASSET DETAILS</p>
            <h2 id="asset-title">{viewingAsset.name}</h2>
            <dl className="detail-list">
              <dt>Category</dt><dd>{viewingAsset.category}</dd>
              <dt>Serial number</dt><dd>{viewingAsset.serialNumber}</dd>
              <dt>Status</dt><dd>{viewingAsset.status}</dd>
              <dt>Asset ID</dt><dd className="wrap-text">{viewingAsset._id}</dd>
            </dl>
          </section>
        </div>
      )}
    </>
  );
}
