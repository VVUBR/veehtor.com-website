import { useState, useEffect } from "react";

const BRAND = {
  black: "#1a1a1a",
  dark: "#232323",
  card: "#2c2c2c",
  amber: "#d4943a",
  amberLight: "#e8b96e",
  amberDark: "#a16f24",
  green: "#4caf50",
  red: "#e74c3c",
  white: "#f5f0e8",
  grey: "#888",
  greyLight: "#aaa",
};

interface ChecklistItem {
  id: number;
  label: string;
  requiresPhoto: boolean;
}

interface Checklist {
  id: string;
  title: string;
  icon: string;
  subtitle: string;
  items: ChecklistItem[];
}

const CHECKLISTS: Record<string, Checklist> = {
  bar_open: {
    id: "bar_open",
    title: "Abertura do Bar",
    icon: "🍺",
    subtitle: "Checklist diário de abertura",
    items: [
      { id: 1, label: "Balcão limpo e organizado", requiresPhoto: true },
      { id: 2, label: "Chopeiras ligadas e funcionando", requiresPhoto: true },
      { id: 3, label: "Geladeiras abastecidas", requiresPhoto: true },
      { id: 4, label: "Banheiros limpos e abastecidos", requiresPhoto: true },
      { id: 5, label: "Mesas e cadeiras arrumadas", requiresPhoto: true },
      { id: 6, label: "Cardápios em todas as mesas", requiresPhoto: false },
      { id: 7, label: "Som ambiente ligado", requiresPhoto: false },
    ],
  },
  bar_close: {
    id: "bar_close",
    title: "Fechamento do Bar",
    icon: "🔒",
    subtitle: "Checklist diário de fechamento",
    items: [
      { id: 1, label: "Balcão limpo e sem copos", requiresPhoto: true },
      { id: 2, label: "Chopeiras desligadas e limpas", requiresPhoto: true },
      { id: 3, label: "Cozinha limpa", requiresPhoto: true },
      { id: 4, label: "Lixo retirado", requiresPhoto: true },
      { id: 5, label: "Portas e janelas trancadas", requiresPhoto: true },
      { id: 6, label: "Luzes apagadas", requiresPhoto: false },
    ],
  },
  cabin: {
    id: "cabin",
    title: "Cabana — Check-in",
    icon: "🏡",
    subtitle: "Limpeza e preparação da cabana",
    items: [
      { id: 1, label: "Quarto — cama arrumada", requiresPhoto: true },
      { id: 2, label: "Quarto — armário vazio e limpo", requiresPhoto: true },
      { id: 3, label: "Banheiro — limpo e abastecido", requiresPhoto: true },
      { id: 4, label: "Cozinha — limpa e organizada", requiresPhoto: true },
      { id: 5, label: "Área externa — varrida e arrumada", requiresPhoto: true },
      { id: 6, label: "Kit boas-vindas posicionado", requiresPhoto: true },
      { id: 7, label: "Wi-Fi funcionando", requiresPhoto: false },
      { id: 8, label: "Ar-condicionado funcionando", requiresPhoto: false },
    ],
  },
  cabin_out: {
    id: "cabin_out",
    title: "Cabana — Check-out",
    icon: "🔑",
    subtitle: "Vistoria pós-saída do hóspede",
    items: [
      { id: 1, label: "Quarto — sem pertences do hóspede", requiresPhoto: true },
      { id: 2, label: "Roupa de cama retirada", requiresPhoto: true },
      { id: 3, label: "Banheiro — sem pertences, toalhas recolhidas", requiresPhoto: true },
      { id: 4, label: "Cozinha — louças e utensílios conferidos", requiresPhoto: true },
      { id: 5, label: "Verificar danos em móveis e paredes", requiresPhoto: true },
      { id: 6, label: "Área externa — sem lixo ou itens esquecidos", requiresPhoto: true },
      { id: 7, label: "Chaves devolvidas", requiresPhoto: false },
      { id: 8, label: "Lixo descartado corretamente", requiresPhoto: true },
    ],
  },
};

