import { ESTADO_COLORS } from "@/data/products";

interface EstadoBadgeProps {
  estado: string | null;
}

const EstadoBadge = ({ estado }: EstadoBadgeProps) => {
  if (!estado) return null;
  const s = ESTADO_COLORS[estado] || { bg: "hsl(var(--accent))", color: "hsl(var(--muted-foreground))", icon: "⚪" };
  return (
    <span
      className="text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider whitespace-nowrap inline-block"
      style={{ backgroundColor: s.bg, color: s.color }}
    >
      {s.icon} {estado}
    </span>
  );
};

export default EstadoBadge;
