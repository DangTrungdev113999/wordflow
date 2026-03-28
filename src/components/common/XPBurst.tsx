import Lottie from 'lottie-react';
import xpStarAnim from '../../assets/lottie/xp-star.json';

interface XPBurstProps {
  show: boolean;
}

export function XPBurst({ show }: XPBurstProps) {
  if (!show) return null;
  return (
    <div className="absolute -top-4 right-2 pointer-events-none">
      <Lottie
        animationData={xpStarAnim}
        loop={false}
        className="w-16 h-16"
      />
    </div>
  );
}