function PhoneFrame({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 420);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 420);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  if (isMobile) {
    return (
      <div style={{ minHeight: "100vh", background: BRAND.black, fontFamily: "'DM Sans', sans-serif" }}>
        {children}
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #0d0d0d 0%, #1a1a1a 50%, #2a2118 100%)",
        fontFamily: "'DM Sans', sans-serif",
        padding: "20px 0",
      }}
    >
      <div
        style={{
          width: 375,
          height: 812,
          borderRadius: 44,
          background: BRAND.black,
          position: "relative",
          overflow: "hidden",
          boxShadow: `0 0 0 3px #333, 0 25px 80px rgba(0,0,0,0.6), 0 0 120px rgba(212,148,58,0.08)`,
        }}
      >
        {/* Notch */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: 150,
            height: 30,
            background: "#000",
            borderRadius: "0 0 20px 20px",
            zIndex: 10,
          }}
        />
        <div
          style={{
            height: "100%",
            overflowY: "auto",
            overflowX: "hidden",
            paddingTop: 36,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

function HomeScreen({ onSelect }: { onSelect: (id: string) => void }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const i = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(i);
  }, []);

  const greeting =
    time.getHours() < 12 ? "BOM DIA" : time.getHours() < 18 ? "BOA TARDE" : "BOA NOITE";

  return (
    <div style={{ padding: "24px 20px 32px" }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <div
          style={{
            color: BRAND.amber,
            fontSize: 11,
            letterSpacing: 3,
            fontWeight: 500,
            marginBottom: 6,
          }}
        >
          {greeting}
        </div>
        <div
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 32,
            fontWeight: 900,
            color: BRAND.white,
            lineHeight: 1.1,
          }}
        >
          Complô
        </div>
        <div style={{ color: BRAND.grey, fontSize: 14, fontWeight: 300, marginTop: 4 }}>
          Sistema de Check-in & Controle
        </div>
      </div>

      {/* Divider */}
      <div
        style={{
          height: 1,
          background: `linear-gradient(90deg, ${BRAND.amber}, transparent)`,
          opacity: 0.4,
          marginBottom: 24,
        }}
      />

      {/* Status cards */}
      <div style={{ display: "flex", gap: 12, marginBottom: 28 }}>
        <div
          style={{
            flex: 1,
            background: BRAND.card,
            borderRadius: 14,
            padding: "18px 16px",
            border: "1px solid rgba(212,148,58,0.1)",
          }}
        >
          <div style={{ fontSize: 32, fontWeight: 700, color: BRAND.white }}>4</div>
          <div style={{ fontSize: 11, color: BRAND.grey, marginTop: 2 }}>Pendentes hoje</div>
        </div>
        <div
          style={{
            flex: 1,
            background: BRAND.card,
            borderRadius: 14,
            padding: "18px 16px",
            border: "1px solid rgba(212,148,58,0.1)",
          }}
        >
          <div style={{ fontSize: 32, fontWeight: 700, color: BRAND.green }}>12</div>
          <div style={{ fontSize: 11, color: BRAND.grey, marginTop: 2 }}>Feitos esta semana</div>
        </div>
      </div>

      {/* Section title */}
      <div
        style={{
          fontSize: 11,
          letterSpacing: 2,
          color: BRAND.greyLight,
          textTransform: "uppercase",
          marginBottom: 14,
          fontWeight: 500,
        }}
      >
        Checklists
      </div>

      {/* Checklist Cards */}
      {Object.values(CHECKLISTS).map((cl) => (
        <div
          key={cl.id}
          onClick={() => onSelect(cl.id)}
          style={{
            background: BRAND.card,
            borderRadius: 18,
            padding: "20px 20px",
            marginBottom: 14,
            cursor: "pointer",
            border: "1px solid rgba(212,148,58,0.1)",
            transition: "all 0.2s ease",
            position: "relative",
            overflow: "hidden",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.border = "1px solid rgba(212,148,58,0.4)";
            e.currentTarget.style.transform = "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.border = "1px solid rgba(212,148,58,0.1)";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          {/* Background icon */}
          <div
            style={{
              position: "absolute",
              right: -10,
              bottom: -10,
              fontSize: 80,
              opacity: 0.06,
              pointerEvents: "none",
            }}
          >
            {cl.icon}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14, position: "relative" }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                background: `linear-gradient(135deg, ${BRAND.amber}, ${BRAND.amberDark})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
                flexShrink: 0,
              }}
            >
              {cl.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: BRAND.white }}>{cl.title}</div>
              <div style={{ fontSize: 12, color: BRAND.grey, marginTop: 2 }}>
                {cl.items.length} itens · {cl.items.filter((i) => i.requiresPhoto).length} fotos
                obrigatórias
              </div>
            </div>
            <div style={{ color: BRAND.amber, fontSize: 22, fontWeight: 300 }}>›</div>
          </div>
        </div>
      ))}

      {/* Bottom badge */}
      <div style={{ display: "flex", justifyContent: "center", marginTop: 24, paddingBottom: 16 }}>
        <div
          style={{
            background: "rgba(212,148,58,0.08)",
            border: "1px solid rgba(212,148,58,0.2)",
            borderRadius: 20,
            padding: "8px 18px",
            fontSize: 12,
            color: BRAND.amberLight,
            fontWeight: 500,
          }}
        >
          ⚡ Powered by Veehtor AI
        </div>
      </div>
    </div>
  );
}

function ChecklistScreen({
  checklistId,
  onBack,
  onComplete,
}: {
  checklistId: string;
  onBack: () => void;
  onComplete: (cl: Checklist) => void;
}) {
  const checklist = CHECKLISTS[checklistId];
  const [currentStep, setCurrentStep] = useState(0);
  const [completedItems, setCompletedItems] = useState<Record<number, boolean>>({});
  const [photoTaken, setPhotoTaken] = useState<Record<number, boolean>>({});
  const [showCamera, setShowCamera] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<{ passed: boolean; message: string } | null>(null);

  const item = checklist.items[currentStep];
  const progress = (Object.keys(completedItems).length / checklist.items.length) * 100;
  const canProceed = item?.requiresPhoto ? photoTaken[item.id] : true;

  const handlePhoto = () => {
    setShowCamera(true);
    setTimeout(() => {
      setShowCamera(false);
      setAnalyzing(true);
      setTimeout(() => {
        const passed = Math.random() > 0.25;
        setAiResult({
          passed,
          message: passed
            ? "Foto conforme o padrão. Item aprovado."
            : "Possível inconformidade detectada. Verifique e tire nova foto se necessário.",
        });
        setPhotoTaken((prev) => ({ ...prev, [item.id]: true }));
        setAnalyzing(false);
      }, 2000);
    }, 1500);
  };

  const handleNext = () => {
    setCompletedItems((prev) => ({ ...prev, [item.id]: true }));
    setAiResult(null);
    if (currentStep < checklist.items.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      onComplete(checklist);
    }
  };

  if (showCamera) {
    return (
      <div
        style={{
          height: "100%",
          minHeight: "100vh",
          background: "#000",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
        }}
      >
        <div style={{ color: BRAND.white, fontSize: 14, marginBottom: 32, textAlign: "center" }}>
          Fotografando: {item.label}
        </div>
        <div
          style={{
            width: 220,
            height: 220,
            border: `3px solid ${BRAND.amber}`,
            borderRadius: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animation: "complo-pulse 1.5s ease-in-out infinite",
          }}
        >
          <span style={{ fontSize: 48 }}>📷</span>
        </div>
        <div
          style={{
            color: BRAND.grey,
            fontSize: 14,
            marginTop: 24,
            animation: "complo-pulse 1.5s ease-in-out infinite",
          }}
        >
          Capturando imagem...
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "16px 20px 32px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <div
          onClick={onBack}
          style={{
            width: 36,
            height: 36,
            borderRadius: 12,
            background: BRAND.card,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: BRAND.white,
            fontSize: 18,
          }}
        >
          ←
        </div>
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 18,
              fontWeight: 700,
              color: BRAND.white,
            }}
          >
            {checklist.title}
          </div>
          <div style={{ fontSize: 12, color: BRAND.grey }}>
            Passo {currentStep + 1} de {checklist.items.length}
          </div>
        </div>
        <span style={{ fontSize: 28 }}>{checklist.icon}</span>
      </div>

      {/* Progress bar */}
      <div
        style={{
          height: 4,
          borderRadius: 2,
          background: "rgba(255,255,255,0.08)",
          marginBottom: 24,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${progress}%`,
            background: `linear-gradient(90deg, ${BRAND.amber}, ${BRAND.amberLight})`,
            borderRadius: 2,
            transition: "width 0.5s ease",
          }}
        />
      </div>

      {/* Current Item Card */}
      <div
        style={{
          background: BRAND.card,
          borderRadius: 20,
          padding: "24px 20px",
          border: "1px solid rgba(212,148,58,0.15)",
          marginBottom: 20,
        }}
      >
        <div
          style={{
            fontSize: 11,
            letterSpacing: 2,
            color: BRAND.amber,
            textTransform: "uppercase",
            fontWeight: 500,
            marginBottom: 10,
          }}
        >
          Item atual
        </div>
        <div style={{ fontSize: 20, fontWeight: 700, color: BRAND.white, lineHeight: 1.3 }}>
          {item.label}
        </div>
        {item.requiresPhoto && (
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              marginTop: 12,
              background: "rgba(212,148,58,0.1)",
              borderRadius: 8,
              padding: "6px 12px",
            }}
          >
            <span>📸</span>
            <span style={{ fontSize: 12, color: BRAND.amberLight, fontWeight: 500 }}>
              Foto obrigatória
            </span>
          </div>
        )}
      </div>

      {/* Photo button */}
      {item.requiresPhoto && !photoTaken[item.id] && !analyzing && !aiResult && (
        <div
          onClick={handlePhoto}
          style={{
            background: `linear-gradient(135deg, ${BRAND.amber}, ${BRAND.amberDark})`,
            borderRadius: 16,
            padding: "20px",
            textAlign: "center",
            cursor: "pointer",
            marginBottom: 20,
            transition: "transform 0.1s",
          }}
          onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.97)")}
          onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          <div style={{ fontSize: 32, marginBottom: 6 }}>📷</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: BRAND.white }}>Tirar Foto</div>
          <div style={{ fontSize: 12, color: "rgba(245,240,232,0.7)", marginTop: 4 }}>
            Toque para abrir a câmera
          </div>
        </div>
      )}

      {/* Analyzing */}
      {analyzing && (
        <div
          style={{
            textAlign: "center",
            padding: "32px 20px",
            marginBottom: 20,
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              border: `3px solid ${BRAND.card}`,
              borderTopColor: BRAND.amber,
              borderRadius: "50%",
              animation: "complo-spin 1s linear infinite",
              margin: "0 auto 16px",
            }}
          />
          <div style={{ color: BRAND.white, fontSize: 16, fontWeight: 500 }}>
            AI analisando foto...
          </div>
          <div style={{ color: BRAND.grey, fontSize: 13, marginTop: 6 }}>
            Comparando com o padrão de referência
          </div>
        </div>
      )}

      {/* AI Result */}
      {aiResult && (
        <div
          style={{
            background: aiResult.passed
              ? "rgba(76,175,80,0.1)"
              : "rgba(231,76,60,0.1)",
            border: `1px solid ${aiResult.passed ? "rgba(76,175,80,0.3)" : "rgba(231,76,60,0.3)"}`,
            borderRadius: 16,
            padding: "16px 18px",
            marginBottom: 16,
          }}
        >
          <div
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: aiResult.passed ? BRAND.green : BRAND.red,
              marginBottom: 6,
            }}
          >
            {aiResult.passed ? "✅ Aprovado pela AI" : "⚠️ Atenção"}
          </div>
          <div style={{ fontSize: 13, color: BRAND.white, lineHeight: 1.5 }}>
            {aiResult.message}
          </div>
          {!aiResult.passed && (
            <div
              onClick={handlePhoto}
              style={{
                marginTop: 12,
                padding: "10px 16px",
                background: "rgba(231,76,60,0.15)",
                borderRadius: 10,
                cursor: "pointer",
                textAlign: "center",
                color: BRAND.red,
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              📷 Tirar nova foto
            </div>
          )}
        </div>
      )}

      {/* Photo taken indicator */}
      {photoTaken[item.id] && !analyzing && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "12px 16px",
            background: "rgba(76,175,80,0.08)",
            borderRadius: 12,
            marginBottom: 16,
          }}
        >
          <span style={{ fontSize: 18 }}>✅</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: BRAND.green }}>Foto registrada</div>
            <div style={{ fontSize: 11, color: BRAND.grey }}>
              {new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
            </div>
          </div>
        </div>
      )}

      {/* Next / Complete button */}
      <div
        onClick={canProceed ? handleNext : undefined}
        style={{
          padding: "16px",
          borderRadius: 16,
          textAlign: "center",
          cursor: canProceed ? "pointer" : "not-allowed",
          opacity: canProceed ? 1 : 0.4,
          background: canProceed
            ? `linear-gradient(135deg, ${BRAND.amber}, ${BRAND.amberDark})`
            : BRAND.card,
          marginBottom: 28,
          transition: "all 0.2s ease",
        }}
      >
        <span style={{ color: BRAND.white, fontSize: 15, fontWeight: 700 }}>
          {currentStep < checklist.items.length - 1 ? "Próximo Item →" : "Finalizar Checklist ✓"}
        </span>
      </div>

      {/* Item list mini */}
      <div
        style={{
          fontSize: 11,
          letterSpacing: 2,
          color: BRAND.greyLight,
          textTransform: "uppercase",
          fontWeight: 500,
          marginBottom: 12,
        }}
      >
        Todos os itens
      </div>
      {checklist.items.map((it, idx) => (
        <div
          key={it.id}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 0",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
            opacity: idx > currentStep && !completedItems[it.id] ? 0.5 : 1,
          }}
        >
          <div
            style={{
              width: 24,
              height: 24,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 11,
              fontWeight: 700,
              flexShrink: 0,
              background: completedItems[it.id]
                ? BRAND.green
                : idx === currentStep
                ? BRAND.amber
                : "#333",
              color: BRAND.white,
            }}
          >
            {completedItems[it.id] ? "✓" : idx + 1}
          </div>
          <div
            style={{
              flex: 1,
              fontSize: 13,
              color: completedItems[it.id] ? BRAND.grey : BRAND.white,
              textDecoration: completedItems[it.id] ? "line-through" : "none",
            }}
          >
            {it.label}
          </div>
          {it.requiresPhoto && (
            <span style={{ fontSize: 12, opacity: photoTaken[it.id] ? 1 : 0.3 }}>📸</span>
          )}
        </div>
      ))}
      <div style={{ height: 20 }} />
    </div>
  );
}

