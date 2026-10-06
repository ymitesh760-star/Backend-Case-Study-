export default function AssetCard({ asset, actions }) {
  return (
    <tr>
      <td className="strong-cell">{asset.name}</td>
      <td>{asset.category}</td>
      <td>{asset.serialNumber}</td>
      <td><span className={`status status-${asset.status?.toLowerCase()}`}>{asset.status}</span></td>
      <td className="table-actions">{actions}</td>
    </tr>
  );
}
