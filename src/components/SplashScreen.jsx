import { useEffect, useRef, useState } from 'react';

const TEXT_FADE_MS = 800;
const LOGO_MOVE_MS = 900;

export default function SplashScreen({ onDismiss }) {
  const [phase, setPhase] = useState('idle'); // 'idle' | 'text-fade' | 'logo-move'
  const dismissed = useRef(false);

  const dismiss = () => {
    if (dismissed.current) return;
    dismissed.current = true;
    setPhase('text-fade');
    setTimeout(() => setPhase('logo-move'), TEXT_FADE_MS);
    setTimeout(() => onDismiss(), TEXT_FADE_MS + LOGO_MOVE_MS);
  };

  useEffect(() => {
    const timer = setTimeout(dismiss, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`splash-screen${phase !== 'idle' ? ' splash-screen--transitioning' : ''}`}
      onClick={dismiss}
    >
      <img
        src={`${import.meta.env.BASE_URL}IMG_8702.png`}
        alt=""
        className={`splash-icon${phase === 'logo-move' ? ' splash-icon--moving' : ''}`}
      />
      <div className={`splash-text-group${phase !== 'idle' ? ' splash-text-group--fading' : ''}`}>
        <div className="splash-logo">Tacticum</div>
        <div className="splash-rule" />
        <div className="splash-subtitle">The rule of engagement</div>
      </div>
    </div>
  );
}