function CompletionScreen({
  checklist,
  onBack,
}: {
  checklist: Checklist;
  onBack: () => void;
}) {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSend = () => {
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSent(true);
    }, 2000);
  };

  return (
    <div style={{ padding: "48px 20px 32px", textAlign: "center" }}>
      {/* Success animation */}
      <div
        style={{
          width: 100,
          height: 100,
          borderRadius: "50%",
          background: `linear-gradient(135deg, ${BRAND.amber}, ${BRAND.amberDark})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 24px",
          fontSize: 44,
          color: BRAND.white,
          animation: "complo-pop 0.6s ease-out",
        }}
      >
        ✓
      </div>

      <div
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 28,
          fontWeight: 900,
          color: BRAND.white,
          marginBottom: 8,
        }}
      >
        Checklist Completo!
      </div>
      <div style={{ fontSize: 14, color: BRAND.grey, marginBottom: 32 }}>
        {checklist.title} finalizado com sucesso
      </div>

      {/* Summary card */}
      <div
        style={{
          background: BRAND.card,
          borderRadius: 20,
          padding: "24px 20px",
          marginBottom: 20,
          textAlign: "left",
          border: "1px solid rgba(212,148,58,0.1)",
        }}
      >
        <div
          style={{
            fontSize: 11,
            letterSpacing: 2,
            color: BRAND.amber,
            textTransform: "uppercase",
            fontWeight: 500,
            marginBottom: 16,
          }}
        >
          Resumo
        </div>
        <div style={{ display: "flex", gap: 12, marginBottom: 18 }}>
          <div
            style={{
              flex: 1,
              background: "rgba(76,175,80,0.1)",
              borderRadius: 14,
              padding: "14px 12px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 24, fontWeight: 700, color: BRAND.green }}>
              {checklist.items.length}
            </div>
            <div style={{ fontSize: 11, color: BRAND.grey }}>Itens verificados</div>
          </div>
          <div
            style={{
              flex: 1,
              background: "rgba(212,148,58,0.1)",
              borderRadius: 14,
              padding: "14px 12px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 24, fontWeight: 700, color: BRAND.amber }}>
              {checklist.items.filter((i) => i.requiresPhoto).length}
            </div>
            <div style={{ fontSize: 11, color: BRAND.grey }}>Fotos enviadas</div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "10px 0",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <span style={{ fontSize: 13, color: BRAND.grey }}>Responsável</span>
          <span style={{ fontSize: 13, color: BRAND.white, fontWeight: 500 }}>João Silva</span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "10px 0",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <span style={{ fontSize: 13, color: BRAND.grey }}>Data / Hora</span>
          <span style={{ fontSize: 13, color: BRAND.white, fontWeight: 500 }}>
            {new Date().toLocaleDateString("pt-BR")} ·{" "}
            {new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
          </span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "10px 0",
          }}
        >
          <span style={{ fontSize: 13, color: BRAND.grey }}>Status AI</span>
          <span style={{ fontSize: 13, color: BRAND.green, fontWeight: 600 }}>Aprovado ✓</span>
        </div>
      </div>

      {/* WhatsApp */}
      {!sent ? (
        <div
          onClick={!sending ? handleSend : undefined}
          style={{
            background: "#25D366",
            borderRadius: 16,
            padding: "16px",
            cursor: sending ? "wait" : "pointer",
            marginBottom: 12,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            transition: "all 0.2s",
          }}
        >
          {sending ? (
            <>
              <div
                style={{
                  width: 20,
                  height: 20,
                  border: "2px solid rgba(255,255,255,0.3)",
                  borderTopColor: "#fff",
                  borderRadius: "50%",
                  animation: "complo-spin 1s linear infinite",
                }}
              />
              <span style={{ color: BRAND.white, fontWeight: 600, fontSize: 14 }}>
                Enviando para WhatsApp...
              </span>
            </>
          ) : (
            <>
              <span style={{ fontSize: 18 }}>💬</span>
              <span style={{ color: BRAND.white, fontWeight: 700, fontSize: 14 }}>
                Enviar Relatório via WhatsApp
              </span>
            </>
          )}
        </div>
      ) : (
        <div
          style={{
            background: "rgba(37,211,102,0.1)",
            border: "1px solid rgba(37,211,102,0.3)",
            borderRadius: 16,
            padding: "16px",
            marginBottom: 12,
          }}
        >
          <div style={{ color: BRAND.green, fontWeight: 700, fontSize: 15 }}>
            ✓ Relatório enviado!
          </div>
          <div style={{ color: BRAND.grey, fontSize: 13, marginTop: 4 }}>
            Grupo "Gerência Complô" notificado
          </div>
        </div>
      )}

      {/* Back */}
      <div
        onClick={onBack}
        style={{
          background: BRAND.card,
          borderRadius: 16,
          padding: "16px",
          cursor: "pointer",
          marginBottom: 20,
          border: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <span style={{ color: BRAND.white, fontWeight: 600, fontSize: 14 }}>
          ← Voltar ao Início
        </span>
      </div>

      <div style={{ height: 20 }} />
    </div>
  );
}

const Complo = () => {
  const [screen, setScreen] = useState<"home" | "checklist" | "complete">("home");
  const [selectedChecklist, setSelectedChecklist] = useState<string | null>(null);
  const [completedChecklist, setCompletedChecklist] = useState<Checklist | null>(null);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,500;0,9..40,700&family=Playfair+Display:wght@700;900&display=swap');
        @keyframes complo-pulse { 0%,100% { opacity: 0.6; } 50% { opacity: 1; } }
        @keyframes complo-spin { to { transform: rotate(360deg); } }
        @keyframes complo-pop { 0% { transform: scale(0); } 50% { transform: scale(1.15); } 100% { transform: scale(1); } }
      `}</style>
      <PhoneFrame>
        {screen === "home" && (
          <HomeScreen
            onSelect={(id) => {
              setSelectedChecklist(id);
              setScreen("checklist");
            }}
          />
        )}
        {screen === "checklist" && selectedChecklist && (
          <ChecklistScreen
            checklistId={selectedChecklist}
            onBack={() => setScreen("home")}
            onComplete={(cl) => {
              setCompletedChecklist(cl);
              setScreen("complete");
            }}
          />
        )}
        {screen === "complete" && completedChecklist && (
          <CompletionScreen
            checklist={completedChecklist}
            onBack={() => {
              setScreen("home");
              setSelectedChecklist(null);
              setCompletedChecklist(null);
            }}
          />
        )}
      </PhoneFrame>
    </>
  );
};

export default Complo;
