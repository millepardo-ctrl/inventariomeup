import { useState, useRef, useEffect, useCallback } from "react";
import { ArrowLeft, Send, Paperclip, X, RotateCcw } from "lucide-react";
import meupLogo from "@/assets/logo-meup.png";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface AsistenteViewProps {
  onBack: () => void;
}

interface Message {
  id: string;
  role: "user" | "bot";
  text: string;
  ts: Date;
  isPdf?: boolean;
  pdfName?: string;
}

type Step = "idle" | "awaiting_products" | "awaiting_confirm" | "done";

const BOT_WELCOME = `¡Hola! 👋 Soy tu asistente de cotización.

Para empezar, envíame los **datos del cliente** o arrastra el **RUT en PDF**.

Ejemplo: _Constructora ABC, NIT 900.123.456-1, contacto@abc.co, 3001234567, Medellín_`;

function renderMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/`(.*?)`/g, '<code class="bg-white/10 px-1 rounded text-xs font-mono text-[hsl(210,40%,98%)]">$1</code>')
    .replace(/_(.*?)_/g, "<em>$1</em>")
    .replace(/\n/g, "<br>");
}

export default function AsistenteView({ onBack }: AsistenteViewProps) {
  const { user } = useAuth();
  const sessionId = user?.email ?? "anonimo";

  const [messages, setMessages] = useState<Message[]>([
    { id: "welcome", role: "bot", text: BOT_WELCOME, ts: new Date() },
  ]);
  const [step, setStep] = useState<Step>("idle");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [pendingPdf, setPendingPdf] = useState<{ name: string; base64: string } | null>(null);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const addMessage = (msg: Omit<Message, "id" | "ts">) => {
    setMessages((prev) => [...prev, { ...msg, id: crypto.randomUUID(), ts: new Date() }]);
  };

  const sendToBot = useCallback(async (text: string, pdfBase64?: string, pdfName?: string) => {
    if (text.trim()) addMessage({ role: "user", text: text.trim() });
    else if (pdfName) addMessage({ role: "user", text: `📄 ${pdfName}`, isPdf: true, pdfName });

    setLoading(true);
    setInput("");
    setPendingPdf(null);

    try {
      const { data, error } = await supabase.functions.invoke("web-cotizador", {
        body: { session_id: sessionId, message: text, pdf_base64: pdfBase64 },
      });

      if (error) throw error;

      addMessage({ role: "bot", text: data.reply });
      setStep((data.step as Step) ?? "idle");
    } catch (err) {
      console.error(err);
      addMessage({ role: "bot", text: "❌ Error de conexión. Intenta de nuevo." });
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [sessionId]);

  const handleSend = () => {
    if (loading) return;
    if (pendingPdf) {
      sendToBot(input, pendingPdf.base64, pendingPdf.name);
    } else if (input.trim()) {
      sendToBot(input);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const handleReset = () => sendToBot("/cancelar");

  const readPdf = (file: File) => {
    if (file.type !== "application/pdf") {
      addMessage({ role: "bot", text: "⚠️ Solo se aceptan archivos PDF." });
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const base64 = (ev.target?.result as string).split(",")[1];
      setPendingPdf({ name: file.name, base64 });
      addMessage({ role: "user", text: `📄 ${file.name}`, isPdf: true, pdfName: file.name });
      sendToBot("", base64, file.name);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) readPdf(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) readPdf(file);
    e.target.value = "";
  };

  return (
    <div
      className="min-h-screen bg-[hsl(var(--landing-bg))] flex flex-col"
      onDragOver={(e) => { e.preventDefault(); if (step === "idle") setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
    >
      {/* Header */}
      <header className="bg-header sticky top-0 z-50 shadow-[0_1px_0_rgba(255,255,255,0.06)] h-[58px] flex items-center px-5 gap-4 flex-shrink-0">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-[9px] border border-secondary bg-transparent text-muted-foreground text-xs font-semibold hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Portal
        </button>
        <div className="bg-card rounded-lg px-2.5 py-1">
          <img src={meupLogo} alt="MeUp" className="h-7" />
        </div>
        <div className="h-7 w-px bg-secondary" />
        <span className="text-xs text-muted-foreground uppercase tracking-wider hidden sm:inline">
          Asistente de Cotización
        </span>
        <div className="flex-1" />
        {step !== "idle" && (
          <button
            onClick={handleReset}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-[9px] border border-secondary text-muted-foreground text-xs font-semibold hover:text-foreground transition-colors disabled:opacity-40"
          >
            <RotateCcw className="w-3 h-3" />
            Nueva cotización
          </button>
        )}
        <div className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border bg-[hsl(32,60%,14%)] text-[hsl(38,90%,68%)] border-[hsl(32,80%,28%)]">
          💬 IA
        </div>
      </header>

      {/* Drag overlay */}
      {dragging && (
        <div className="fixed inset-0 z-50 bg-primary/10 border-2 border-dashed border-primary flex items-center justify-center pointer-events-none">
          <div className="bg-[hsl(var(--landing-card))] border border-primary/50 rounded-2xl px-10 py-8 text-center">
            <div className="text-5xl mb-3">📄</div>
            <p className="text-lg font-bold text-primary">Suelta el RUT aquí</p>
            <p className="text-sm text-muted-foreground mt-1">PDF del cliente</p>
          </div>
        </div>
      )}

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-3 max-w-2xl w-full mx-auto">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            {msg.role === "bot" && (
              <div className="w-7 h-7 rounded-full bg-[hsl(32,80%,12%)] border border-[hsl(32,85%,35%)] flex items-center justify-center text-sm mr-2 mt-1 flex-shrink-0">
                💬
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground rounded-tr-sm"
                  : "bg-[hsl(var(--landing-card))] border border-[hsl(215,25%,22%)] text-[hsl(210,40%,98%)] rounded-tl-sm"
              }`}
            >
              {msg.role === "bot" ? (
                <span dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.text) }} />
              ) : (
                <span>{msg.text}</span>
              )}
              <div className={`text-[10px] mt-1.5 ${msg.role === "user" ? "text-primary-foreground/70" : "text-[hsl(215,20%,70%)]"}`}>
                {msg.ts.toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" })}
              </div>
            </div>
          </div>
        ))}

        {/* Loading bubble */}
        {loading && (
          <div className="flex justify-start">
            <div className="w-7 h-7 rounded-full bg-[hsl(32,80%,12%)] border border-[hsl(32,85%,35%)] flex items-center justify-center text-sm mr-2 mt-1 flex-shrink-0">
              💬
            </div>
            <div className="bg-[hsl(var(--landing-card))] border border-[hsl(215,25%,22%)] rounded-2xl rounded-tl-sm px-4 py-3">
              <div className="flex gap-1 items-center h-4">
                <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:0ms]" />
                <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:150ms]" />
                <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div className="flex-shrink-0 border-t border-[hsl(215,25%,16%)] bg-[hsl(222,41%,11%)] px-4 py-3">
        <div className="max-w-2xl mx-auto flex flex-col gap-2">

          {/* Confirm button */}
          {step === "awaiting_confirm" && !loading && (
            <button
              onClick={() => sendToBot("si")}
              className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:opacity-90 transition-opacity"
            >
              ✅ Confirmar cotización en Symphony
            </button>
          )}

          {/* PDF hint for idle step */}
          {step === "idle" && !loading && (
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed border-[hsl(215,25%,26%)] text-muted-foreground/60 text-xs cursor-pointer hover:border-primary/40 hover:text-muted-foreground transition-colors"
              onClick={() => fileRef.current?.click()}
            >
              <Paperclip className="w-3.5 h-3.5 flex-shrink-0" />
              Arrastra el RUT del cliente o haz clic para subir PDF
            </div>
          )}

          {/* Text input */}
          <div className="flex gap-2 items-end">
            {step === "idle" && (
              <button
                onClick={() => fileRef.current?.click()}
                disabled={loading}
                className="flex-shrink-0 w-9 h-9 rounded-xl bg-[hsl(215,25%,18%)] border border-[hsl(215,25%,24%)] text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center disabled:opacity-40"
              >
                <Paperclip className="w-4 h-4" />
              </button>
            )}
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              disabled={loading}
              rows={1}
              placeholder={
                step === "idle" ? "Escribe los datos del cliente..." :
                step === "awaiting_products" ? "Escribe los productos y cantidades..." :
                step === "awaiting_confirm" ? "O escribe tu respuesta..." :
                "Escribe un mensaje..."
              }
              className="flex-1 bg-[hsl(215,25%,18%)] border border-[hsl(215,25%,24%)] rounded-xl px-3.5 py-2.5 text-sm text-[hsl(210,40%,98%)] placeholder:text-[hsl(215,20%,62%)] resize-none focus:outline-none focus:border-primary/60 transition-colors disabled:opacity-50 max-h-[120px] leading-relaxed"
              style={{ minHeight: "42px" }}
            />
            <button
              onClick={handleSend}
              disabled={loading || (!input.trim() && !pendingPdf)}
              className="flex-shrink-0 w-9 h-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-30"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <input ref={fileRef} type="file" accept="application/pdf" className="hidden" onChange={handleFileInput} />
    </div>
  );
}
