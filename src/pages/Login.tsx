import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import meupLogo from "@/assets/logo-meup.png";

const Login = () => {
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  const canSubmit = !loading && email.length > 0 && pass.length > 0;

  const handleLogin = async () => {
    if (!canSubmit) return;
    const ok = await login(email, pass);
    if (ok) navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen bg-landing flex flex-col items-center justify-center p-5">
      <div className="mb-8 text-center">
        <div className="bg-card rounded-2xl px-6 py-3 inline-block mb-3 shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
          <img src={meupLogo} alt="MeUp" className="h-12" />
        </div>
        <div className="text-xs text-muted-foreground uppercase tracking-[0.1em]">Portal de Inventario</div>
      </div>

      <div className="bg-landing-card border border-landing-border rounded-[20px] p-9 w-full max-w-[400px] shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
        <h2 className="text-header-foreground text-xl font-extrabold mb-1.5 tracking-tight">Iniciar sesión</h2>
        <p className="text-muted-foreground text-[13px] mb-7">Ingresa con tus credenciales</p>

        <div className="mb-4">
          <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">
            Correo electrónico
          </label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && canSubmit && handleLogin()}
            placeholder="tu@empresa.com"
            className="w-full px-3.5 py-2.5 bg-secondary border border-landing-border rounded-[10px] text-header-foreground text-sm font-sans outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground"
          />
        </div>

        <div className={error ? "mb-3.5" : "mb-6"}>
          <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">
            Contraseña
          </label>
          <input
            type="password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && canSubmit && handleLogin()}
            placeholder="••••••••"
            className="w-full px-3.5 py-2.5 bg-secondary border border-landing-border rounded-[10px] text-header-foreground text-sm font-sans outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground"
          />
        </div>

        {error && (
          <div className="text-xs text-destructive mb-4 px-3 py-2 bg-destructive/10 rounded-lg">
            ⚠️ {error}
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
      </div>
      <div className="mt-5 text-[11px] text-muted-foreground">¿Necesitas acceso? Contacta a tu asesor MeUp.</div>
    </div>
  );
};

export default Login;
