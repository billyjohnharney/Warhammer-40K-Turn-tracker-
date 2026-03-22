export default function OptionsScreen({ onQuickStart, onBuildBattle }) {
  return (
    <main className="options-screen">
      <img src={`${import.meta.env.BASE_URL}IMG_8702.png`} alt="" className="setup-logo" />
      <div className="options-cards">
        <button className="options-card" onClick={onBuildBattle}>
          <span className="options-card-title">Build your Battle</span>
          <span className="options-card-desc">Choose your battle size and mission to forge your campaign.</span>
        </button>
        <button className="options-card" onClick={onQuickStart}>
          <span className="options-card-title">Quick Start</span>
          <span className="options-card-desc">Jump straight into army selection and get to battle fast.</span>
        </button>
      </div>
    </main>
  );
}
