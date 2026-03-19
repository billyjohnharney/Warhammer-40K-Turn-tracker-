import { useEffect, useRef, useState } from 'react';

export default function SplashScreen({ onDismiss }) {
  const [fadingOut, setFadingOut] = useState(false);
  const dismissed = useRef(false);

  const dismiss = () => {
    if (dismissed.current) return;
    dismissed.current = true;
    setFadingOut(true);
  };

  useEffect(() => {
    const timer = setTimeout(dismiss, 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleAnimationEnd = () => {
    if (fadingOut) onDismiss();
  };

  return (
    <div
      className={`splash-screen${fadingOut ? ' fading-out' : ''}`}
      onClick={dismiss}
      onAnimationEnd={handleAnimationEnd}
    >
      <img src="/warhammer-icon.svg" alt="" className="splash-icon" />
      <div className="splash-logo">Tacticum</div>
      <div className="splash-rule" />
      <div className="splash-subtitle">The rule of engagement</div>
      <div className="splash-cta">Tap to begin</div>
    </div>
  );
}
