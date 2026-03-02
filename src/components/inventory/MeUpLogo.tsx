const MeUpLogo = ({ className = "h-8" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <text x="0" y="30" fontFamily="'DM Sans', sans-serif" fontWeight="800" fontSize="28" fill="hsl(222, 47%, 11%)">
      Me
    </text>
    <text x="42" y="30" fontFamily="'DM Sans', sans-serif" fontWeight="800" fontSize="28" fill="hsl(217, 91%, 60%)">
      Up
    </text>
  </svg>
);

export default MeUpLogo;
