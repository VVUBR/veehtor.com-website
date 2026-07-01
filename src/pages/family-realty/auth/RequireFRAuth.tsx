import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useFRAuth } from "./FRAuthProvider";

export default function RequireFRAuth({ children }: { children: ReactNode }) {
  const { session, loading } = useFRAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#041C2C", color: "#EAAA00", fontFamily: "Roboto, system-ui, sans-serif" }}>
        Carregando…
      </div>
    );
  }
  if (!session) {
    return <Navigate to="/family-realty/login" state={{ from: location.pathname }} replace />;
  }
  return <>{children}</>;
}
