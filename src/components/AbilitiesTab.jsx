export default function AbilitiesTab({ phaseId, roster }) {
  const abilities = roster.unitAbilities || {};
  const hasAnyAbilities = roster.loaded && Object.keys(abilities).length > 0;

  if (!hasAnyAbilities) {
    return (
      <div className="abilities-empty">
        <p>Upload a <strong>.ros</strong> file on the setup screen to see unit abilities here.</p>
      </div>
    );
  }

  const entries = Object.entries(abilities)
    .map(([unitName, abs]) => ({
      unitName,
      abs: abs.filter(ab => ab.phases.includes(phaseId) || ab.phases.includes('any')),
    }))
    .filter(({ abs }) => abs.length > 0);

  if (!entries.length) {
    return <div className="abilities-empty"><p>No abilities for this phase.</p></div>;
  }

  return (
    <div className="abilities-tab">
      {entries.map(({ unitName, abs }) => (
        <div key={unitName} className="abilities-unit-group">
          <div className="abilities-unit-name">{unitName}</div>
          {abs.map(ab => (
            <div key={ab.name} className="ability-row">
              <span className="ability-name">{ab.name}</span>
              <p className="ability-text">{ab.text}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
