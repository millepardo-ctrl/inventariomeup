import { useState } from "react";
import { AppUser, DIST_USERS } from "@/data/products";
import MeUpLogo from "@/components/inventory/MeUpLogo";

interface LoginScreenProps {
  onLogin: (user: AppUser) => void;
}

const LoginScreen = ({ onLogin }: LoginScreenProps) => {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setErr("");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const u = DIST_USERS[email.toLowerCase()];
      if (u && u.pass === pass) {
        onLogin({ type: "distribuidor", email: email.toLowerCase(), name: u.name, region: u.region });
      } else {
        setErr("Correo o contraseña incorrectos.");
      }
    }, 700);
  };

  const canSubmit = !loading && email && pass;

  return (
    <div className="min-h-screen bg-landing flex flex-col items-center justify-center p-5">
      <div className="mb-8 text-center">
        <div className="bg-card rounded-2xl px-6 py-3 inline-block mb-3 shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
          <MeUpLogo className="h-12" />
        </div>
        <div className="text-xs text-muted-foreground uppercase tracking-[0.1em]">Portal de Distribuidores</div>
      </div>

      <div className="bg-landing-card border border-landing-border rounded-[20px] p-9 w-full max-w-[400px] shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
        <h2 className="text-header-foreground text-xl font-extrabold mb-1.5 tracking-tight">Acceder al inventario</h2>
        <p className="text-muted-foreground text-[13px] mb-7">Ingresa con tus credenciales de distribuidor</p>

        <div className="mb-4">
          <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">
            Correo electrónico
          </label>
          <input
            value={email}
            onChange={e => { setEmail(e.target.value); setErr(""); }}
            onKeyDown={e => e.key === "Enter" && canSubmit && handleLogin()}
            placeholder="tu@empresa.com"
            className="w-full px-3.5 py-2.5 bg-secondary border border-landing-border rounded-[10px] text-header-foreground text-sm font-sans outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground"
          />
        </div>

        <div className={err ? "mb-3.5" : "mb-6"}>
          <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">
            Contraseña
          </label>
          <input
            type="password"
            value={pass}
            onChange={e => { setPass(e.target.value); setErr(""); }}
            onKeyDown={e => e.key === "Enter" && canSubmit && handleLogin()}
            placeholder="••••••••"
            className="w-full px-3.5 py-2.5 bg-secondary border border-landing-border rounded-[10px] text-header-foreground text-sm font-sans outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground"
          />
        </div>

        {err && (
          <div className="text-xs text-destructive mb-4 px-3 py-2 bg-destructive/10 rounded-lg">
            ⚠️ {err}
          </div>
        )}

        <button
          onClick={handleLogin}
          disabled={!canSubmit}
          className={`w-full py-3 rounded-xl text-sm font-bold tracking-wide transition-opacity ${
            canSubmit
              ? "bg-gradient-to-r from-primary to-cat-splitface text-primary-foreground cursor-pointer hover:opacity-90"
              : "bg-secondary text-muted-foreground cursor-not-allowed"
          }`}
        >
          {loading ? "Verificando..." : "Ingresar →"}
        </button>

        <div className="mt-5 p-3 bg-landing rounded-[10px] border border-landing-border">
          <div className="text-[11px] text-muted-foreground mb-1.5 font-semibold">💡 Credenciales de prueba:</div>
          <div className="text-[11px] text-muted-foreground font-mono leading-[1.8]">
            dist1@empresa.com / dist2026<br />
            ventas@marmoles.com / marmoles1
          </div>
        </div>
      </div>
      <div className="mt-5 text-[11px] text-muted-foreground">¿Necesitas acceso? Contacta a tu asesor MeUp.</div>
    </div>
  );
};

export default LoginScreen;
